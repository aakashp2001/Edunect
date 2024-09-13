from django.shortcuts import render
import pandas as pd
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from io import BytesIO
from django.core.files import File
from .models import TimeTable
from io import StringIO

@csrf_exempt
def upload_timetable(request):
    if request.method == 'POST':
        file = request.FILES['file']
        try:
            
            if file.name.endswith('.csv'):
                df = pd.read_csv(file, header=None)
            elif file.name.endswith('.xlsx'):
                df = pd.read_excel(file, engine='openpyxl', header=None)
            elif file.name.endswith('.xls'):
                df = pd.read_excel(file, engine='xlrd', header=None)
            else:
                return JsonResponse({'error': 'Unsupported file type'})

            
            if len(df) <= 3:
                return JsonResponse({'error': 'Not enough data rows'})

            sem = request.POST.get('sem')
            branch = request.POST.get('branch')

            df.columns = df.iloc[3]
            print(sem, branch, sep='  ')
            df = df[5:]
            df.reset_index(drop=True, inplace=True)

            
            buffer = BytesIO()
            df.to_csv(buffer, index=False)
            buffer.seek(0)  

            
            file_name = 'timetable.csv'
            django_file = File(buffer, name=file_name)

            
            timetable = TimeTable(
                sem=sem,
                branch=branch,
                file=django_file
            )
            timetable.save()  

            
            data_preview = df.head()

            return JsonResponse({'msg': 'File processed and saved successfully', 'data': data_preview.to_dict()})

        except Exception as e:
            return JsonResponse({'error': f'Error reading file: {str(e)}'})

    return JsonResponse({'error': 'Invalid request method'})

@csrf_exempt
def get_time_table(request):
    if request.method == 'POST':
        try:
            sem = request.POST.get('sem','')
            batch = request.POST.get('batch', '').upper()[0]
            main_batch = request.POST.get('batch', '').upper()
            if not batch:
                return JsonResponse({'error': 'Batch parameter is missing or empty'})
            
            timetable = TimeTable.objects.get(branch=batch,sem=sem)
            
            file_content = timetable.file.read().decode('utf-8')
            df = pd.read_csv(StringIO(file_content))
            desired_columns = ['DAY', 'Class Name', f'Batch {main_batch}']
            
            # Select only the desired columns and create a copy
            temp_df = df[desired_columns].copy()
            
            # Drop rows with all NaN values (if any column has at least one non-NaN value, the row is kept)
            temp_df.dropna(thresh=1, inplace=True)
            
            # Handle "BREAK" rows
            temp_df.loc[temp_df['Class Name'] == 'BREAK'] = temp_df.loc[temp_df['Class Name'] == 'BREAK'].fillna('BREAK')
            
            
            temp_df= temp_df.iloc[:-5]

            temp_df.reset_index(inplace=True,drop=True)
            for i in range(1,len(temp_df)):
                if temp_df.loc[i,'Class Name'] == 'BREAK':
                    continue
                else:
                    for  j in range(len(desired_columns)):
                        if temp_df.loc[i,desired_columns[j]]:
                            if pd.isna(temp_df.loc[i,desired_columns[j]]) and temp_df.loc[i-1,desired_columns[j]] == "BREAK":
                                temp_df.loc[i,desired_columns[j]] = temp_df.loc[i-2,desired_columns[j]]
                            elif pd.notna(temp_df.loc[i-1,desired_columns[j]]) and temp_df.loc[i-1,desired_columns[j]] != temp_df.loc[i,desired_columns[j]] and pd.notna(temp_df.loc[i,desired_columns[j]]):
                                continue
                            else:
                                temp_df.loc[i,desired_columns[j]] = temp_df.loc[i-1,desired_columns[j]]                        

            print(temp_df)
            
            return JsonResponse({'msg': 'Time table retrieved successfully','data':temp_df.to_json()})
        except TimeTable.DoesNotExist:
            return JsonResponse({'error': 'Time table not found'})
        except Exception as e:
            return JsonResponse({'error': 'An error occurred', 'msg': str(e)})
    
    return JsonResponse({'error': 'Invalid request method'})