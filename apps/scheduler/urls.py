from django.urls import path
from . import views

app_name = 'scheduler'

urlpatterns = [
    path('', views.scheduler_dashboard, name='dashboard'),
    path('schedule/', views.create_schedule, name='create_schedule'),
    path('messages/', views.kawada_messages, name='messages'),
    path('messages/<int:message_id>/read/', views.mark_message_read, name='mark_message_read'),
    path('api/study-session/', views.record_study_session, name='record_study_session'),
    path('api/messages/unread/', views.get_unread_messages, name='get_unread_messages'),
    path('api/stats/', views.get_user_stats, name='get_user_stats'),
]
