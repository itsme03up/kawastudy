from django.urls import path
from . import views

app_name = 'chatlesson'

urlpatterns = [
    path('', views.chat_react, name='chat'),  # Reactベースのビューに変更
    path('legacy/', views.chat, name='chat_legacy'),  # 従来のビューは残しておく
    path('api/', views.chat_api, name='chat_api'),
    path('history/', views.get_chat_history, name='chat_history'),
]
