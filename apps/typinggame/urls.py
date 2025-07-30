from django.urls import path
from . import views

app_name = 'typing'

urlpatterns = [
    path('', views.index, name='index'),
]
