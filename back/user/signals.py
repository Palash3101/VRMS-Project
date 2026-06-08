from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver
from user.models import ActivityLog
from back.helpers import format_action_details
import json
import logging

logger = logging.getLogger(__name__)

@receiver(user_logged_in)
def log_user_login(sender, request, user, **kwargs):
    """
    Log user login activity using the centralized helper function.
    """
    try:
        action_details = format_action_details(
            event_type='user_login',
            request=request,
            payload={"detail": "User logged in successfully."}
        )
        ActivityLog.objects.create(
            userid=user,
            action=json.dumps(action_details)
        )
    except Exception as e:
        logger.error(f"Failed to log user login activity: {e}")
