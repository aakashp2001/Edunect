from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required, permission_required
from django.contrib.auth import authenticate, login, logout
import json
from datetime import datetime, timedelta
from django.conf import settings
from account.models import CustomUser
import pandas as pd

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

                return JsonResponse({'resp': 1, 'message': 'User Logged in','session_expiry_age':session_expiry_age,'expire_at':expires_at,'first_time':user.first_time})
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
        if 'file' in request.FILES:
            uploaded_file = request.FILES['file']
            password = request.POST.get('password', 'defaultpassword') 
            
            try:
                if uploaded_file.name.endswith('.xlsx'):
                    df = pd.read_excel(uploaded_file, engine='openpyxl')
                elif uploaded_file.name.endswith('.xls'):
                    df = pd.read_excel(uploaded_file, engine='xlrd')
                else:
                    return JsonResponse({'error': 'Unsupported file type'}, status=400)

                required_fields = ['username', 'email', 'full_name','branch','batch','roll_no']
                field_mappings = {
                    'enrollment': 'username',
                    'email': 'email',
                    'full_name': 'full_name',
                    'Branch': 'branch',
                    'batch': 'batch',
                    'SEM-3-Roll No': 'roll_no'
                }

                users_to_create = []
                error_messages = []

                for index, row in df.iterrows():
                    user_data = {}
                    missing_fields = []

                    for key, mapped_field in field_mappings.items():
                        value = row.get(key, '')
                        if pd.isna(value):
                            value = ''
                        user_data[mapped_field] = value
                        print(mapped_field,required_fields,sep="  ")
                        if mapped_field in required_fields and value == '':
                            print('in me')
                            missing_fields.append(key)

                    user_data['password'] = password
                    user_data['first_time'] = True

                    if missing_fields:
                        error_messages.append({
                            'row': index + 1,  
                            'missing_fields': missing_fields
                        })
                        continue 

                    users_to_create.append(user_data)

                if error_messages:
                    return JsonResponse({
                        'resp': '0',
                        'error': 'Missing required fields in some rows',
                        'details': error_messages
                    }, status=400)

                for user_data in users_to_create:
                    try:
                        CustomUser.objects.create_user(
                            username=user_data['username'],
                            password=user_data['password'],
                            email=user_data['email'],
                            full_name=user_data['full_name'],
                            user_type=user_data.get('user_type', 'student'),
                            branch=user_data.get('branch', ''),
                            batch=user_data.get('batch', ''),
                            roll_no=user_data.get('roll_no', ''),
                            first_time=user_data['first_time']
                        )
                    except Exception as e:
                        return JsonResponse({'resp': '0','error': f'Error creating user: {str(e)}'}, status=400)

                return JsonResponse({'resp':1,'message': 'Users created successfully!',"data":missing_fields})

            except Exception as e:
                return JsonResponse({'resp': '0','error': f'Error processing file: {str(e)}'}, status=400)
        
        return JsonResponse({'resp': '0','error': 'No file uploaded'}, status=400)
    
    return JsonResponse({'resp': '0','error': 'Invalid request method'}, status=405)

@csrf_exempt
def password_change_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            current_password = data.get('current_password')
            new_password = data.get('new_password')

            user = authenticate(username=username, password=current_password)
            if user is not None:
                user.set_password(new_password)
                user.save()

                return JsonResponse({'resp': 1, 'message': 'Password changed successfully!'})
            else:
                return JsonResponse({'resp': 0, 'message': 'Invalid username or current password.'})
        except json.JSONDecodeError:
            return JsonResponse({'resp': 0, 'message': 'Invalid JSON.'})
    else:
        return JsonResponse({'resp': 0, 'message': 'Invalid HTTP method. Only POST is allowed.'})