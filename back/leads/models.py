from django.db import models

# Create your models here.
class Lead(models.Model):
    leadid  = models.CharField(primary_key=True, max_length=8)
    assigned_vendor = models.ForeignKey('user.Vendor', on_delete=models.CASCADE, db_column='assigned_vendor', related_name='leads')
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    source = models.CharField(
        max_length=255, 
        choices=[('web', 'Web'), 
                 ('referral', 'Referral'), 
                 ('social', 'Social'),
                 ('cold_call', 'Cold Call'), 
                 ('other', 'Other')
                 ])
    
    priority = models.CharField(
        max_length=10, 
        choices=[('low', 'Low'), 
                 ('medium', 'Medium'), 
                 ('high', 'High')], 
        default='medium'
    )

    status = models.CharField(
        max_length=15,
        choices=[('new', 'New'), 
                 ('contacted', 'Contacted'), 
                 ('negotiating', 'Negotiating'),
                 ('closed', 'Closed'),  
                 ('lost', 'Lost')]
    )

    follow_up = models.DateTimeField(null=True, blank=True)
    created_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'lead'
        managed = False