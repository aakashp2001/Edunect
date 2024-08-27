from django.db import models

class Day(models.Model):
    name = models.CharField(max_length=10)  # e.g., "Monday"
    
    def __str__(self):
        return self.name

class TimeSlot(models.Model):
    start_time = models.TimeField()  # e.g., 08:45
    end_time = models.TimeField()    # e.g., 09:45
    
    def __str__(self):
        return f"{self.start_time} to {self.end_time}"

class Subject(models.Model):
    name = models.CharField(max_length=100)  # e.g., "FSD-2"
    instructor = models.CharField(max_length=50)  # e.g., "PSP"
    room_number = models.CharField(max_length=10)  # e.g., "406-1"
    
    def __str__(self):
        return f"{self.name} ({self.instructor}) {self.room_number}"

class Batch(models.Model):
    name = models.CharField(max_length=10)  # e.g., "Batch B1"
    
    def __str__(self):
        return self.name

class Timetable(models.Model):
    day = models.ForeignKey(Day, on_delete=models.CASCADE)
    time_slot = models.ForeignKey(TimeSlot, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.day} {self.time_slot} - {self.batch}: {self.subject}"

class Student(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    roll_number = models.CharField(max_length=10, unique=True)  # e.g., "18CE100"

    def __str__(self):
        return f"{self.roll_number}: {self.first_name} {self.last_name}"

class Attendance(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    timetable = models.ForeignKey(Timetable, on_delete=models.CASCADE)
    date = models.DateField()
    present = models.BooleanField(default=False)

    def __str__(self):
        return f"Attendance for {self.student} on {self.date}: {'Present' if self.present else 'Absent'}"
