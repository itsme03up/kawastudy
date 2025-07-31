from django.urls import path
from . import views

app_name = 'chatlesson'

urlpatterns = [
    path('', views.chat, name='chat'),
    path('api/', views.chat_api, name='chat_api'),
]
