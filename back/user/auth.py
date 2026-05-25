from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.hashers import check_password, make_password
from django.db.models import Q
from .models import User

class CustomAuth(BaseBackend):
    def authenticate(self, request, username=None, password=None, email=None):

        login_identifier = email or username
        
        if not login_identifier:
            return None

        try:
            user = User.objects.get(Q(email=login_identifier) | Q(username=login_identifier))
            print(user)
        except User.DoesNotExist:
            return None


        if check_password(password, user.password):
            print("Password is correct")
            return user
                
        return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None