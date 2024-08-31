from django.shortcuts import render
import pandas as pd
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from io import BytesIO
from django.core.files import File
from .models import TimeTable

@csrf_exempt
def upload_timetable(request):
    if request.method == 'POST':
        file = request.FILES['file']
        try:
            # Read the uploaded file into a DataFrame
            if file.name.endswith('.csv'):
                df = pd.read_csv(file, header=None)
            elif file.name.endswith('.xlsx'):
                df = pd.read_excel(file, engine='openpyxl', header=None)
            elif file.name.endswith('.xls'):
                df = pd.read_excel(file, engine='xlrd', header=None)
            else:
                return JsonResponse({'error': 'Unsupported file type'})

            # Ensure there are enough rows
            if len(df) <= 3:
                return JsonResponse({'error': 'Not enough data rows'})

            sem = request.POST.get('sem')
            branch = request.POST.get('branch')

            df.columns = df.iloc[3]
            print(sem, branch, sep='  ')
            df = df[5:]
            df.reset_index(drop=True, inplace=True)

            # Convert DataFrame to CSV format
            buffer = BytesIO()
            df.to_csv(buffer, index=False)
            buffer.seek(0)  # Rewind the buffer to the beginning

            # Create a Django File object from the buffer
            file_name = 'timetable.csv'
            django_file = File(buffer, name=file_name)

            # Create a new TimeTable object and save the file
            timetable = TimeTable(
                sem=sem,
                branch=branch,
                file=django_file
            )
            timetable.save()  # Save the model instance

            # Preview data (optional)
            data_preview = df.head()

            return JsonResponse({'msg': 'File processed and saved successfully', 'data': data_preview.to_dict()})

        except Exception as e:
            return JsonResponse({'error': f'Error reading file: {str(e)}'})

    return JsonResponse({'error': 'Invalid request method'})
