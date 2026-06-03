from rest_framework import serializers
from products.models import Product

class ProductSerializer(serializers.ModelSerializer):
    
    def create(self, validated_data):
        return super().create(validated_data)

    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ['productid']

class ProductDetailSerializer(serializers.ModelSerializer):
    
    def create(self, validated_data):
        return super().create(validated_data)

    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ['productid', 'vendorid']