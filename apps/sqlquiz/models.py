# sqlquiz/models.py
from django.db import models

class Quiz(models.Model):
    title = models.CharField(max_length=255)
    question = models.TextField()
    correct_sql = models.TextField()

    def __str__(self):
        return self.title
