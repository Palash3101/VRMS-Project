def generate_custom_id(n):
    import secrets
    import string

    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(n))

def format_action_details(event_type, request, response=None, payload=None):
    """
    Formats the action details for the ActivityLog model.
    This function can be customized to control the structure of the log data.
    """
    action_details = {
        "event": event_type,
        "method": request.method,
        "path": request.path,
    }

    if response:
        action_details["status_code"] = response.status_code

    if payload:
        action_details["payload"] = payload
    
    # Example of custom logic:
    # if event_type == 'user_login':
    #     return {"message": f"User logged in from path {request.path}"
    # if response and response.status_code >= 400:
    #     action_details['error'] = 'Client or server error'

    return action_details