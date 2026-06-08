from rest_framework import serializers
from orders.serializers import ticket_serializers, feedback_serializers
from orders.models import Order, Feedback

class OrderSerializer(serializers.ModelSerializer):
    
    def create(self, validated_data):
        return super().create(validated_data)

    class Meta:
        model = Order
        fields = '__all__'

    
class OrderDetailSerializer(serializers.ModelSerializer):
    
    tickets = ticket_serializers.ViewTicketSerializer(many=True, read_only=True)
    feedback = feedback_serializers.ViewFeedbackSerializer()

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
        read_only_fields = ['orderid', 'customerid']


class ViewOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        read_only_fields = ['orderid', 'customerid', 'productid', 'created_at', 'payment_ref_id']
        exclude = ['vendorid']


class OrderDetailSerializerCustomer(serializers.ModelSerializer):

    class Meta:
        model = Order
        exclude = ['customerid']

    