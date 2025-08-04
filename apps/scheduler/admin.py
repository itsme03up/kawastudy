from django.contrib import admin
from .models import StudySession, StudySchedule, KawadaMessage, UserStudyStats


@admin.register(StudySession)
class StudySessionAdmin(admin.ModelAdmin):
    list_display = ['user', 'app_name', 'lesson_name', 'duration_minutes', 'completed', 'created_at']
    list_filter = ['app_name', 'completed', 'created_at']
    search_fields = ['user__username', 'app_name', 'lesson_name']
    ordering = ['-created_at']


@admin.register(StudySchedule)
class StudyScheduleAdmin(admin.ModelAdmin):
    list_display = ['user', 'title', 'app_name', 'scheduled_date', 'reminder_sent', 'completed']
    list_filter = ['app_name', 'reminder_sent', 'completed', 'scheduled_date']
    search_fields = ['user__username', 'title', 'app_name']
    ordering = ['scheduled_date']


@admin.register(KawadaMessage)
class KawadaMessageAdmin(admin.ModelAdmin):
    list_display = ['user', 'message_type', 'title', 'kawada_expression', 'is_read', 'created_at']
    list_filter = ['message_type', 'is_read', 'kawada_expression', 'created_at']
    search_fields = ['user__username', 'title', 'content']
    ordering = ['-created_at']


@admin.register(UserStudyStats)
class UserStudyStatsAdmin(admin.ModelAdmin):
    list_display = ['user', 'total_study_days', 'current_streak', 'last_study_date', 'total_sessions', 'favorite_app']
    list_filter = ['favorite_app', 'last_study_date']
    search_fields = ['user__username']
    readonly_fields = ['created_at', 'updated_at']
