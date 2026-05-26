from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.permissions import IsAuthenticated
from api.permissions import IsAdmin

from api.serializers import vendor_serializers
from vendor.models import Vendor

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

        