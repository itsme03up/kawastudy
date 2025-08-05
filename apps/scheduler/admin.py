from django.contrib import admin
from .models import Schedule, Message, UserStats, StudySession


@admin.register(Schedule)
class ScheduleAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'start_time', 'end_time', 'is_completed')
    list_filter = ('user', 'is_completed', 'start_time')
    search_fields = ('title', 'description')


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('user', 'message_type', 'is_read', 'sent_at')
    list_filter = ('user', 'message_type', 'is_read')


@admin.register(UserStats)
class UserStatsAdmin(admin.ModelAdmin):
    list_display = ('user', 'completed_sessions', 'total_hours', 'current_streak', 'last_study_date')
    search_fields = ('user__username',)


@admin.register(StudySession)
class StudySessionAdmin(admin.ModelAdmin):
    list_display = ('user', 'app_name', 'duration_minutes', 'completed_at')
    list_filter = ('user', 'app_name')
    search_fields = ('user__username', 'app_name', 'lesson_name')
