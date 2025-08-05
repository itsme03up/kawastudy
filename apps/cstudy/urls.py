from django.urls import path
from . import views

app_name = 'cstudy'

urlpatterns = [
    path('', views.index, name='index'),
    path('api/lessons/', views.lesson_data, name='lesson_data'),
    path('api/quizzes/', views.quiz_data, name='quiz_data'),
    path('api/submit-quiz/', views.submit_quiz_answer, name='submit_quiz'),
    path('api/run-code/', views.run_code, name='run_code'),
    path('test-parallax/', views.test_parallax, name='test_parallax'),
]