# linuxfun/views.py
from django.shortcuts import render

def linux_command_line(request):
    return render(request, 'linuxfun/linux_command_line.html')
