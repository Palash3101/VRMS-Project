from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.permissions import IsAuthenticated
from api.permissions import IsAdmin

from api.serializers import customer_serializers
from user.models import Customer
# from inquiries.models import Inquiries

class CustomerDetailView(APIView):
    # permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request, customer_id):
        try:
            customer = Customer.objects.get(customerid=customer_id)
            serializer = customer_serializers.CustomerDetailSerializer(customer)
            return Response(serializer.data)
        
        except Customer.DoesNotExist:
            return Response({'error': 'Customer not found'}, status=404)