from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import user_views, admin_views, notification_views, customer_views, product_views, inquiry_views, order_views, ticket_views,vendor_views

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', user_views.SignUpView.as_view(), name='sign_up'),

    path('users/', user_views.UserListView.as_view(), name='user_list'),
    path('admin/vendors/', admin_views.VendorListView.as_view(), name='vendor_list'),
    path('notifications/', notification_views.NotificationListView.as_view(), name='notification_list'),

    path('admin/customer_detail/<str:customer_id>/', customer_views.CustomerDetailView.as_view(), name='customer_detail'),
    path('admin/orders/', admin_views.OrderListView.as_view(), name='order_list'),
        # path('admin/customers/', admin_views.CustomerListView.as_view(), name='customer_list'),
    
    path('vendor/orders_inquiries/', vendor_views.OrderInquiryListView.as_view(), name='vendor_orders_inquiries'),

    path('products/', product_views.ProductListView.as_view(), name='product_list'),
    path('inquiries/', inquiry_views.InquiryListView.as_view(), name='inquiry_list'),
    path('orders/', order_views.OrderListView.as_view(), name='order_list'),
    path('tickets/', ticket_views.TicketListView.as_view(), name='ticket_list'),
    ]