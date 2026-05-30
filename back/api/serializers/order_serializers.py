from rest_framework import serializers
from api.serializers import ticket_serializers
from orders.models import Order

class OrderSerializer(serializers.ModelSerializer):
    
    def create(self, validated_data):
        return super().create(validated_data)

    class Meta:
        model = Order
        fields = '__all__'

class OrderDetailSerializer(serializers.ModelSerializer):
    
    tickets = ticket_serializers.TicketSerializer(many=True, read_only=True)

    def create(self, validated_data):
        return super().create(validated_data)

    class Meta:
        model = Order
        exclude = ['orderid']
