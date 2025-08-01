from django.urls import path
from . import views

app_name = 'aws'

urlpatterns = [
    path('', views.index, name='index'),  # AWSトップページ
    path('columns/', views.column_list, name='column_list'),  # コラム一覧
    path('quizzes/', views.quiz_list, name='quiz_list'),      # クイズ一覧
]