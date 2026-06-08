import json
import logging
from user.models import ActivityLog
from back.helpers import format_action_details

logger = logging.getLogger(__name__)

class ActivityLogMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        if hasattr(request, 'user') and request.user.is_authenticated:
            # Avoid logging the login event again as it's handled by signals
            if request.path == '/login/':
                return response

            payload = {}
            if request.method in ['POST', 'PUT', 'PATCH']:
                if 'application/json' in request.content_type and request.body:
                    try:
                        body = json.loads(request.body)
                        sensitive_keys = ['password', 'token']
                        payload = {k: ('********' if k in sensitive_keys else v) for k, v in body.items()}
                    except json.JSONDecodeError:
                        payload = {"error": "Invalid JSON"}
            
            action_details = format_action_details(
                event_type='user_activity',
                request=request,
                response=response,
                payload=payload
            )

            try:
                ActivityLog.objects.create(
                    userid=request.user,
                    action=json.dumps(action_details)
                )
            except Exception as e:
                logger.error(f"Failed to log user activity: {e}")

        return response
