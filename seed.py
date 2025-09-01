from django.core.management.base import BaseCommand
from django.db import connection
import datetime

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        with connection.cursor() as cursor:
            cursor.execute("INSERT INTO pricing_crop (name) VALUES ('Wheat')")
            cursor.execute("INSERT INTO pricing_crop (name) VALUES ('Rice')")

            today = datetime.date.today()
            cursor.execute("""
                INSERT INTO pricing_pricedata (crop_id, region, price, date) 
                VALUES (1, 'Dhaka', 25.50, %s), 
                       (1, 'Chittagong', 27.00, %s),
                       (2, 'Dhaka', 50.00, %s),
                       (2, 'Khulna', 48.00, %s)
            """, [today, today, today, today])
