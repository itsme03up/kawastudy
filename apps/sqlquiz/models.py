# sqlquiz/models.py
from django.db import models
import json

class QuizStage(models.Model):
    stage_number = models.IntegerField(unique=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    question = models.TextField()
    correct_sql = models.TextField()
    hint = models.TextField(blank=True)
    
    # 新しいフィールド：ストーリーとデータ
    story_text = models.TextField(help_text="ステージのストーリー・背景")
    table_name = models.CharField(max_length=100, help_text="サンプルテーブル名")
    sample_data_json = models.TextField(help_text="サンプルデータ（JSON形式）")
    success_reaction = models.TextField(help_text="成功時の川田の反応")
    failure_reaction = models.TextField(help_text="失敗時の川田の反応")
    mock_result_json = models.TextField(help_text="模擬実行結果（JSON形式）", blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['stage_number']
    
    def __str__(self):
        return f"Stage{self.stage_number:02d}《{self.title}》"
    
    def get_sample_data(self):
        """サンプルデータをPythonオブジェクトとして取得"""
        try:
            return json.loads(self.sample_data_json)
        except (json.JSONDecodeError, TypeError):
            return []
    
    def set_sample_data(self, data):
        """サンプルデータをJSON形式で保存"""
        self.sample_data_json = json.dumps(data, ensure_ascii=False)
    
    def get_mock_result(self):
        """模擬実行結果をPythonオブジェクトとして取得"""
        try:
            return json.loads(self.mock_result_json)
        except (json.JSONDecodeError, TypeError):
            return []
    
    def set_mock_result(self, data):
        """模擬実行結果をJSON形式で保存"""
        self.mock_result_json = json.dumps(data, ensure_ascii=False)

class Quiz(models.Model):
    title = models.CharField(max_length=255)
    question = models.TextField()
    correct_sql = models.TextField()

    def __str__(self):
        return self.title
