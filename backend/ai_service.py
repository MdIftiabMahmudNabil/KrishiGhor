import numpy as np
from sklearn.neighbors import NearestNeighbors
import joblib
from flask import Flask, jsonify, request, send_file
from supabase import create_client
import os
from dotenv import load_dotenv
import uuid
from datetime import datetime
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
import tempfile

load_dotenv()

app = Flask(__name__)

# Configure Supabase
supabase = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_KEY'))

# Email configuration
EMAIL_HOST = os.getenv('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = os.getenv('EMAIL_PORT', 587)
EMAIL_USER = os.getenv('EMAIL_USER')
EMAIL_PASS = os.getenv('EMAIL_PASS')

def train_model(crop_data):
    # Feature engineering
    features = []
    for crop in crop_data:
        features.append([
            len(crop['name']),        # Name length
            float(crop['price']),     # Price
            float(crop['quantity']),  # Quantity
            1 if 'vegetable' in crop['type'].lower() else 0,
            1 if 'fruit' in crop['type'].lower() else 0
        ])
    
    X = np.array(features)
    model = NearestNeighbors(n_neighbors=3, metric='cosine')
    model.fit(X)
    joblib.dump(model, 'crop_model.joblib')
    return model

def get_ai_recommendations(cart_items, supabase):
    all_crops = supabase.table('crops').select('*').execute().data
    
    try:
        model = joblib.load('crop_model.joblib')
    except:
        model = train_model(all_crops)
    
    recommendations = []
    
    for item in cart_items:
        item_features = [
            len(item['name']),
            float(item['price']),
            float(item.get('quantity', 1)),
            1 if 'vegetable' in item['type'].lower() else 0,
            1 if 'fruit' in item['type'].lower() else 0
        ]
        
        distances, indices = model.kneighbors([item_features])
        
        for idx in indices[0]:
            if all_crops[idx]['id'] != item.get('id'):
                recommendations.append(all_crops[idx])
    
    unique_recs = []
    seen_ids = set()
    for crop in recommendations:
        if crop['id'] not in seen_ids:
            unique_recs.append(crop)
            seen_ids.add(crop['id'])
    
    return unique_recs[:3]

@app.route('/api/crops', methods=['GET'])
def get_crops():
    search = request.args.get('search', '')
    crop_type = request.args.get('type', '')
    region = request.args.get('region', '')
    
    query = supabase.table('crops').select('*')
    
    if search:
        query = query.ilike('name', f'%{search}%')
    if crop_type:
        query = query.eq('type', crop_type)
    if region:
        query = query.eq('region', region)
    
    crops = query.execute()
    return jsonify(crops.data)

@app.route('/api/recommendations', methods=['POST'])
def recommendations():
    try:
        cart_items = request.json.get('cart', [])
        recommendations = get_ai_recommendations(cart_items, supabase)
        return jsonify({
            'success': True,
            'recommendations': recommendations
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/orders', methods=['POST'])
def create_order():
    try:
        order_data = request.json
        user_id = order_data.get('user_id')
        items = order_data.get('items', [])
        shipping_info = order_data.get('shipping_info', {})
        payment_method = order_data.get('payment_method', 'cash_on_delivery')
        
        # Calculate total
        total = sum(item['price'] * item['quantity'] for item in items)
        
        # Create order record
        order_id = str(uuid.uuid4())
        order_record = {
            'id': order_id,
            'user_id': user_id,
            'order_date': datetime.now().isoformat(),
            'total_amount': total,
            'status': 'pending',
            'payment_method': payment_method,
            'shipping_address': shipping_info.get('address'),
            'shipping_region': shipping_info.get('region'),
            'shipping_phone': shipping_info.get('phone'),
            'shipping_email': shipping_info.get('email')
        }
        
        # Insert into Supabase
        supabase.table('orders').insert(order_record).execute()
        
        # Create order items
        for item in items:
            order_item = {
                'order_id': order_id,
                'crop_id': item['id'],
                'quantity': item['quantity'],
                'unit_price': item['price'],
                'total_price': item['price'] * item['quantity']
            }
            supabase.table('order_items').insert(order_item).execute()
        
        # Process payment if not cash on delivery
        if payment_method != 'cash_on_delivery':
            payment_result = process_payment(order_id, total, payment_method)
            if not payment_result.get('success'):
                return jsonify({
                    'success': False,
                    'error': payment_result.get('error', 'Payment failed')
                }), 400
        
        # Send confirmation email
        send_order_confirmation(order_record, items)
        
        return jsonify({
            'success': True,
            'order_id': order_id,
            'message': 'Order created successfully'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/orders/<user_id>', methods=['GET'])
def get_user_orders(user_id):
    try:
        # Get orders
        orders = supabase.table('orders').select('*').eq('user_id', user_id).execute().data
        
        # Get order items for each order
        for order in orders:
            items = supabase.table('order_items').select('*, crops(name, type)').eq('order_id', order['id']).execute().data
            order['items'] = items
        
        return jsonify({
            'success': True,
            'orders': orders
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/orders/invoice/<order_id>', methods=['GET'])
def generate_invoice(order_id):
    try:
        # Get order data
        order = supabase.table('orders').select('*').eq('id', order_id).execute().data
        if not order:
            return jsonify({'success': False, 'error': 'Order not found'}), 404
        
        order = order[0]
        items = supabase.table('order_items').select('*, crops(name)').eq('order_id', order_id).execute().data
        
        # Create PDF invoice
        pdf_file = create_invoice_pdf(order, items)
        
        return send_file(
            pdf_file,
            as_attachment=True,
            download_name=f'invoice_{order_id}.pdf',
            mimetype='application/pdf'
        )
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def process_payment(order_id, amount, method):
    """Simulate payment processing (in a real app, integrate with bKash API)"""
    if method == 'bkash':
        return {'success': True, 'transaction_id': f'BKASH_{uuid.uuid4()}'}
    else:
        return {'success': False, 'error': 'Unsupported payment method'}

def send_order_confirmation(order, items):
    """Send order confirmation email"""
    if not EMAIL_USER or not EMAIL_PASS:
        print("Email not configured - skipping email sending")
        return
    
    msg = MIMEMultipart()
    msg['From'] = EMAIL_USER
    msg['To'] = order['shipping_email']
    msg['Subject'] = f"KrishiGhor Order Confirmation - #{order['id']}"
    
    # Create email body
    email_body = f"""
    <h2>Thank you for your order!</h2>
    <p>Your order #{order['id']} has been received and is being processed.</p>
    
    <h3>Order Summary</h3>
    <table border="1" cellpadding="5" cellspacing="0">
        <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
        </tr>
    """
    
    for item in items:
        email_body += f"""
        <tr>
            <td>{item['crops']['name']}</td>
            <td>{item['quantity']}</td>
            <td>৳{item['unit_price']}</td>
            <td>৳{item['total_price']}</td>
        </tr>
        """
    
    email_body += f"""
    </table>
    <p><strong>Total Amount: ৳{order['total_amount']}</strong></p>
    
    <h3>Shipping Information</h3>
    <p>Address: {order['shipping_address']}</p>
    <p>Region: {order['shipping_region']}</p>
    <p>Phone: {order['shipping_phone']}</p>
    
    <p>We'll notify you when your order ships. Thank you for shopping with KrishiGhor!</p>
    """
    
    msg.attach(MIMEText(email_body, 'html'))
    
    try:
        with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASS)
            server.send_message(msg)
    except Exception as e:
        print(f"Failed to send email: {str(e)}")

def create_invoice_pdf(order, items):
    """Generate PDF invoice using ReportLab"""
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
    filename = temp_file.name
    
    doc = SimpleDocTemplate(filename, pagesize=letter)
    styles = getSampleStyleSheet()
    
    elements = []
    
    elements.append(Paragraph("KrishiGhor - Bangladesh Crop Marketplace", styles['Title']))
    elements.append(Paragraph("Invoice", styles['Heading1']))
    elements.append(Spacer(1, 12))
    
    elements.append(Paragraph(f"<b>Order ID:</b> {order['id']}", styles['Normal']))
    elements.append(Paragraph(f"<b>Date:</b> {order['order_date']}", styles['Normal']))
    elements.append(Paragraph(f"<b>Status:</b> {order['status'].capitalize()}", styles['Normal']))
    elements.append(Spacer(1, 24))
    
    elements.append(Paragraph("<b>Shipping Information:</b>", styles['Heading2']))
    elements.append(Paragraph(f"Email: {order['shipping_email']}", styles['Normal']))
    elements.append(Paragraph(f"Phone: {order['shipping_phone']}", styles['Normal']))
    elements.append(Paragraph(f"Address: {order['shipping_address']}", styles['Normal']))
    elements.append(Paragraph(f"Region: {order['shipping_region']}", styles['Normal']))
    elements.append(Spacer(1, 24))
    
    table_data = [['Item', 'Quantity', 'Unit Price', 'Total']]
    for item in items:
        table_data.append([
            item['crops']['name'],
            str(item['quantity']),
            f"৳{item['unit_price']:.2f}",
            f"৳{item['total_price']:.2f}"
        ])
    
    table_data.append(['', '', '<b>Total:</b>', f"<b>৳{order['total_amount']:.2f}</b>"])
    
    items_table = Table(table_data, colWidths=[250, 80, 80, 80])
    items_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -2), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    
    elements.append(items_table)
    elements.append(Spacer(1, 36))
    
    elements.append(Paragraph("Thank you for your business!", styles['Normal']))
    elements.append(Paragraph("KrishiGhor - Transparent Crop Pricing & Supply Chain Platform", styles['Italic']))
    
    doc.build(elements)
    return filename

if __name__ == '__main__':
    app.run(debug=True)