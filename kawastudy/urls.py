"""
kawastudy URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from apps.core import views as core_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', core_views.home, name='home'),
    path('accounts/', include('allauth.urls')),  # django-allauth用
    path('accounts/profile/', core_views.profile_edit, name='profile_edit'),  # プロフィール編集
    path('typing/', include('apps.typinggame.urls')),   
    path('chat/', include('apps.chatlesson.urls')),
    path('sqlquiz/', include('apps.sqlquiz.urls')),
    path('linux/', include('apps.linuxfun.urls')),
    path('aws/', include('apps.aws.urls')),
    path('cstudy/', include('apps.cstudy.urls')),
    path('schedule/', include('apps.scheduler.urls')),  # 川田スケジューラー
]
