from rest_framework import serializers
from user.models import User
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password

User = get_user_model()

class SignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['userid', 'username', 'email', 'password', 'role']

        extra_kwargs = {
            'password': {'write_only': True} 
        }

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        
        user = User.objects.create(**validated_data)
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model =User
        # Include all fields from the model
        fields = ['userid', 'username', 'email', 'password', 'role', 'timestamp']
        
        # Security tweak: Ensure the password is not returned in API responses
        extra_kwargs = {
            'password': {'write_only': True}
        }


    def create(self, validated_data):
        return super().create(validated_data)


