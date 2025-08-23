from django.shortcuts import render

def teacher_study(request):
    return render(request, 'teacherstudy/teacher_study.html')
