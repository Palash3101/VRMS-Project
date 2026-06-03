from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import user_views, admin_views, notification_views, customer_views, product_views, inquiry_views, order_views, ticket_views,vendor_views

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', user_views.SignUpView.as_view(), name='sign_up'),

    path('users/', user_views.UserListView.as_view(), name='user_list'),
    path('notifications/', notification_views.NotificationListView.as_view(), name='notification_list'),

    path('admin/customer_detail/<str:customer_id>/', admin_views.CustomerDetailView.as_view(), name='customer_detail'),
    path('admin/customers/', admin_views.CustomerListView.as_view(), name='customer_list'),
    path('admin/orders/', admin_views.OrderListView.as_view(), name='order_list'),
    path('admin/vendors/', admin_views.VendorListView.as_view(), name='vendor_list'),
    
    path('vendor/orders/', vendor_views.OrderListView.as_view(), name='vendor_orders_inquiries'),
    path('vendor/products/', vendor_views.ViewProductListView.as_view(), name='vendor_products'),
    path('vendor/products/<str:product_id>/', vendor_views.VendorProductDetailView.as_view(), name='vendor_product_detail'),
    path('vendor/orders/<str:order_id>/', vendor_views.VendorOrderDetailView.as_view(), name='vendor_order_detail'),

    path('customer/submit_inquiry/', customer_views.SubmitInquiryView.as_view(), name='submit_inquiry'),
    path('customer/orders/', customer_views.OrderListView.as_view(), name='order_history'),
    path('customer/orders/<str:order_id>/', customer_views.OrderDetailView.as_view(), name='order_detail'),
    path('customer/<str:customer_id>/', customer_views.CustomerDetailView.as_view(), name='customer_detail'),

    path('products/', product_views.ProductListView.as_view(), name='product_list'),
    path('inquiries/', inquiry_views.InquiryListView.as_view(), name='inquiry_list'),
    path('orders/', order_views.OrderListView.as_view(), name='order_list'),
    path('tickets/', ticket_views.TicketListView.as_view(), name='ticket_list'),
    ]