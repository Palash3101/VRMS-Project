from rest_framework.views import APIView
from products.models import Inquiries
from api.serializers import inquiry_serializers
from rest_framework.response import Response

class InquiryListView(APIView):
    def get(self, request):
        inquiries = Inquiries.objects.all()
        serializer = inquiry_serializers.InquirySerializer(inquiries, many=True)
        return Response(serializer.data)