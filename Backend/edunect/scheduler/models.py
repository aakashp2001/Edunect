from django.db import models

class TimeTable(models.Model):
    branch = models.CharField(max_length=10,null=True,blank=True)
    sem = models.CharField(max_length=5,null=True,blank=True)
    file = models.FileField(upload_to='scheduler/TimeTable/',null=True,blank=True)
    
    def __str__(self):
        return f"{self.branch} {self.sem} TimeTable" 
    


