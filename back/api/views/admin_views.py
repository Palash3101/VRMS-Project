from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.permissions import IsAuthenticated
from api.permissions import IsAdmin

from api.serializers import vendor_serializers, order_serializers,customer_serializers
from user.models import Customer, Vendor
from orders.models import Order

class VendorListView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        # print(len(request.query_params))
        vendors = Vendor.objects.all()
        search_filter = request.query_params.get('filter', None)

        if search_filter:
            vendors = vendors.filter(status=search_filter)
        
        serializer = vendor_serializers.VendorSerializer(vendors, many=True)
        return Response(serializer.data)

    def put(self, request):
        vendor_id = request.data.get('vendor_id')
        new_status = request.data.get('status')

        try:
            vendor = Vendor.objects.get(vendorid=vendor_id)
            vendor.status = new_status
            vendor.save()
            #Trigger email notification to the vendor about the status change

            return Response({'message': 'Vendor status updated successfully'})
        except Vendor.DoesNotExist:
            return Response({'error': 'Vendor not found'}, status=404)


class OrderListView(APIView):
    # permission_classes = [IsAuthenticated, IsAdmin]
    

    def get(self, request):
        orders = Order.objects.all()
        search_filter = request.query_params.get('status', None)
        if search_filter:
            orders = orders.filter(status=search_filter)
        
        serializer = order_serializers.OrderSerializer(orders, many=True)
        return Response(serializer.data)

class CustomerListView(APIView):
    # permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        customers = Customer.objects.all()
        serializer = customer_serializers.CustomerSerializer(customers, many=True)
        return Response(serializer.data)

class CustomerDetailView(APIView):
    # permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request, customer_id):
        try:
            customer = Customer.objects.get(customerid=customer_id)
            serializer = customer_serializers.CustomerDetailSerializerAdmin(customer)
            return Response(serializer.data)
        
        except Customer.DoesNotExist:
            return Response({'error': 'Customer not found'}, status=404)
    
    def put(self, request, customer_id):
        try:
            customer = Customer.objects.get(customerid=customer_id)
        except Customer.DoesNotExist:
            return Response({'error': 'Customer not found'}, status=404)
        
        print(request.data)
        
        serializer = customer_serializers.CustomerDetailSerializerAdmin(customer, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)
            
        
