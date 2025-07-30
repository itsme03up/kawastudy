from django.urls import path
from . import views

app_name = 'sqlquiz'

urlpatterns = [
    path('', views.stage_list, name='stage_list'),
    path('old/', views.quiz, name='old_index'),  # 既存のクイズ機能
    path('stage/<int:stage_number>/', views.quiz_play, name='quiz_play'),
    path('stage/<int:stage_number>/data/', views.get_stage_data, name='get_stage_data'),
    path('stage/<int:stage_number>/check/', views.check_answer, name='check_answer'),
]
