from django.shortcuts import render
import csv
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ValidationError
from django.utils.dateparse import parse_time
from io import TextIOWrapper
from .models import Day, TimeSlot, Subject, Batch, Timetable

@csrf_exempt
def upload_timetable(request):
    if request.method == 'POST' and request.FILES.get('file'):
        try:
            # Read the uploaded CSV file
            csv_file = TextIOWrapper(request.FILES['file'].file, encoding='utf-8')
            reader = csv.reader(csv_file)
            rows = list(reader)
            print('abc')
            
            # Check if CSV has a valid structure (e.g., required headers)
            if not validate_csv_structure(rows):
                return JsonResponse({'error': 'Invalid CSV structure'}, status=400)

            # Extract headers and process the rows accordingly
            process_timetable_data(rows)

            return JsonResponse({'message': 'Timetable uploaded successfully'})
        
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Invalid request'}, status=400)

def validate_csv_structure(rows):
    # Basic validation for headers (e.g., checking for specific keywords)
    headers = rows[3]  # Assuming the relevant headers are in the third row
    print(headers)
    return 'DAY' in headers

def process_timetable_data(rows):
    for row in rows[4:]:  # Start processing after the headers
        day_name = row[0]
        time_slot_str = row[1]
        batch_data = row[2:]
        
        # Find or create the Day
        day, _ = Day.objects.get_or_create(name=day_name)
        
        # Parse and find/create the TimeSlot
        start_time, end_time = map(parse_time, time_slot_str.split(' to '))
        time_slot, _ = TimeSlot.objects.get_or_create(start_time=start_time, end_time=end_time)
        
        for i, subject_str in enumerate(batch_data):
            batch_name = f"Batch B{i+1}"  # Assuming batches are named sequentially
            batch, _ = Batch.objects.get_or_create(name=batch_name)
            
            # Parse Subject details
            if subject_str:
                subject_name, instructor, room_number = parse_subject_details(subject_str)
                subject, _ = Subject.objects.get_or_create(
                    name=subject_name,
                    instructor=instructor,
                    room_number=room_number
                )
                
                # Create or update the Timetable entry
                Timetable.objects.update_or_create(
                    day=day,
                    time_slot=time_slot,
                    batch=batch,
                    defaults={'subject': subject}
                )

def parse_subject_details(subject_str):
    # Example of splitting subject details, adjust according to actual data format
    parts = subject_str.split(' ')
    subject_name = parts[0]
    instructor = parts[1].strip('()')  # e.g., "PSP"
    room_number = parts[-1]  # e.g., "406-1"
    return subject_name, instructor, room_number
