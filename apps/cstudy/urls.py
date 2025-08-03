from django.urls import path, include
from . import views

app_name = 'cstudy'

urlpatterns = [
    path('', views.index, name='index'),
    path('cstudy/', include('apps.cstudy.urls')),
]