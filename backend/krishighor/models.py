from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator

class CropType(models.Model):
    name = models.CharField(max_length=100)
    name_bn = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name

class VehicleType(models.Model):
    name = models.CharField(max_length=100)
    name_bn = models.CharField(max_length=100)
    capacity_kg = models.IntegerField()
    cost_per_km = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return self.name

class District(models.Model):
    name = models.CharField(max_length=100)
    name_bn = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name

class Market(models.Model):
    district = models.ForeignKey(District, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    name_bn = models.CharField(max_length=100)
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return f"{self.name}, {self.district.name}"

class TransportRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in-transit', 'In Transit'),
        ('delivered', 'Delivered'),
    ]
    
    tracking_number = models.CharField(max_length=20, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    crop_type = models.ForeignKey(CropType, on_delete=models.CASCADE)
    quantity_kg = models.IntegerField(validators=[MinValueValidator(1)])
    vehicle_type = models.ForeignKey(VehicleType, on_delete=models.CASCADE)
    origin_location = models.CharField(max_length=255)
    destination_district = models.ForeignKey(District, on_delete=models.CASCADE)
    destination_market = models.ForeignKey(Market, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    estimated_cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    actual_cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    estimated_time_minutes = models.IntegerField(null=True, blank=True)
    actual_time_minutes = models.IntegerField(null=True, blank=True)
    distance_km = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.tracking_number

class VehicleInfo(models.Model):
    transport_request = models.OneToOneField(TransportRequest, on_delete=models.CASCADE)
    vehicle_number = models.CharField(max_length=50)
    driver_name = models.CharField(max_length=100)
    driver_phone = models.CharField(max_length=15)
    current_speed = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    remaining_distance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    remaining_time = models.IntegerField(default=0)  # in minutes
    
    def __str__(self):
        return self.vehicle_number

class TrackingEvent(models.Model):
    transport_request = models.ForeignKey(TransportRequest, on_delete=models.CASCADE)
    event_type = models.CharField(max_length=50)  # pickup, transit, delivery
    timestamp = models.DateTimeField(auto_now_add=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.transport_request.tracking_number} - {self.event_type}"