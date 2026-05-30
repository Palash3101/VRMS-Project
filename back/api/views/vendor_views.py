from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.permissions import IsAuthenticated
from api.permissions import IsAdmin, IsVendor

from api.serializers import vendor_serializers,inquiry_serializers, ticket_serializers
from orders.models import Ticket
from products.models import Inquiries
from user.models import Vendor

class VendorListView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        vendors = Vendor.objects.all()
        serializer = vendor_serializers.VendorSerializer(vendors, many=True)
        return Response(serializer.data)
    

class OrderInquiryListView(APIView):
    permission_classes = [IsAuthenticated, IsVendor]

    def get(self, request):
        vendor = Vendor.objects.get(vendorid=request.user)

        tickets = Ticket.objects.filter(vendorid=vendor)
        inquiries = Inquiries.objects.filter(vendorid=vendor)

        serializer_tickets = ticket_serializers.TicketSerializer(tickets, many=True)
        serializer_inquiries = inquiry_serializers.InquirySerializer(inquiries, many=True)

        return Response({'tickets': serializer_tickets.data, 'inquiries': serializer_inquiries.data})