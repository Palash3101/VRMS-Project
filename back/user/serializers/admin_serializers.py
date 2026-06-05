from rest_framework import serializers
from user.models import User



class UserListSerializer(serializers.ModelSerializer):

    def create(self, validated_data):
        return super().create(validated_data)

    class Meta:
        model = User
        # Include all profile details + the nested related fields
        exclude = ['password', 'role', 'userid']