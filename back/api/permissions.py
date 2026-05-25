# api/permissions.py
from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    """
    Custom permission to only allow access to users with the 'admin' role.
    """
    def has_permission(self, request, view):
        # Check if the user exists, is logged in, and has the 'admin' role string
        return bool(request.user and request.user.is_authenticated and request.user.role == 'admin')