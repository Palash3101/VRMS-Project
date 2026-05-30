from django.db import models
import back.helpers as helper

# Create your models here.
class Notification(models.Model):
    id = models.CharField(default=helper.generate_custom_id(30), primary_key=True, max_length=20, editable=False)
    recipientid = models.ForeignKey(
        'user.User',
        to_field='userid',
        db_column='recipientid',
        on_delete=models.CASCADE,
    )
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    desc = models.TextField()
    title = models.CharField(max_length=255)

    class Meta:
        db_table = 'notifications'
        managed = False

    def __str__(self):
        return f"Notification for {self.recipientid} at {self.created_at}"