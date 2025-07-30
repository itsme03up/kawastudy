from django.urls import path
from . import views

urlpatterns = [
    path('', views.linux_command_line, name='linuxfun_linux'),
]
