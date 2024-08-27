from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Group, Permission
from .models import CustomUser,Notification

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('username', 'email', 'full_name', 'user_type', 'is_staff')
    list_filter = ('user_type', 'is_staff', 'is_active')
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('full_name', 'email', 'branch', 'batch', 'roll_no', 'user_type','first_time')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'user_permissions', 'groups')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'full_name', 'user_type'),
        }),
    )
    
    search_fields = ('username', 'email', 'full_name')
    ordering = ('username',)

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        if not change and obj.user_type == 'student':
            try:
                student_group = Group.objects.get(name='Students')
                obj.groups.add(student_group)
            except Group.DoesNotExist:
                self.message_user(request, "The group 'Students' does not exist. Please create it.", level='error')

admin.site.register(Notification)
admin.site.register(CustomUser, CustomUserAdmin)

