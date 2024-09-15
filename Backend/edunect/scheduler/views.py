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

@csrf_exempt
def upload_attendance(request):
    if request.method == 'POST':
        # try:
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
            # print(batch)
            
            for i in batch:
                if(i['batch']!=None):
                    students = md.CustomUser.objects.filter(batch=i['batch'],sem=sem)
                    batch_df = final_df[final_df['Batch']==i['batch']]
                    # print(batch_df)
                    for index, row in batch_df.iterrows():
                        # print(row)
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
                                # Ensure absent_nos is a string
                                if isinstance(absent_nos, int):
                                    absent_nos = str(absent_nos)  # Convert integer to string

                                absent_roll_nos = str(absent_nos).split(', ')  # Split the string into a list
                                
                                for student in students:
                                    # Ensure student.roll_no is a string for comparison
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
                        
                    # for i in batch_df:
                    #     print(i['Absent_Nos'].split(', '))
                        # for student in students:
                            
                            # if student.roll_no == i['roll']:
                                # attendance, created = Attendance.objects.get_or_create(
                                #     student=student,
                                #     subject=i['Subject']
                                # )
                                # if not created:
                                #     attendance.attendance += 1
                                #     print('a')
                                # else:
                                #     attendance.attendance = 1
                                #     print('b')
                    
                    
            # Process the attendance data
            # for _, row in final_df.iterrows():
            #     lecture_no = row['Lecture_No']
            #     subject_name = row['Subject']
            #     absent_nos = str(row['Absent_Nos'])
            #     batch = row['Batch']
            #     if pd.notna(subject_name) and pd.notna(absent_nos):
            #         students_in_batch = md.CustomUser.objects.filter(batch=batch).values_list('id', flat=True)
                    
            #         # Handle attendance for each student in the batch
            #         absent_numbers = [int(num) for num in absent_nos.split(', ') if num.isdigit()]
                    
            #         for student_id in absent_numbers:
            #             if student_id in students_in_batch:
            #                 # Assuming roll_no matches student_id for the sake of this example
            #                 student = md.CustomUser.objects.get(id=student_id)
            #                 if student:
            #                     attendance, created = Attendance.objects.get_or_create(
            #                         student=student,
            #                         subject=subject_name
            #                     )
            #                     if not created:
            #                         print('in if')
            #                         # Update existing record
            #                         attendance.attendance += 1
            #                         attendance.save()
            #                     else:
            #                         print('in else')
            #                         # Initialize new record
            #                         attendance.attendance = 1
            #                         attendance.save()

            return JsonResponse({'message': 'File processed successfully', 'data': final_df.to_dict()})

        # except Exception as e:
        #     return JsonResponse({'error': f'An error occurred: {str(e)}'})

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

        # print(total_attendance)
        # print("total:",subject)
        # print("student:",student_attendance)

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
        # print(subject_dict)
        response_data = {
            'student': student,
            'batch': batch,
            'sem': sem,
            'attendance': subject_dict if student_attendance else 'No record',
        }
        
        return JsonResponse(response_data)
    return JsonResponse({'error': 'Invalid request method'})
        # except Exception as e:
        #     return JsonResponse({'error': f'An error occurred: {str(e)}'})