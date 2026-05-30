# api/permissions.py
from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    """
    Custom permission to only allow access to users with the 'admin' role.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

class IsVendor(BasePermission):
    """
    Custom permission to only allow access to users with the 'vendor' role.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'vendor'

class IsCustomer(BasePermission):
    """
    Custom permission to only allow access to users with the 'customer' role.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'customer'
