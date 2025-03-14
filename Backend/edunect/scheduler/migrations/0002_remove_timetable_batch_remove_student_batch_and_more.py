# Generated by Django 5.1 on 2024-08-31 05:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scheduler', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='timetable',
            name='batch',
        ),
        migrations.RemoveField(
            model_name='student',
            name='batch',
        ),
        migrations.RemoveField(
            model_name='timetable',
            name='day',
        ),
        migrations.RemoveField(
            model_name='timetable',
            name='subject',
        ),
        migrations.RemoveField(
            model_name='timetable',
            name='time_slot',
        ),
        migrations.AddField(
            model_name='timetable',
            name='branch',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
        migrations.AddField(
            model_name='timetable',
            name='file',
            field=models.FileField(blank=True, null=True, upload_to='scheduler/TimeTable/'),
        ),
        migrations.AddField(
            model_name='timetable',
            name='sem',
            field=models.CharField(blank=True, max_length=5, null=True),
        ),
        migrations.DeleteModel(
            name='Attendance',
        ),
        migrations.DeleteModel(
            name='Batch',
        ),
        migrations.DeleteModel(
            name='Student',
        ),
        migrations.DeleteModel(
            name='Day',
        ),
        migrations.DeleteModel(
            name='Subject',
        ),
        migrations.DeleteModel(
            name='TimeSlot',
        ),
    ]
