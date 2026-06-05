from rest_framework import serializers
from products.models import Product

class ViewProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        exclude = ['vendorid']