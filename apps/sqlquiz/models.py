# sqlquiz/models.py
from django.db import models

class QuizStage(models.Model):
    stage_number = models.IntegerField(unique=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    question = models.TextField()
    correct_sql = models.TextField()
    hint = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['stage_number']
    
    def __str__(self):
        return f"Stage{self.stage_number:02d}《{self.title}》"

class Quiz(models.Model):
    title = models.CharField(max_length=255)
    question = models.TextField()
    correct_sql = models.TextField()

    def __str__(self):
        return self.title
