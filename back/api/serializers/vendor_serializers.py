from rest_framework import serializers
from user.models import Vendor

class VendorSerializer(serializers.ModelSerializer):
    
    def create(self, validated_data):
        return super().create(validated_data)

    class Meta:
        model = Vendor
        fields = ['vendorid', 'company_name', 'gst_number', 'status', 'document_path']
    
