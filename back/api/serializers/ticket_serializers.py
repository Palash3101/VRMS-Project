from rest_framework import serializers
from orders.models import Ticket

class TicketSerializer(serializers.ModelSerializer):
    
    def create(self, validated_data):
        return super().create(validated_data)

    class Meta:
        model = Ticket
        fields = '__all__'