from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required, permission_required
from django.contrib.auth import authenticate, login, logout
import json
from datetime import datetime, timedelta
from django.conf import settings
from account.models import CustomUser

def get_session_data():
    session_expiry_age = getattr(settings, 'SESSION_COOKIE_AGE', 1209600)
    expires_at = datetime.utcnow() + timedelta(seconds=session_expiry_age)
    return session_expiry_age,expires_at


@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')

            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                session_expiry_age,expires_at = get_session_data()
                # Return a response indicating success
                return JsonResponse({'resp': 1, 'message': 'User Logged in','session_expiry_age':session_expiry_age,'expire_at':expires_at})
            else:
                return JsonResponse({'resp': 0, 'message': 'Invalid User Credentials'})
        except json.JSONDecodeError:
            return JsonResponse({'resp': 0, 'message': 'Invalid JSON'})
    return JsonResponse({'resp': 0, 'message': 'Invalid request method'})


@csrf_exempt
def logout_view(request):
    if request.method == 'POST':
        logout(request)
        return JsonResponse({'resp': 1, 'message': 'Logged out successfully'})
    return JsonResponse({'resp': 0, 'message': 'Invalid request method'})


@csrf_exempt
def signup_view(request):
    if request.method == 'POST':
        try:
            
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            email = data.get('email')
            first_name = data.get('first_name')
            last_name = data.get('last_name')
            user_type = data.get('user_type')
            user = CustomUser.objects.create_user(username=username, password=password,email=email,first_name=first_name,last_name=last_name,user_type=user_type)
            login(request, user)
            session_expiry_age,expires_at = get_session_data()
            return JsonResponse({'resp': 1, 'message': 'User signed up and logged in','session_expiry_age':session_expiry_age,'expire_at':expires_at})
        except json.JSONDecodeError:
            return JsonResponse({'resp': 0, 'message': 'Invalid JSON'})
    return JsonResponse({'resp': 0, 'message': 'Invalid request method'})