from django.db import models

# Create your models here.
class Vendor(models.Model):
    vendorid = models.CharField(primary_key=True, max_length=10)
    company_name = models.CharField(max_length=255)
    gst_number = models.CharField(max_length=20)
    status = models.CharField(max_length=9, choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')], default='pending')
    document_path = models.CharField(max_length=255)
    
    class Meta:
        db_table='vendor'
        managed = False

    def __str__(self):
        return self.vendorid