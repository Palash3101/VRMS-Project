from django.urls import path
from user.views import vendor_views

urlpatterns = [
    path('orders/', vendor_views.OrderListView.as_view(), name='vendor_order_list'),
    path('payments/', vendor_views.PaymentsListView.as_view(), name='vendor_payment_list'),
    path('products/', vendor_views.ProductsListView.as_view(), name='vendor_product_list'),
    path('leads/', vendor_views.LeadListView.as_view(), name='vendor_lead_list'),
    path('inquiries/', vendor_views.InquiryListView.as_view(), name='vendor_inquiry_list'),
]