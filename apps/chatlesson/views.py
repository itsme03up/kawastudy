# chatlesson/views.py
from django.shortcuts import render

def chat(request):
    return render(request, 'chatlesson/chat.html')
