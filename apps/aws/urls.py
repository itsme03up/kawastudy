from django.urls import path
from . import views

app_name = 'aws'

urlpatterns = [
    path('', views.index, name='index'),  # AWSトップページ
    path('quiz/', views.quiz_question, name='quiz_question'),
]