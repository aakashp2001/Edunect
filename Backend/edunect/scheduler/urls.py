from django.urls import path,include
from . import views

urlpatterns = [
    # path('',views.upload_timetable)
    path('upload_timetable',views.upload_timetable),
    path('get_time_table',views.get_time_table),
    path('upload_attendance',views.upload_attendance),
    path('get_attendance',views.get_attendance)
]