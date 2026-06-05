from rest_framework import serializers
from products.models import Inquiries

class ViewInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiries
        exclude = ['vendorid']