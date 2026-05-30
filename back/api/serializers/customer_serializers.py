from rest_framework import serializers
from api.serializers import inquiry_serializers,order_serializers, ticket_serializers
from user.models import Customer

class CustomerSerializer(serializers.ModelSerializer):
    
    def create(self, validated_data):
        return super().create(validated_data)

    class Meta:
        model = Customer
        fields = ['customerid', 'is_active', 'phone', 'address', 'name']


class CustomerDetailSerializer(serializers.ModelSerializer):

    inquiries = inquiry_serializers.InquirySerializer(many=True, read_only=True)
    orders = order_serializers.OrderDetailSerializer(many=True, read_only=True)

    def create(self, validated_data):
        return super().create(validated_data)

    class Meta:
        model = Customer
        fields = ['customerid', 'is_active', 'phone', 'address', 'name', 'inquiries', 'orders']