from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.permissions import IsAuthenticated
from api.permissions import IsAdmin

from api.serializers import notification_serializers
from notifications.models import Notification

class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(recipientid=request.user).order_by('-created_at')
        serializer = notification_serializers.NotificationSerializer(notifications, many=True)
        return Response(serializer.data)
