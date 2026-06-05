from rest_framework import serializers
from orders.models import Ticket

class TicketSerializer(serializers.ModelSerializer):
    
    def create(self, validated_data):
        return super().create(validated_data)

    class Meta:
        model = Ticket
        fields = '__all__'

class ViewTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        read_only_fields = ['ticketid', 'orderid','created_at']
        exclude = ['vendorid']