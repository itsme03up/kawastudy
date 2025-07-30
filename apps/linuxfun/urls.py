from django.urls import path
from . import views

app_name = 'linux'

urlpatterns = [
    path('', views.linux_command_line, name='index'),
]
