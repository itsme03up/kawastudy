from django.urls import path
from . import views

app_name = 'aws'

urlpatterns = [
    path('', views.index, name='index'),
    path('columns/', views.column_list, name='column_list'),
    path('quizzes/', views.quiz_list, name='quiz_list'),
]