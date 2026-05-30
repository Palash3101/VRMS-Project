from rest_framework.views import APIView
from products.models import Product
from api.serializers import product_serializers
from rest_framework.response import Response

class ProductListView(APIView):
    def get(self, request):
        products = Product.objects.all()
        serializer = product_serializers.ProductSerializer(products, many=True)
        return Response(serializer.data)
    