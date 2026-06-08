from rest_framework import serializers
from products.models import Inquiries

class ViewInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiries
        exclude = ['vendorid']


class EditInquirySerializerVendor(serializers.ModelSerializer):
    class Meta:
        model = Inquiries
        fields = '__all__'
        read_only_fields = ['inquiryid', 'vendorid', 'customerid', 'productid', 'created_at', 'subject', 'desc']


class PostInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiries
        fields = '__all__'