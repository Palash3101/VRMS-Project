from django.urls import path

from user.views import admin_views

urlpatterns = [
    path('vendors/', admin_views.VendorListView.as_view(), name='vendor_list'),
    path('vendors/<str:vendor_id>/', admin_views.ViewVendorData.as_view(), name='view_vendor_data'),
    path('customers/', admin_views.CustomerListView.as_view(), name='customer_list'),
    path('customers/<str:customer_id>/', admin_views.ViewCustomerData.as_view(), name='view_customer_data'),
    path('orders/', admin_views.OrderListView.as_view(), name='order_list'),
]