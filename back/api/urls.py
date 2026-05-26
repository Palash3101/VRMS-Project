from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import user_views, admin_views

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', user_views.SignUpView.as_view(), name='sign_up'),

    path('users/', user_views.UserListView.as_view(), name='user_list'),
    path('admin/vendors/', admin_views.VendorListView.as_view(), name='vendor_list'),
]