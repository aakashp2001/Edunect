# Generated by Django 5.1 on 2024-09-15 09:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scheduler', '0005_attendance_batch_alter_attendance_student'),
    ]

    operations = [
        migrations.AddField(
            model_name='attendance',
            name='sem',
            field=models.CharField(blank=True, max_length=5, null=True),
        ),
    ]
