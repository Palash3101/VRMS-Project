from django.db import models
import back.helpers as helper

class User(models.Model):
    
    class RoleChoices(models.TextChoices):
        ADMIN = 'admin', 'Admin'
        CUSTOMER = 'customer', 'Customer'
        VENDOR = 'vendor', 'Vendor'

    userid = models.CharField(
        max_length=8, 
        primary_key=True, 
        default=lambda: helper.generate_custom_id(8), 
        editable=False
    )
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


class Vendor(models.Model):
    vendorid = models.OneToOneField(
        'user.User',
        to_field='userid',
        db_column='vendorid',
        on_delete=models.CASCADE,
        primary_key=True
    )

    company_name = models.CharField(max_length=255)
    gst_number = models.CharField(max_length=20)
    status = models.CharField(max_length=9, choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')], default='pending')
    document_path = models.CharField(max_length=255)
    category = models.CharField(max_length=255, choices=[
        ('software', 'Software'),
        ('service providers', 'Service Providers'),
        ('staffing', 'Staffing'),
        ('manufacturers', 'Manufacturers'),
        ('resellers', 'Resellers'),
    ])
    rating = models.IntegerField(default=0.0)
    
    class Meta:
        db_table='vendor'
        managed = False

    def __str__(self):
        return f"{self.company_name} (Vendor ID: {self.pk})"


class Customer(models.Model):
    customerid = models.OneToOneField(
        'user.User',
        to_field='userid',
        db_column='customerid',
        on_delete=models.CASCADE,
        primary_key=True
    )

    is_active = models.BooleanField(default=True)
    phone = models.CharField(max_length=20)
    address = models.TextField()
    name = models.CharField(max_length=255)
    
    class Meta:
        db_table='customer'
        managed = False

    def __str__(self):
        return f"{self.name} (Customer ID: {self.pk})"


class ActivityLog(models.Model):
    activityid = models.CharField(
        max_length=8, 
        primary_key=True, 
        default=lambda: helper.generate_custom_id(8), 
        editable=False
    )
    userid = models.ForeignKey(User, on_delete=models.CASCADE, db_column='userid')
    action = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'activity_logs'

    def __str__(self):
        return f'{self.userid} - {self.action[:50]}'