from rest_framework import serializers
from orders.models import Order, Feedback

class ViewFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        exclude = ['orderid']