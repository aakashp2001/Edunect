# Generated by Django 5.1 on 2024-09-15 11:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scheduler', '0006_attendance_sem'),
    ]

    operations = [
        migrations.AlterField(
            model_name='attendance',
            name='attendance',
            field=models.IntegerField(default=0),
        ),
    ]
