from os import stat

from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.permissions import IsAuthenticated
from api.permissions import IsAdmin, IsCustomer

from api.serializers import customer_serializers, inquiry_serializers,order_serializers
from orders.models import Order
from user.models import Customer
from products.models import Inquiries
# from inquiries.models import Inquiries

class CustomerDetailView(APIView):
    # permission_classes = [IsAuthenticated, IsCustomer]

    def get(self, request, customer_id):
        try:
            customer = Customer.objects.get(customerid=customer_id)
            serializer = customer_serializers.CustomerDetailSerializer(customer)
            return Response(serializer.data)
        
        except Customer.DoesNotExist:
            return Response({'error': 'Customer not found'}, status=404)


class SubmitInquiryView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = inquiry_serializers.InquirySubmitSerializer(data=request.data)

        if serializer.is_valid():
            product = serializer.validated_data.get('productid')
            target_vendor = product.vendorid 
            target_customer = request.user.customer

            serializer.save(
                customerid=target_customer, 
                vendorid=target_vendor
            ) 
            
            output = {
                "inquiry_id": serializer.instance.inquiryid,
            }
            return Response(output, status=201)
        
        # print("SERIALIZER ERRORS:", serializer.errors)
        return Response(serializer.errors, status=400)

class OrderListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        print(request)
        customer = request.user.customer
        status = request.query_params.get('status')
        date = request.query_params.get('date')
        vendor = request.query_params.get('vendor')

        orders = customer.orders.all()

        if status:
            orders = orders.filter(status=status)
        if date:
            # Note: If your field is a DateTimeField, you might need: filter(created_at__date=date)
            orders = orders.filter(created_at__date=date) 
        if vendor:
            orders = orders.filter(vendorid=vendor)

        serializer = order_serializers.OrderSerializer(orders, many=True)
        return Response(serializer.data)


class OrderDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, order_id):
        customer = request.user.customer
        try:
            order = customer.orders.get(orderid=order_id)
            serializer = order_serializers.OrderDetailSerializer(order)
            return Response(serializer.data)
        
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=404)
    
    def put(self, request, order_id):
        customer = request.user.customer
        try:
            order = customer.orders.get(orderid=order_id)
            print(request.data)
            serializer = order_serializers.OrderDetailSerializer(order, data=request.data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                return Response(serializer.errors, status=400)
        
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=404)