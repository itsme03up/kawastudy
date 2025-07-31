# sqlquiz/admin.py
from django.contrib import admin
from .models import Quiz, QuizStage

@admin.register(QuizStage)
class QuizStageAdmin(admin.ModelAdmin):
    list_display = ('stage_number', 'title', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('title', 'description', 'question')
    ordering = ('stage_number',)
    
    fieldsets = (
        ('基本情報', {
            'fields': ('stage_number', 'title', 'description')
        }),
        ('問題設定', {
            'fields': ('question', 'correct_sql', 'hint')
        }),
        ('ストーリー・データ', {
            'fields': ('story_text', 'table_name', 'sample_data_json', 'mock_result_json')
        }),
        ('リアクション', {
            'fields': ('success_reaction', 'failure_reaction')
        }),
    )

@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ('title', 'question')
    search_fields = ('title', 'question')
