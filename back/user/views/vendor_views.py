from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.permissions import IsAuthenticated
from user.permissions import IsVendor

from user.serializers import vendor_serializers, customer_serializers
from orders.serializers import order_serializers, payments_serializers
from leads import lead_serializers
from products.serializers import product_serializers, inquiry_serializers
from user.models import Vendor
from orders.models import Order, Payments
from products.models import Product, Inquiries
from leads.models import Lead


class OrderListView(APIView):
    permission_classes = [IsAuthenticated, IsVendor]

    def get(self, request):
        vendor = Vendor.objects.get(vendorid=request.user)
        orders = Order.objects.filter(vendorid=vendor)
        search_filter = request.query_params.get('status', None)
        if search_filter:
            orders = orders.filter(status=search_filter)
        
        serializer = order_serializers.OrderSerializer(orders, many=True)
        return Response(serializer.data)


    def put(self, request):
        order_id = request.data.get('orderid')
        new_status = request.data.get('status')

        if new_status.lower() not in ['accepted', 'rejected']:
            return Response({'error': 'Invalid status. Status must be either "accepted" or "rejected".'}, status=400)

        try:
            order = Order.objects.get(orderid=order_id)
            order.update(new_status)
            serializer = order_serializers.OrderSerializer(order)
            return Response(serializer.data)
        
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=404)


class PaymentsListView(APIView):
    permission_classes = [IsAuthenticated, IsVendor]

    def get(self, request):
        vendor = Vendor.objects.get(vendorid=request.user)
        payments = Payments.objects.filter(vendorid=vendor)
        search_filter = request.query_params.get('payment_status', None)
        if search_filter:
            payments = payments.filter(payment_status=search_filter)
        
        serializer = payments_serializers.PaymentSerializer(payments, many=True)
        return Response(serializer.data)


class ProductsListView(APIView):
    permission_classes = [IsAuthenticated, IsVendor]

    def get(self, request):
        vendor = Vendor.objects.get(vendorid=request.user)
        products = Product.objects.filter(vendorid=vendor)
        serializer = product_serializers.ProductSerializer(products, many=True)
        return Response(serializer.data)

    def post(self, request):
        vendor = Vendor.objects.get(vendorid=request.user)
        data = request.data.copy()
        data['vendorid'] = vendor.vendorid

        serializer = product_serializers.AddProductSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            products = Product.objects.filter(vendorid=vendor)
            serializer = product_serializers.ProductSerializer(products, many=True)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class LeadListView(APIView):
    permission_classes = [IsAuthenticated, IsVendor]

    def get(self, request):
        vendor = Vendor.objects.get(vendorid=request.user)
        leads = Lead.objects.filter(assigned_vendor=vendor)
        serializer = lead_serializers.LeadSerializer(leads, many=True)
        return Response(serializer.data)


class InquiryListView(APIView):
    permission_classes = [IsAuthenticated, IsVendor]

    def get(self, request):
        query_status = request.query_params.get('status', None)

        vendor = Vendor.objects.get(vendorid=request.user)
        inquiries = Inquiries.objects.filter(vendorid=vendor)
        
        if query_status:
            inquiries = inquiries.filter(status=query_status)

        serializer = inquiry_serializers.ViewInquirySerializer(inquiries, many=True)
        return Response(serializer.data)


    def put(self, request):
        inquiry_id = request.data.get('inquiryid')
        new_status = request.data.get('status')
        
        try:
            inquiries = Inquiries.objects.filter(inquiryid=inquiry_id)
            inquiries.update(status=new_status)
            serializer = inquiry_serializers.ViewInquirySerializer(inquiries, many=True)
            return Response(serializer.data)

        except Inquiries.DoesNotExist:
            return Response({'error': 'Inquiry not found'}, status=404)
