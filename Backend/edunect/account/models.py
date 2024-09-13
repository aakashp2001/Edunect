# myapp/models.py
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.contrib.auth.models import UserManager
class CustomUser(AbstractUser):
    user_type = models.CharField(max_length=10, choices=[('admin', 'Admin'), ('student', 'Student')], default='admin')
    first_time = models.BooleanField(blank=True, null=True)
    full_name = models.CharField(max_length=50, blank=True, null=True)
    branch = models.CharField(max_length=20, blank=True, null=True)
    batch = models.CharField(max_length=5, blank=True, null=True)
    roll_no = models.CharField(max_length=5, blank=True, null=True)
    sem = models.CharField(max_length=2,null=True,blank=True)
    class Meta:
        permissions = [
            ("can_view_dashboard", "Can view dashboard"),
            ("can_edit_profile", "Can edit profile"),
            # Add more custom permissions
        ]

    # Override groups and user_permissions fields with related_name to avoid clashes
    groups = models.ManyToManyField(
        Group,
        related_name='customuser_set',  # This can be any unique name
        blank=True,
        help_text='The groups this user belongs to.',
        related_query_name='customuser'
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='customuser_set',  # This can be any unique name
        blank=True,
        help_text='Specific permissions for this user.',
        related_query_name='customuser'
    )

class Notification(models.Model):
    notification_head = models.CharField(max_length=100)
    notification_body = models.TextField()
    date = models.DateField()

    class Meta:
        db_table = 'Notification'
    
    def __str__(self):
        return self.notification_head