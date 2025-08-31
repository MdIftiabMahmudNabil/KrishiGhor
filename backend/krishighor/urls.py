from django.urls import path
from . import views

urlpatterns = [
    path('api/tracking/<str:tracking_number>/', views.tracking_details, name='tracking_details'),
    path('api/transport-requests/', views.create_transport_request, name='create_transport_request'),
    path('api/transport-requests/user/', views.user_transport_requests, name='user_transport_requests'),
    path('api/districts/', views.district_list, name='district_list'),
    path('api/markets/<int:district_id>/', views.market_list, name='market_list'),
    path('api/vehicle-types/', views.vehicle_type_list, name='vehicle_type_list'),
    path('api/crop-types/', views.crop_type_list, name='crop_type_list'),
    path('api/estimate-cost/', views.estimate_cost, name='estimate_cost'),
]