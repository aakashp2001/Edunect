from django.db import models
from account import models as md
class TimeTable(models.Model):
    branch = models.CharField(max_length=10,null=True,blank=True)
    sem = models.CharField(max_length=5,null=True,blank=True)
    file = models.FileField(upload_to='scheduler/TimeTable/',null=True,blank=True)
    
    def __str__(self):
        return f"{self.branch} {self.sem} TimeTable" 
    
class Subject(models.Model):
    subject = models.CharField(max_length=20)
    total = models.IntegerField(null=True,blank=True)
    sem = models.CharField(max_length=5,null=True,blank=True)
    batch = models.CharField(max_length=20, null=True,blank=True)
    

    def __str__(self):
        return f"{self.batch} {self.subject} {self.total}"
    
class Attendance(models.Model):
    student = models.CharField(max_length=40)
    subject = models.CharField(max_length=20)
    batch = models.CharField(max_length=20)
    sem = models.CharField(max_length=5,null=True,blank=True)
    attendance = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.student} {self.subject}"


class Result(models.Model):
    student = models.CharField(max_length=40) #enrollment number 
    subject = models.CharField(max_length=20)
    t1 = models.IntegerField(null=True, blank=True)
    t2 = models.IntegerField(null=True, blank=True)
    t3 = models.IntegerField(null=True, blank=True)
    t4 = models.IntegerField(null=True, blank=True)
    sem = models.CharField(max_length=5, null=True,blank=True)
    def __str__(self):
        return f"{self.student} {self.subject} of sem {self.sem}"