from rest_framework import serializers
from user.models import Vendor
from orders.serializers import order_serializers, ticket_serializers, feedback_serializers
from products.serializers import product_serializers, inquiry_serializers
from user.serializers import admin_serializers, customer_serializers

class VendorListSerializer(serializers.ModelSerializer):

    users = admin_serializers.UserListSerializer(source='vendorid', read_only=True)
    
    def create(self, validated_data):
        return super().create(validated_data)

    class Meta:
        model = Vendor
        fields = "__all__"

class VendorProfileSerializer(serializers.ModelSerializer):
    orders = order_serializers.OrderDetailSerializer(many=True, read_only=True)
    products = product_serializers.ViewProductSerializer(many=True, read_only=True)
    inquiries = inquiry_serializers.ViewInquirySerializer(many=True, read_only=True)

    def create(self, validated_data):
        return super().create(validated_data)

    class Meta:
        model = Vendor
        exclude = ['vendorid']  
        
    
    


        