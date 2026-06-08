from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.permissions import IsAuthenticated
from user.permissions import IsAdmin

from user.serializers import vendor_serializers, customer_serializers
from orders.serializers import order_serializers
from user.models import Customer, Vendor
from orders.models import Order, Ticket, Feedback
from products.models import Product, Inquiries

from django.db.models import OuterRef, Subquery, Window, F
from django.db.models.functions import RowNumber
from django.db.models import Prefetch

NUMBER_OF_RECORDS = 5

def get_top_5_queryset(model_class, related_field_name):
    return model_class.objects.annotate(
        row_num=Window(
            expression=RowNumber(),
            partition_by=[F(related_field_name)],
            order_by=F('created_at').desc()
        )
    ).filter(row_num__lte=NUMBER_OF_RECORDS)


class VendorListView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        vendors = Vendor.objects.select_related('vendorid').all()
        search_filter = request.query_params.get('status', None)

        if search_filter:
            vendors = vendors.filter(status=search_filter)
        
        serializer = vendor_serializers.VendorListSerializer(vendors, many=True)
        return Response(serializer.data)

    def put(self, request):
        vendor_id = request.data.get('vendor_id')
        new_status = request.data.get('status')

        try:
            vendor = Vendor.objects.get(vendorid=vendor_id)
            vendor.status = new_status
            vendor.save()
            #Trigger email notification to the vendor about the status change

            return Response(vendor.data)
        except Vendor.DoesNotExist:
            return Response({'error': 'Vendor not found'}, status=404)


class ViewVendorData(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request, vendor_id):
        try:
                # 1. Instruct Django to fetch all related tables in 5 optimized batched queries
            vendor_profile = Vendor.objects.prefetch_related(
                Prefetch('orders', queryset=get_top_5_queryset(Order, 'vendorid')),
                Prefetch('products', queryset=get_top_5_queryset(Product, 'vendorid')),
                Prefetch('inquiries', queryset=get_top_5_queryset(Inquiries, 'vendorid'))
            ).get(vendorid=vendor_id)
            # 2. Pass the single vendor object to the serializer
            serializer = vendor_serializers.VendorProfileSerializer(vendor_profile)
            
            # 3. Return the clean, structured JSON payload
            return Response(serializer.data, status=200)
                
        except Vendor.DoesNotExist:
            return Response({'error': 'Vendor profile not found'}, status=404)


class CustomerListView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        customers = Customer.objects.all()
        search_filter = request.query_params.get('is_active', None)
        if search_filter is not None:
            is_active_value = search_filter.lower() == 'true'
            customers = customers.filter(is_active=is_active_value)
        serializer = customer_serializers.CustomerListSerializer(customers, many=True)
        return Response(serializer.data)


    def put(self, request):
        customer_id = request.data.get('customer_id')
        new_status = request.data.get('is_active')

        try:
            customer = Customer.objects.get(customerid=customer_id)
            customer.is_active = new_status
            customer.save()
            #Trigger email notification to the customer about the status change
    
            return Response({f'{customer_id}': f'{new_status}'})
        except Customer.DoesNotExist:
            return Response({'error': 'Customer not found'}, status=404)


class ViewCustomerData(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request, customer_id):
        try:
            customer_profile = Customer.objects.prefetch_related(
                Prefetch('inquiries', queryset=get_top_5_queryset(Inquiries, 'customerid')),
                Prefetch('orders', queryset=get_top_5_queryset(Order, 'customerid')),
                # Prefetch('tickets', queryset=get_top_5_queryset(Ticket, 'orderid')),
                # Prefetch('feedbacks', queryset=get_top_5_queryset(Feedback, 'customerid'))
            ).get(customerid=customer_id)
            serializer = customer_serializers.CustomerProfileSerializer(customer_profile)
            return Response(serializer.data, status=200)
        except Customer.DoesNotExist:
            return Response({'error': 'Customer profile not found'}, status=404)


class OrderListView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        orders = Order.objects.all()
        search_filter = request.query_params.get('status', None)
        if search_filter:
            orders = orders.filter(status=search_filter)
        
        serializer = order_serializers.OrderSerializer(orders, many=True)
        return Response(serializer.data)



