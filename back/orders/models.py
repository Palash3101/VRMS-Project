from django.db import models
import back.helpers as helper

def get_default_order_id():
    return helper.generate_custom_id(15)

def get_default_ticket_id():
    return helper.generate_custom_id(10)

# Create your models here.
class Order(models.Model):
    orderid = models.CharField(primary_key=True, max_length=15, default=get_default_order_id)
    customerid = models.ForeignKey(
        'user.Customer', 
        on_delete=models.CASCADE, 
        db_column='customerid',
        related_name='orders'
    )
    productid = models.ForeignKey('products.Product', on_delete=models.CASCADE, db_column='productid')
    status = models.CharField(max_length=15, choices=[('pending', 'Pending'), ('processed', 'Processed'), ('delivered', 'Delivered'), ('cancelled', 'Cancelled'), ('dispatched', 'Dispatched')], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    base_amount = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    payment_status= models.CharField(max_length=15, choices=[('pending', 'Pending'), ('completed', 'Completed'), ('refunded', 'Refunded')], default='pending')
    payment_ref_id = models.CharField(max_length=10, null=True)
    vendorid = models.ForeignKey('user.Vendor', on_delete=models.CASCADE, db_column='vendorid')

    class Meta:
        db_table = 'orders'
        managed = False


class Ticket(models.Model):
    ticketid = models.CharField(primary_key=True, max_length=15, default=get_default_ticket_id)
    orderid = models.ForeignKey('Order', on_delete=models.CASCADE, db_column='orderid', related_name='tickets')
    subject = models.CharField(max_length=255)
    desc = models.TextField()
    status = models.CharField(max_length=15, choices=[('open', 'Open'), ('in progress', 'In Progress'), ('closed', 'Closed')], default='open')
    created_at = models.DateTimeField(auto_now_add=True)
    vendorid = models.ForeignKey('user.Vendor', on_delete=models.CASCADE, db_column='vendorid')

    class Meta:
        db_table = 'tickets'
        managed = False