from django.contrib import admin
from .models import CLessonSection, CQuizQuestion

@admin.register(CLessonSection)
class CLessonSectionAdmin(admin.ModelAdmin):
    list_display = ['order', 'type', 'side', 'position', 'kawada_emotion', 'is_active']
    list_filter = ['type', 'side', 'kawada_emotion', 'is_active']
    search_fields = ['content']
    list_editable = ['position', 'is_active']
    list_display_links = ['order', 'type']
    ordering = ['order', 'position']

@admin.register(CQuizQuestion)
class CQuizQuestionAdmin(admin.ModelAdmin):
    list_display = ['order', 'question_preview', 'trigger_position', 'is_active']
    list_filter = ['is_active']
    search_fields = ['question']
    list_editable = ['trigger_position', 'is_active']
    list_display_links = ['order', 'question_preview']
    ordering = ['order']

    def question_preview(self, obj):
        return obj.question[:50] + "..." if len(obj.question) > 50 else obj.question
    question_preview.short_description = "Question"
