# Generated by Django 5.1 on 2024-09-14 07:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scheduler', '0003_subject_attendance'),
    ]

    operations = [
        migrations.AlterField(
            model_name='subject',
            name='total',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
