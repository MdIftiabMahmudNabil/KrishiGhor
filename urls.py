from django.urls import path
from .views import (
    price_dashboard, profit_insight,
    price_list, add_price, edit_price, delete_price
)

urlpatterns = [
    path('', price_dashboard, name='dashboard'),           # Dashboard page
    path('insights/', profit_insight, name='insights'),    # Insights page
    path('prices/', price_list, name='price_list'),        # Price list
    path('prices/add/', add_price, name='add_price'),      # Add price
    path('prices/edit/<int:pk>/', edit_price, name='edit_price'),    # Edit price
    path('prices/delete/<int:pk>/', delete_price, name='delete_price'),  # Delete price
]
