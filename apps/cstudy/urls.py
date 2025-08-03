from django.urls import path
from . import views

app_name = 'cstudy'

urlpatterns = [
    path('', views.index, name='index'),
]