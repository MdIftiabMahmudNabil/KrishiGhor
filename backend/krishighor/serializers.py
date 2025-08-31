from rest_framework import serializers
from .models import CropType, VehicleType, District, Market, TransportRequest, VehicleInfo, TrackingEvent
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class CropTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CropType
        fields = '__all__'

class VehicleTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleType
        fields = '__all__'

class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = '__all__'

class MarketSerializer(serializers.ModelSerializer):
    district_name = serializers.CharField(source='district.name', read_only=True)
    
    class Meta:
        model = Market
        fields = '__all__'

class TransportRequestSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    crop_type_name = serializers.CharField(source='crop_type.name', read_only=True)
    vehicle_type_name = serializers.CharField(source='vehicle_type.name', read_only=True)
    destination_district_name = serializers.CharField(source='destination_district.name', read_only=True)
    destination_market_name = serializers.CharField(source='destination_market.name', read_only=True)
    
    class Meta:
        model = TransportRequest
        fields = '__all__'

class VehicleInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleInfo
        fields = '__all__'

class TrackingEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrackingEvent
        fields = '__all__'