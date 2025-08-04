from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import datetime, timedelta
import json


class StudySession(models.Model):
    """学習セッション記録"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='study_sessions')
    app_name = models.CharField(max_length=50)  # 'cstudy', 'sqlquiz', etc.
    lesson_name = models.CharField(max_length=100, blank=True)
    duration_minutes = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.app_name} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"


class StudySchedule(models.Model):
    """勉強スケジュール"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='study_schedules')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    app_name = models.CharField(max_length=50)
    scheduled_date = models.DateTimeField()
    reminder_sent = models.BooleanField(default=False)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['scheduled_date']
    
    def __str__(self):
        return f"{self.title} - {self.scheduled_date.strftime('%Y-%m-%d %H:%M')}"


class KawadaMessage(models.Model):
    """川田からのメッセージ"""
    MESSAGE_TYPES = [
        ('welcome_back', '復帰歓迎'),
        ('daily_greeting', '日常挨拶'),
        ('encouragement', '励まし'),
        ('reminder', 'リマインダー'),
        ('congratulations', 'お祝い'),
        ('invitation', 'お誘い'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='kawada_messages')
    message_type = models.CharField(max_length=20, choices=MESSAGE_TYPES)
    title = models.CharField(max_length=200)
    content = models.TextField()
    kawada_expression = models.CharField(max_length=50, default='default')  # 川田の表情
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.user.username}"


class UserStudyStats(models.Model):
    """ユーザー学習統計"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='study_stats')
    total_study_days = models.IntegerField(default=0)
    current_streak = models.IntegerField(default=0)  # 連続学習日数
    last_study_date = models.DateField(null=True, blank=True)
    total_sessions = models.IntegerField(default=0)
    total_minutes = models.IntegerField(default=0)
    favorite_app = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def get_days_since_last_study(self):
        """最後の学習日からの経過日数を取得"""
        if not self.last_study_date:
            return None
        return (timezone.now().date() - self.last_study_date).days
    
    def update_streak(self):
        """連続学習日数を更新"""
        today = timezone.now().date()
        if self.last_study_date:
            days_diff = (today - self.last_study_date).days
            if days_diff == 1:
                # 昨日学習していた場合、ストリークを継続
                self.current_streak += 1
            elif days_diff > 1:
                # 2日以上空いた場合、ストリークをリセット
                self.current_streak = 1
            # 同日の場合は何もしない
        else:
            # 初回学習
            self.current_streak = 1
        
        self.last_study_date = today
        self.save()
    
    def __str__(self):
        return f"{self.user.username} - {self.current_streak}日連続"
