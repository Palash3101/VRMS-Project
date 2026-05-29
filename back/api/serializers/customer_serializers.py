from rest_framework import serializers
from user.models import Customer

class CustomerSerializer(serializers.ModelSerializer):
    
    def create(self, validated_data):
        return super().create(validated_data)

    class Meta:
        model = Customer
        fields = ['customerid', 'is_active', 'phone', 'address', 'name']