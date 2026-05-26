from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.permissions import IsAuthenticated
from api.permissions import IsAdmin

from api.serializers import vendor_serializers
from vendor.models import Vendor

class VendorListView(APIView):

    def get(self, request):
        vendors = Vendor.objects.all()
        serializer = vendor_serializers.VendorSerializer(vendors, many=True)
        return Response(serializer.data)