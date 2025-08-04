from supabase import create_client
import os

def get_ai_recommendations(cart_items):
    """Simple AI model suggesting crops based on cart contents"""
    SUPABASE_URL = os.getenv('SUPABASE_URL')
    SUPABASE_KEY = os.getenv('SUPABASE_KEY')
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # Get all crops
    all_crops = supabase.table('crops').select('*').execute().data
    
    # Simple recommendation logic (replace with real ML model)
    recommendations = []
    for item in cart_items:
        similar_crops = [c for c in all_crops 
                        if c['type'] == item['type'] 
                        and c['id'] != item['id']]
        recommendations.extend(similar_crops[:2])  # Top 2 per item
    
    return recommendations[:5]  # Return top 5 total