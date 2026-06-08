from django.db import models
import back.helpers as helper

def get_default_inquiry_id():
    return helper.generate_custom_id(10)

def get_default_product_id():
    return helper.generate_custom_id(15)

# Create your models here.
class Product(models.Model):
    productid = models.CharField(
        default=get_default_product_id, 
        primary_key=True,
        max_length=15
    )
    vendorid = models.ForeignKey('user.Vendor', on_delete=models.CASCADE, db_column='vendorid', related_name='products')  
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'products'
        managed = False

class Inquiries(models.Model):
    inquiryid = models.CharField(
        default=get_default_inquiry_id, 
        primary_key=True,
        max_length=15
    )
    productid = models.ForeignKey('Product', on_delete=models.CASCADE, db_column='productid')
    customerid = models.ForeignKey(
        'user.Customer', 
        on_delete=models.CASCADE, 
        db_column='customerid',
        related_name='inquiries'
    )
    subject = models.CharField(max_length=255)
    desc = models.TextField()
    status = models.CharField(max_length=15, choices=[('open', 'Open'), ('in progress', 'In Progress'), ('closed', 'Closed')], default='open')
    created_at = models.DateTimeField(auto_now_add=True)
    vendorid = models.ForeignKey('user.Vendor', on_delete=models.CASCADE, db_column='vendorid', related_name='inquiries')

    class Meta:
        db_table = 'inquiries'
        managed = False