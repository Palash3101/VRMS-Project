from django.db import models

class User(models.Model):
    
    class RoleChoices(models.TextChoices):
        ADMIN = 'admin', 'Admin'
        CUSTOMER = 'customer', 'Customer'
        VENDOR = 'vendor', 'Vendor'

    userid = models.CharField(max_length=10, primary_key=True)
    username = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    role = models.CharField(max_length=10, choices=RoleChoices.choices)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table='users'
        managed = False

    def __str__(self):
        return f"{self.username} ({self.role})"

    @property
    def is_authenticated(self):
        return True

    @property
    def is_active(self):
        return True 
    
    @property
    def is_anonymous(self):
        return False

    REQUIRED_FIELDS = ['username', 'role']

    USERNAME_FIELD = 'email'