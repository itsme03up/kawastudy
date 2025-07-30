from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='typinggame_index'),
]
