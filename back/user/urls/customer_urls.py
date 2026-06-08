from django.urls import path
from user.views import customer_views

urlpatterns = [
    path('vendors/', customer_views.VendorCatalogueView.as_view(), name='vendor_catalogue'),
    path('vendors/<str:vendorid>/', customer_views.VendorDetailView.as_view(), name='vendor_detail'),
    path('orders/', customer_views.OrderListView.as_view(), name='customer_orders'),
]