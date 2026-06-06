from rest_framework import serializers
from user.models import Customer
from orders.serializers import order_serializers, ticket_serializers, feedback_serializers
from products.serializers import product_serializers, inquiry_serializers
from user.serializers import admin_serializers, customer_serializers


class CustomerListSerializer(serializers.ModelSerializer):

    users = admin_serializers.UserListSerializer(source='customerid', read_only=True)

    class Meta:
        model = Customer
        fields = "__all__"

class CustomerProfileSerializer(serializers.ModelSerializer):
    orders = order_serializers.OrderDetailSerializer(many=True, read_only=True)
    products = product_serializers.ProductSerializer(many=True, read_only=True)
    inquiries = inquiry_serializers.ViewInquirySerializer(many=True, read_only=True)

    class Meta:
        model = Customer
        fields = "__all__"
