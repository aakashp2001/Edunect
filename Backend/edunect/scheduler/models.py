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

    def __str__(self):
        return f"{self.subject} {self.total}"
    
class Attendance(models.Model):
    student = models.ForeignKey(md.CustomUser,on_delete=models.CASCADE)
    subject = models.CharField(max_length=20)
    attendance = models.IntegerField()

    def __str__(self):
        return f"{self.student} {self.subject}"


