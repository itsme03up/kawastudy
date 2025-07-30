# sqlquiz/views.py
from django.shortcuts import render
from .models import Quiz

def quiz(request):
    quizzes = Quiz.objects.all()
    return render(request, 'sqlquiz/quiz.html', {'quizzes': quizzes})
