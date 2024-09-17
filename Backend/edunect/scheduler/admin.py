from django.contrib import admin
from .models import *

admin.site.register(TimeTable)
admin.site.register(Subject)
admin.site.register(Attendance)
admin.site.register(Result)