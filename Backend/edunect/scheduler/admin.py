from django.contrib import admin
from .models import Day, TimeSlot, Subject, Batch, Timetable, Student, Attendance

admin.site.register(Day)
admin.site.register(TimeSlot)
admin.site.register(Subject)
admin.site.register(Batch)
admin.site.register(Student)
admin.site.register(Attendance)
