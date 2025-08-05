from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

class Schedule(models.Model):
    """学習スケジュール"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='schedules')
    title = models.CharField(max_length=200, verbose_name="学習内容")
    description = models.TextField(blank=True, verbose_name="詳細")
    start_time = models.DateTimeField(verbose_name="開始日時")
    end_time = models.DateTimeField(verbose_name="終了日時")
    is_completed = models.BooleanField(default=False, verbose_name="完了フラグ")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['start_time']
        verbose_name = "学習スケジュール"
        verbose_name_plural = "学習スケジュール"

    def __str__(self):
        return f"{self.title} ({self.user.username})"

    @property
    def duration_hours(self):
        """学習時間（時間単位）を計算する"""
        if self.end_time and self.start_time:
            return (self.end_time - self.start_time).total_seconds() / 3600
        return 0

class Message(models.Model):
    """川田からのメッセージ"""
    MESSAGE_TYPES = (
        ('encouragement', '励まし'),
        ('reminder', 'リマインダー'),
        ('congratulations', 'お祝い'),
        ('invitation', 'お誘い'),
        ('welcome_back', '復帰歓迎'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='messages')
    message_type = models.CharField(max_length=20, choices=MESSAGE_TYPES, verbose_name="メッセージ種別")
    content = models.TextField(verbose_name="内容")
    is_read = models.BooleanField(default=False, verbose_name="既読フラグ")
    sent_at = models.DateTimeField(auto_now_add=True, verbose_name="送信日時")

    class Meta:
        ordering = ['-sent_at']
        verbose_name = "川田からのメッセージ"
        verbose_name_plural = "川田からのメッセージ"

    def __str__(self):
        return f"To {self.user.username}: {self.get_message_type_display()}"

class UserStats(models.Model):
    """ユーザーの学習統計"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='scheduler_stats')
    completed_sessions = models.IntegerField(default=0, verbose_name="完了セッション数")
    total_hours = models.FloatField(default=0.0, verbose_name="合計学習時間")
    current_streak = models.IntegerField(default=0, verbose_name="現在の継続日数")
    longest_streak = models.IntegerField(default=0, verbose_name="最長の継続日数")
    last_study_date = models.DateField(null=True, blank=True, verbose_name="最終学習日")

    class Meta:
        verbose_name = "ユーザー統計"
        verbose_name_plural = "ユーザー統計"

    def __str__(self):
        return f"{self.user.username}の統計"

    def update_streak(self):
        """学習の継続日数を更新する"""
        today = timezone.now().date()
        if self.last_study_date:
            delta = today - self.last_study_date
            if delta.days == 1:
                self.current_streak += 1
            elif delta.days > 1:
                self.current_streak = 1
        else:
            self.current_streak = 1
        
        if self.current_streak > self.longest_streak:
            self.longest_streak = self.current_streak
        
        self.last_study_date = today
        self.save()
    
    def get_days_since_last_study(self):
        """最後の学習日からの経過日数を取得"""
        if not self.last_study_date:
            return None
        return (timezone.now().date() - self.last_study_date).days

class StudySession(models.Model):
    """学習セッションの記録"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='scheduler_study_sessions')
    app_name = models.CharField(max_length=100)
    lesson_name = models.CharField(max_length=200, blank=True, null=True)
    duration_minutes = models.IntegerField()
    completed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.app_name} ({self.duration_minutes}分)"
