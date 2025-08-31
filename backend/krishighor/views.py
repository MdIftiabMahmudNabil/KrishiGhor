from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
import json
from datetime import datetime
from .models import TransportRequest, District, Market, VehicleType, CropType
from .serializers import TransportRequestSerializer, DistrictSerializer, MarketSerializer, VehicleTypeSerializer, CropTypeSerializer

@api_view(['GET'])
@permission_classes([AllowAny])
def tracking_details(request, tracking_number):
    try:
        transport_request = TransportRequest.objects.get(tracking_number=tracking_number)
        serializer = TransportRequestSerializer(transport_request)
        return Response(serializer.data)
    except TransportRequest.DoesNotExist:
        return Response({'error': 'Tracking number not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_transport_request(request):
    data = request.data.copy()
    data['user'] = request.user.id
    
    # Generate tracking number
    year = datetime.now().year
    last_request = TransportRequest.objects.filter(
        tracking_number__startswith=f"KG-{year}-"
    ).order_by('tracking_number').last()
    
    if last_request:
        last_num = int(last_request.tracking_number.split('-')[-1])
        new_num = last_num + 1
    else:
        new_num = 1
        
    data['tracking_number'] = f"KG-{year}-{new_num:06d}"
    
    serializer = TransportRequestSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_transport_requests(request):
    transport_requests = TransportRequest.objects.filter(user=request.user).order_by('-created_at')
    serializer = TransportRequestSerializer(transport_requests, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def district_list(request):
    districts = District.objects.all()
    serializer = DistrictSerializer(districts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def market_list(request, district_id):
    markets = Market.objects.filter(district_id=district_id)
    serializer = MarketSerializer(markets, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def vehicle_type_list(request):
    vehicle_types = VehicleType.objects.all()
    serializer = VehicleTypeSerializer(vehicle_types, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def crop_type_list(request):
    crop_types = CropType.objects.all()
    serializer = CropTypeSerializer(crop_types, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny])
def estimate_cost(request):
    # Extract parameters from request
    crop_type_id = request.data.get('crop_type')
    quantity = request.data.get('quantity')
    vehicle_type_id = request.data.get('vehicle_type')
    district_id = request.data.get('district')
    
    # Calculate estimated cost based on your business logic
    # This is a simplified example
    base_cost_per_km = 5
    distance = 100  # This should be calculated based on origin and destination
    
    try:
        vehicle_type = VehicleType.objects.get(id=vehicle_type_id)
        estimated_cost = distance * vehicle_type.cost_per_km * (int(quantity) / 100)
        
        # Add other factors like crop type, market prices, etc.
        
        return Response({
            'estimated_cost': round(estimated_cost, 2),
            'distance_km': distance,
            'estimated_time_minutes': int(distance * 1.2)  # Simplified calculation
        })
    except (VehicleType.DoesNotExist, ValueError):
        return Response({'error': 'Invalid parameters'}, status=status.HTTP_400_BAD_REQUEST)