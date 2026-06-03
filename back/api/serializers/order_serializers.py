from rest_framework import serializers
from api.serializers import ticket_serializers
from orders.models import Order, Feedback

class OrderSerializer(serializers.ModelSerializer):
    
    def create(self, validated_data):
        return super().create(validated_data)

    class Meta:
        model = Order
        fields = '__all__'


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'

    
class OrderDetailSerializer(serializers.ModelSerializer):
    
    tickets = ticket_serializers.TicketSerializer(many=True, read_only=True)
    feedback = FeedbackSerializer()

    def create(self, validated_data):
        return super().create(validated_data)

    def update(self, instance, validated_data):
        feedback_data = validated_data.pop('feedback', None)

        if feedback_data:
            feedback, created = Feedback.objects.get_or_create(orderid=instance)
            feedback.rating = feedback_data.get('rating', feedback.rating)
            feedback.comment = feedback_data.get('comment', feedback.comment)
            feedback.save()

        return super().update(instance, validated_data)

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['orderid', 'customerid', 'vendorid', 'productid']