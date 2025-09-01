from django.shortcuts import render, redirect
from django.db import connection
from collections import defaultdict
import json
from .models import PriceData, Crop

# Default data for dropdowns
DEFAULT_CROPS = ["Wheat", "Rice", "Corn", "Potato", "Tomato"]
DEFAULT_REGIONS = ["Dhaka", "Chittagong", "Khulna", "Rajshahi", "Sylhet"]

def get_dropdown_options():
    # Get crops from DB
    with connection.cursor() as cursor:
        cursor.execute("SELECT DISTINCT name FROM pricing_crop")
        db_crops = [row[0] for row in cursor.fetchall()]
        crops = list(sorted(set(DEFAULT_CROPS + db_crops)))  # merge with default

        cursor.execute("SELECT DISTINCT region FROM pricing_pricedata")
        db_regions = [row[0] for row in cursor.fetchall()]
        regions = list(sorted(set(DEFAULT_REGIONS + db_regions)))  # merge with default

    return crops, regions



def price_dashboard(request):
    crop_filter = request.GET.get('crop', '')
    region_filter = request.GET.get('region', '')
    date_filter = request.GET.get('date', '')

    sql = "SELECT c.name, p.region, p.price, p.date FROM pricing_pricedata p JOIN pricing_crop c ON p.crop_id = c.id WHERE 1=1"
    params = []

    if crop_filter:
        sql += " AND c.name = %s"
        params.append(crop_filter)
    if region_filter:
        sql += " AND p.region = %s"
        params.append(region_filter)
    if date_filter:
        sql += " AND p.date = %s"
        params.append(date_filter)

    sql += " ORDER BY p.date ASC"

    with connection.cursor() as cursor:
        cursor.execute(sql, params)
        rows = cursor.fetchall()

    data = []
    chart_dict = defaultdict(lambda: defaultdict(list))
    all_dates_set = set()

    for row in rows:
        crop, region, price, date = row
        data.append({'crop': crop, 'region': region, 'price': float(price), 'date': date})
        chart_dict[crop][region].append((date, float(price)))
        all_dates_set.add(date)

    all_dates = sorted(list(all_dates_set))
    datasets = []
    color_palette = ["#06470c", "#088c0d", "#0bbd1c", "#16e52d", "#66ff66", "#33cc33"]
    color_index = 0

    for crop, regions in chart_dict.items():
        price_per_date = {date: [] for date in all_dates}
        for region_prices in regions.values():
            for date, price in region_prices:
                price_per_date[date].append(price)

        avg_price_per_date = [sum(prices)/len(prices) if prices else 0 for date, prices in sorted(price_per_date.items())]

        datasets.append({
            "label": crop,
            "data": avg_price_per_date,
            "borderColor": color_palette[color_index % len(color_palette)],
            "backgroundColor": color_palette[color_index % len(color_palette)],
            "fill": False,
            "tension": 0.4  # curved lines
        })
        color_index += 1

    chart_data = {"labels": [str(d) for d in all_dates], "datasets": datasets}
    crops, regions = get_dropdown_options()

    return render(request, "pricing/dashboard.html", {
        "data": data,
        "chart_data_json": json.dumps(chart_data),
        "crops": crops,
        "regions": regions,
        "selected_crop": crop_filter,
        "selected_region": region_filter,
        "selected_date": date_filter
    })


def profit_insight(request):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT region, AVG(price) as avg_price, MAX(price) as max_price, MIN(price) as min_price
            FROM pricing_pricedata
            GROUP BY region
        """)
        insights = cursor.fetchall()

    return render(request, "pricing/insights.html", {"insights": insights})


def price_list(request):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT p.id, c.name, p.region, p.price, p.date
            FROM pricing_pricedata p
            JOIN pricing_crop c ON p.crop_id = c.id
            ORDER BY p.date DESC
        """)
        data = cursor.fetchall()
    return render(request, "pricing/price_list.html", {"data": data})


def add_price(request):
    crops, regions = get_dropdown_options()

    if request.method == "POST":
        crop_name = request.POST.get("crop") or DEFAULT_CROPS[0]
        region = request.POST.get("region") or DEFAULT_REGIONS[0]
        price = request.POST.get("price")
        date = request.POST.get("date")

        crop, _ = Crop.objects.get_or_create(name=crop_name)

        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO pricing_pricedata (crop_id, region, price, date)
                VALUES (%s, %s, %s, %s)
            """, [crop.id, region, price, date])

        return redirect("price_list")

    return render(request, "pricing/add_price.html", {
        "crops": crops,
        "regions": regions,
        "selected_crop": DEFAULT_CROPS[0],
        "selected_region": DEFAULT_REGIONS[0]
    })


def edit_price(request, pk):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT p.id, c.name, p.region, p.price, p.date
            FROM pricing_pricedata p
            JOIN pricing_crop c ON p.crop_id = c.id
            WHERE p.id = %s
        """, [pk])
        row = cursor.fetchone()

    if not row:
        return redirect("price_list")

    crops, regions = get_dropdown_options()
    price_data = {"id": row[0], "crop": row[1], "region": row[2], "price": row[3], "date": row[4]}

    if request.method == "POST":
        crop_name = request.POST.get("crop") or DEFAULT_CROPS[0]
        region = request.POST.get("region") or DEFAULT_REGIONS[0]
        price = request.POST.get("price")
        date = request.POST.get("date")

        crop, _ = Crop.objects.get_or_create(name=crop_name)
        with connection.cursor() as cursor:
            cursor.execute("""
                UPDATE pricing_pricedata
                SET crop_id=%s, region=%s, price=%s, date=%s
                WHERE id=%s
            """, [crop.id, region, price, date, pk])

        return redirect("price_list")

    return render(request, "pricing/edit_price.html", {
        "price": price_data,
        "crops": crops,
        "regions": regions,
        "selected_crop": price_data["crop"],
        "selected_region": price_data["region"]
    })


def delete_price(request, pk):
    with connection.cursor() as cursor:
        cursor.execute("DELETE FROM pricing_pricedata WHERE id=%s", [pk])
    return redirect("price_list")
