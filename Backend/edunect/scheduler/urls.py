from django.urls import path,include
from . import views

urlpatterns = [
    # path('',views.upload_timetable)
    path('upload_timetable',views.upload_timetable)
]
