from rest_framework.views import APIView
from orders.models import Order, Feedback
from api.serializers import order_serializers
from rest_framework.response import Response

class OrderListView(APIView):
    def get(self, request):
        orders = Order.objects.all()
        serializer = order_serializers.OrderSerializer(orders, many=True)
        return Response(serializer.data)

class FeedbackListView(APIView):
    def get(self, request):
        feedbacks = Feedback.objects.all()
        serializer = order_serializers.FeedbackSerializer(feedbacks, many=True)
        return Response(serializer.data)