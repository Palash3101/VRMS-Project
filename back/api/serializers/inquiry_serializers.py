from rest_framework import serializers
from products.models import Inquiries

class InquirySerializer(serializers.ModelSerializer):
    
    def create(self, validated_data):
        return super().create(validated_data)

    class Meta:
        model = Inquiries
        fields = '__all__'

class InquirySubmitSerializer(serializers.ModelSerializer):

    def create(self, validated_data):
        return super().create(validated_data)

    class Meta:
        model = Inquiries
        fields = '__all__'
        extra_kwargs = {
            'customerid': {'read_only': True},
            'vendorid': {'read_only': True}
        }