from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.permissions import IsAuthenticated
from user.permissions import IsCustomer

from user.serializers import vendor_serializers, customer_serializers
from orders.serializers import order_serializers
from products.serializers import product_serializers, inquiry_serializers
from user.models import Customer, Vendor
from orders.models import Order, Ticket, Feedback
from products.models import Product, Inquiries

from django.db.models import OuterRef, Subquery, Window, F
from django.db.models.functions import RowNumber
from django.db.models import Prefetch

def calculate_total_GST(amount, GST_RATE=18):
    return amount * (1 + (GST_RATE//100))

class VendorCatalogueView(APIView):
    permission_classes = [IsAuthenticated, IsCustomer]

    def get(self, request):
        vendors = Vendor.objects.all()
        category = request.query_params.get('category', None)

        if category:
            vendors = vendors.filter(category=category)
        
        serializer = vendor_serializers.VendorListSerializerCustomer(vendors, many=True)
        return Response(serializer.data)
    

    
class VendorDetailView(APIView):
    permission_classes = [IsAuthenticated, IsCustomer]

    def get(self, request, vendorid):
        try:
            vendor = Vendor.objects.get(vendorid=vendorid)
        except Vendor.DoesNotExist:
            return Response({'error': 'Vendor not found'}, status=404)

        serializer = vendor_serializers.VendorDetailSerializerCustomer(vendor)
        return Response(serializer.data)

    def post(self, request, vendorid):
        
        try:
            customer = Customer.objects.get(customerid=request.user)  
            data = request.data.copy()
            data['customerid'] = customer.customerid  
            data['vendorid'] = vendorid

            serializer = inquiry_serializers.PostInquirySerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=201)
            
            return Response(serializer.errors, status=400)


        except Customer.DoesNotExist:
            return Response({'error': 'Customer not found'}, status=404)

        
class OrderListView(APIView):
    permission_classes = [IsAuthenticated, IsCustomer]

    def get(self, request):
        customer = Customer.objects.get(customerid=request.user)
        orders = Order.objects.filter(customerid=customer)
        serializer = order_serializers.OrderDetailSerializerCustomer(orders, many=True)
        return Response(serializer.data)

    
    def post(self, request):

        try:
            customer = Customer.objects.get(customerid=request.user)
            products = Product.objects.get(productid=request.data.get('productid'))
            product_serializer = product_serializers.ProductSerializer(products)
            
            data = request.data.copy()
            data['customerid'] = customer.customerid
            data['vendorid'] = product_serializer.data['vendorid']
            data['base_amount'] = product_serializer.data['price']
            data['total'] = calculate_total_GST(data['base_amount'], 18)

            serializer = order_serializers.OrderSerializer(data=data)
    
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=201)

            return Response(serializer.errors, status=400)

        except Customer.DoesNotExist:
            return Response({'error': 'Customer not found'}, status=404)
    

    def put(self, request):
        order_id = request.data.get('orderid')
        
        try:
            order = Order.objects.get(orderid=order_id, customerid=request.user)
            order.status = 'cancelled'
            order.save()
            serializer = order_serializers.OrderSerializer(order)
            return Response(serializer.data)

        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=404)

        except Exception as e:
            return Response({'error': str(e)}, status=500)




