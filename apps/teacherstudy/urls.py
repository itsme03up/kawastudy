from django.urls import path
from . import views

app_name = 'teacherstudy'

urlpatterns = [
    path('', views.teacher_study, name='teacher_study'),
]
