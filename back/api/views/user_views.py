from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from api.serializers import user_serializers
from rest_framework.permissions import IsAuthenticated
from api.permissions import IsAdmin

from api.serializers import user_serializers

class SignUpView(APIView):
    permission_classes = [] 

    def post(self, request):
        serializer = user_serializers.SignUpSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save() 

            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserListView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        users = user_serializers.User.objects.all()
        serializer = user_serializers.UserSerializer(users, many=True)
        return Response(serializer.data)