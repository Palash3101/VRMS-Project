from rest_framework import serializers
from products.models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class AddProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"

class ProductDetailSerializerSmall(serializers.ModelSerializer):
    class Meta:
        model = Product
        exclude = ['vendorid', 'description', 'created_at']