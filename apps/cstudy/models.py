"""
C言語学習アプリケーションのモデル定義

このモジュールには、C言語学習セクションとクイズ問題のモデルが含まれています。
"""
from django.db import models

class CLessonSection(models.Model):
    """C言語学習セクション"""
    id = models.AutoField(primary_key=True)
    position = models.IntegerField(help_text="スクロール位置 (px)")
    side = models.CharField(
        max_length=10,
        choices=[('left', 'Left'), ('right', 'Right')],
        default='left'
    )
    type = models.CharField(max_length=20, choices=[
        ('text', 'Text'),
        ('code', 'Code'),
        ('explanation', 'Explanation'),
        ('warning', 'Warning Quiz')
    ], default='text')
    content = models.TextField(help_text="表示内容")
    kawada_emotion = models.CharField(max_length=20, choices=[
        ('default', 'Default'),
        ('cheerful', 'Cheerful'),
        ('gentle', 'Gentle'),
        ('thinking', 'Thinking'),
        ('smile', 'Smile')
    ], default='default')
    order = models.IntegerField(default=0, help_text="表示順序")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        """メタデータクラス"""
        ordering = ['order', 'position']

    def __str__(self):
        return f"Section {self.order}: {self.type} at {self.position}px"

class CQuizQuestion(models.Model):
    """Warning問題"""
    question = models.TextField(help_text="問題文")
    options = models.JSONField(help_text="選択肢（JSON配列）")
    correct_answer = models.IntegerField(help_text="正解番号（0から開始）")
    explanation = models.TextField(help_text="解説")
    kawada_correct_message = models.CharField(
        max_length=200,
        default="川田、正解です！"
    )
    kawada_wrong_message = models.CharField(
        max_length=200,
        default="川田、もう一度考えてみましょう"
    )
    trigger_position = models.IntegerField(help_text="問題表示位置 (px)")
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)

    class Meta:
        """メタデータクラス"""
        ordering = ['order']

    def __str__(self):
        return f"Quiz {self.order}: {str(self.question)[:50]}..."
