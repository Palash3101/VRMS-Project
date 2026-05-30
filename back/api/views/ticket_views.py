from rest_framework.views import APIView
from api.serializers import ticket_serializers
from orders.models import Ticket
from rest_framework.response import Response

class TicketListView(APIView):
    def get(self, request):
        tickets = Ticket.objects.all()
        serializer = ticket_serializers.TicketSerializer(tickets, many=True)
        return Response(serializer.data)