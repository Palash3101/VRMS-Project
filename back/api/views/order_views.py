from rest_framework.views import APIView
from orders.models import Order
from api.serializers import order_serializers
from rest_framework.response import Response

class OrderListView(APIView):
    def get(self, request):
        orders = Order.objects.all()
        serializer = order_serializers.OrderSerializer(orders, many=True)
        return Response(serializer.data)