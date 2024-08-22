from django.urls import path,include
from . import views

urlpatterns = [
    path('/login',views.login_view),
    path('/logout',views.logout_view),
    path('/signup',views.signup_view),
    path('/passChange',views.password_change_view)
]