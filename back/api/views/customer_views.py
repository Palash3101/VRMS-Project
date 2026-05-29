from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.permissions import IsAuthenticated
from api.permissions import IsAdmin

from api.serializers import customer_serializers
from user.models import Customer

class CustomerListView(APIView):
    # permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        customers = Customer.objects.all()
        serializer = customer_serializers.CustomerSerializer(customers, many=True)
        return Response(serializer.data)