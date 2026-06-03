from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.permissions import IsAuthenticated
from api.permissions import IsAdmin, IsVendor

from api.serializers import vendor_serializers,inquiry_serializers, ticket_serializers, product_serializers,order_serializers
from orders.models import Order, Ticket
from products.models import Inquiries, Product
from user.models import Vendor

class VendorListView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        vendors = Vendor.objects.all()
        serializer = vendor_serializers.VendorSerializer(vendors, many=True)
        return Response(serializer.data)
    

class OrderListView(APIView):
    permission_classes = [IsAuthenticated, IsVendor]

    def get(self, request):
        vendor = Vendor.objects.get(vendorid=request.user)

        orders = Order.objects.filter(vendorid=vendor)
        inquiries = Inquiries.objects.filter(vendorid=vendor)

        serializer_orders = order_serializers.OrderDetailSerializer(orders, many=True)
        serializer_inquiries = inquiry_serializers.InquirySerializer(inquiries, many=True)

        return Response({'orders': serializer_orders.data, 'inquiries': serializer_inquiries.data})


class ViewProductListView(APIView):
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

        serializer = product_serializers.ProductSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            products = Product.objects.filter(vendorid=vendor)
            serializer = product_serializers.ProductSerializer(products, many=True)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class VendorProductDetailView(APIView):
    permission_classes = [IsAuthenticated, IsVendor]

    def get(self, request, product_id): 
        vendor = Vendor.objects.get(vendorid=request.user)
        product = Product.objects.get(productid=product_id, vendorid=vendor)
        serializer = product_serializers.ProductDetailSerializer(product)
        return Response(serializer.data)

    def put(self, request, product_id):
        vendor = Vendor.objects.get(vendorid=request.user)
        product = Product.objects.get(productid=product_id, vendorid=vendor)

        serializer = product_serializers.ProductDetailSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class VendorOrderDetailView(APIView):
    permission_classes = [IsAuthenticated, IsVendor]

    def get(self, request, order_id): 
        vendor = Vendor.objects.get(vendorid=request.user)
        order = Order.objects.get(orderid=order_id, vendorid=vendor)
        serializer = order_serializers.OrderDetailSerializer(order)
        return Response(serializer.data)