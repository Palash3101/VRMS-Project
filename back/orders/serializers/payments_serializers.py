from rest_framework import serializers
from orders.serializers import ticket_serializers, feedback_serializers
from orders.models import Order, Feedback, Payments

class PaymentSerializer(serializers.ModelSerializer):
    
    def create(self, validated_data):
        return super().create(validated_data)

    class Meta:
        model = Payments
        fields = '__all__'