from django.urls import path,include
from . import views


urlpatterns = [
    # path('',views.upload_timetable)
    path('upload_timetable',views.upload_timetable),
    path('get_time_table',views.get_time_table),
    path('upload_attendance',views.upload_attendance),
    path('get_attendance',views.get_attendance),
    path('upload_result',views.upload_result),
    path('get_result',views.get_result),
    path('get_result_sem',views.get_result_sem),
    path('upload_document',views.upload_document),
    path('get_all_documents',views.get_all_documents),
]