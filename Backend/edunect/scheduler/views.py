from django.shortcuts import render
import pandas as pd
import numpy as np
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from io import BytesIO
from django.core.files import File
from .models import *
from io import StringIO
from account import models as md
from django.http import FileResponse, Http404
from django.conf import settings
import os

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
            temp_df = df[desired_columns].copy()
            
            temp_df.dropna(thresh=1, inplace=True)
            
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

@csrf_exempt
def upload_attendance(request):
    if request.method == 'POST':
            file = request.FILES['file']
            sem = request.POST.get('sem')
            if file.name.endswith('.csv'):
                try:
                    df = pd.read_csv(file, header=None)
                except Exception as e:
                    return JsonResponse({'error': f'Error reading CSV file: {str(e)}'})
            elif file.name.endswith('.xlsx') or file.name.endswith('.xls'):
                try:
                    df = pd.read_excel(file, engine='openpyxl' if file.name.endswith('.xlsx') else 'xlrd', header=None)
                except Exception as e:
                    return JsonResponse({'error': f'Error reading Excel file: {str(e)}'})
            else:
                return JsonResponse({'error': 'Unsupported file type'})

            if df.empty:
                return JsonResponse({'error': 'File is empty or invalid format'})

            final_df = pd.DataFrame()
            df = df[1:]
            df.reset_index(drop=True, inplace=True)
            i = 0
            while i < df.shape[1]:
                batch_name = df.iloc[0, i+2] if i+2 < df.shape[1] else 'Unknown Batch'
                
                branch_list = df.iloc[0::7, i]
                replicated_list = [element.split(' ')[1] for element in branch_list for _ in range(5)]
                
                start_row = 2
                pattern_rows = []

                while start_row < df.shape[0]:
                    end_row = start_row + 5
                    pattern_rows.append(df.iloc[start_row:end_row, i:i+4])
                    start_row = end_row + 2

                data_rows = pd.concat(pattern_rows, ignore_index=True)
                data_rows.columns = ['Lecture_No', 'Subject', 'Faculty', 'Absent_Nos']
                data_rows['Batch'] = replicated_list
                
                final_df = pd.concat([final_df, data_rows], ignore_index=True)
                i += 5

            final_df = final_df[~final_df['Lecture_No'].astype(str).str.contains('Batch:')]
            final_df = final_df.dropna(subset=['Lecture_No'])

            print(final_df)
            print(final_df[final_df['Batch']=='D1'])
            
            batch = md.CustomUser.objects.values('batch').annotate(student_count=models.Count('id'))
            
            for i in batch:
                if(i['batch']!=None):
                    students = md.CustomUser.objects.filter(batch=i['batch'],sem=sem)
                    batch_df = final_df[final_df['Batch']==i['batch']]
                    for index, row in batch_df.iterrows():
                        if(pd.notna(row['Subject'])):
                            subject, created = Subject.objects.get_or_create(
                                                subject=row['Subject'],
                                                sem = sem,
                                                batch = row['Batch']
                                            )
                                            
                            if not created:
                                subject.total += 1
                            else:
                                subject.total = 1
                            subject.save()
                            
                            print(row)
                            absent_nos = row['Absent_Nos']
                            if absent_nos != 'NIL':
                                if isinstance(absent_nos, int):
                                    absent_nos = str(absent_nos)  # Convert integer to string

                                absent_roll_nos = str(absent_nos).split(', ')  # Split the string into a list
                                
                                for student in students:
                                    if isinstance(student.roll_no, int):
                                        student_roll_no = str(student.roll_no)
                                    else:
                                        student_roll_no = student.roll_no
                                    
                                    if student_roll_no not in absent_roll_nos:
                                        print(absent_roll_nos)
                                        
                                        attendance, created = Attendance.objects.get_or_create(
                                            student=student_roll_no,
                                            sem=sem,
                                            batch=student.batch,
                                            subject=row['Subject']
                                        )
                                        
                                        if not created:
                                            attendance.attendance += 1
                                        else:
                                            attendance.attendance = 1
                                        
                                        attendance.save()
                                    

                            else:
                                print('full present processing')
                                for student in students:
                                    print(student)
                                    attendance, created = Attendance.objects.get_or_create(
                                            student=student.roll_no,
                                            sem=sem,
                                            batch=student.batch,
                                            subject=row['Subject'])
                                    if not created:
                                        attendance.attendance += 1
                                    else:
                                        attendance.attendance = 1
                                    attendance.save()    
                    

            return JsonResponse({'message': 'File processed successfully', 'data': final_df.to_dict()})

      
@csrf_exempt
def get_attendance(request):
    if request.method == 'POST':
        total_attendance = []
        student = request.POST.get('student')
        batch = request.POST.get('batch').upper()
        sem = request.POST.get('sem')
        if not student or not batch or not sem:
            return JsonResponse({'error': 'Missing parameters'}, status=400)
    
        try:
            student_attendance = Attendance.objects.filter(
                student=student,
                batch=batch,
                sem=sem
            )
        except Attendance.DoesNotExist:
            student_attendance = None

        try:
            subject = Subject.objects.filter(
                batch=batch,
                sem=sem
            )
            for i in subject:
                total_attendance.append(i.total)
        except Subject.DoesNotExist:
            total_attendance = None

     

        subject_dict = {}

        subject_lectures = {
            obj.subject: obj.total 
            for obj in subject
        }
        for attendance in student_attendance:
            subject_name = attendance.subject 
            if subject_name not in subject_dict:
                subject_dict[subject_name] = [0, []] 
            
            subject_dict[subject_name][0] = subject_lectures.get(subject_name, 0) 
            subject_dict[subject_name][1] =(attendance.attendance)
        response_data = {
            'student': student,
            'batch': batch,
            'sem': sem,
            'attendance': subject_dict if student_attendance else 'No record',
        }
        
        return JsonResponse(response_data)
    return JsonResponse({'error': 'Invalid request method'})
        
@csrf_exempt
def upload_result(request):
    try:
        if request.method == "POST":
            file = request.FILES['file']
            phase = request.POST.get('phase').lower()
            subject = request.POST.get('subject').upper()
            sem = request.POST.get('sem')
            if phase not in ['t1','t2','t3','t4']:
                return JsonResponse({'resp':0,'error':'Invalid Phase use t1, t2, t3, t4 only'})
            if file.name.endswith('.csv'):
                try:
                    df = pd.read_csv(file, header=None)
                except Exception as e:
                    return JsonResponse({'error': f'Error reading CSV file: {str(e)}'})
            elif file.name.endswith('.xlsx') or file.name.endswith('.xls'):
                try:
                    df = pd.read_excel(file, engine='openpyxl' if file.name.endswith('.xlsx') else 'xlrd', header=None)
                except Exception as e:
                    return JsonResponse({'error': f'Error reading Excel file: {str(e)}'})
            else:
                return JsonResponse({'error': 'Unsupported file type'})

            if df.empty:
                return JsonResponse({'error': 'File is empty or invalid format'})
            final_df = df.iloc[2:].reset_index(drop=True)
            final_df.columns = ['enrollment_number', 'marks']
            
            for index, row in final_df.iterrows():
                print(row['enrollment_number'],row['marks'])
                result,created = Result.objects.get_or_create(
                    student = row['enrollment_number'],
                    sem = sem,
                    subject = subject
                )
                if not created:
                    if(phase=='t1'):
                        result.t1 = row['marks']
                    elif(phase=='t2'):
                        result.t2 = row['marks']
                    elif(phase=='t3'):
                        result.t3 = row['marks']
                    else:
                        result.t4 = row['marks']
                else:
                    if(phase=='t1'):
                        result.t1 = row['marks']
                    elif(phase=='t2'):
                        result.t2 = row['marks']
                    elif(phase=='t3'):
                        result.t3 = row['marks']
                    else:
                        result.t4 = row['marks']
                result.save()

            return JsonResponse({'resp':1, 'message':'data added successfully','data': final_df.to_dict()})
        else:
            return JsonResponse({'resp':0,'error':'Invalid Method Use Post'})
    except Exception as e:
        return JsonResponse({'resp':0,'error':str(e)})

@csrf_exempt
def get_result(request):
    try:
        if request.method == "POST":
            sem = request.POST.get('sem')
            student = request.POST.get('student')
            final_result = []
            results = Result.objects.filter(student=student,sem=sem)
            print(results)
            if results:
                for i in results:
                    final_result.append(
                        {
                            'student':i.student,
                            'subject': i.subject,
                            't1':i.t1,
                            't2':i.t2,
                            't3':i.t3,
                            't4':i.t4,
                            'sem':i.sem                       
                        }
                    )
                return JsonResponse({'resp':1,'data':final_result})
            else:
                return JsonResponse({'resp':1,'message':'no record','data':[]})
        pass
    except Exception as e:
        return JsonResponse({'resp':0,'error':str(e)})
    
@csrf_exempt
def get_result_sem(request):
    try:
        if request.method == "POST":
            unique_sems = Result.objects.values_list('sem', flat=True).distinct()
            if(unique_sems):
                return JsonResponse({'unique_sems': list(unique_sems)})
            else:
                return JsonResponse({'resp':0,'message':'no record'})
        else:
                return JsonResponse({'resp':0,'error':'Expected Request Method is POST'})
        
    except Exception as e:
        return JsonResponse({'resp':0,'error':str(e)})
    
@csrf_exempt
def upload_document(request):
    try:
        if request.method == "POST":
            if request.FILES.get('document') and request.POST.get('title'):
                title = request.POST.get('title')
                document = request.FILES['document']

                if document.content_type != 'application/pdf':
                    return JsonResponse({'resp': 0, 'message': 'Only PDF files are allowed.'})

                doc_instance = Document(title=title, document=document)
                doc_instance.save()

                return JsonResponse({'resp': 1, 'message': 'Document uploaded successfully.'})
            else:
                return JsonResponse({'resp': 0, 'error': 'Title or document missing.'})
        else:
            return JsonResponse({'resp': 0, 'error': 'Expected Request Method is POST'})
    
    except Exception as e:
        return JsonResponse({'resp': 0, 'error': str(e)})


@csrf_exempt
def get_all_documents(request):
    try:
        if request.method == "POST":
            documents = Document.objects.all().order_by('-id')
            
            document_list = []
            for doc in documents:
                document_list.append({
                    'id': doc.id,
                    'title': doc.title,
                    'document': doc.document.url  
                })

            return JsonResponse({'documents': document_list})
        else:
            return JsonResponse({'resp': 0, 'error': 'Expected Request Method is POST'})

    except Exception as e:
        return JsonResponse({'resp': 0, 'error': str(e)})
    
def serve_file(request, filename):
    file_path = os.path.join(settings.DOCUMENTS_ROOT, filename)
    if os.path.exists(file_path):
        return FileResponse(open(file_path, 'rb'))
    else:
        raise Http404("File not found")