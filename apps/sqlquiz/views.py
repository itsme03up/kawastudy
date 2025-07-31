# sqlquiz/views.py
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import re
from .models import Quiz, QuizStage

def normalize_sql(sql_string):
    """SQLクエリを正規化して比較用に準備する"""
    if not sql_string:
        return ""
    
    # 小文字に変換
    normalized = sql_string.lower()
    
    # 改行、タブ、複数の空白を単一の空白に変換
    normalized = re.sub(r'\s+', ' ', normalized)
    
    # 先頭と末尾の空白を削除
    normalized = normalized.strip()
    
    # セミコロンを削除（任意）
    normalized = normalized.rstrip(';')
    
    return normalized

def quiz(request):
    quizzes = Quiz.objects.all()
    return render(request, 'sqlquiz/quiz.html', {'quizzes': quizzes})

def stage_list(request):
    """ステージ選択画面"""
    stages = QuizStage.objects.all().order_by('stage_number')
    return render(request, 'sqlquiz/stage_list.html', {'stages': stages})

def quiz_play(request, stage_number):
    """クイズプレイ画面"""
    stage = get_object_or_404(QuizStage, stage_number=stage_number)
    return render(request, 'sqlquiz/quiz_play.html', {'stage': stage})

@csrf_exempt
def get_stage_data(request, stage_number):
    """ステージのデータをJSONで返すAPI"""
    stage = get_object_or_404(QuizStage, stage_number=stage_number)
    
    stage_data = {
        'tableName': stage.table_name,
        'story': stage.story_text,
        'sampleData': stage.get_sample_data(),
        'successReaction': stage.success_reaction,
        'failureReaction': stage.failure_reaction,
        'mockResult': stage.get_mock_result(),
        'hint': stage.hint  # ヒントを追加
    }
    
    return JsonResponse(stage_data)

@csrf_exempt
def check_answer(request, stage_number):
    """回答チェック（AJAX）"""
    if request.method == 'POST':
        stage = get_object_or_404(QuizStage, stage_number=stage_number)
        data = json.loads(request.body)
        user_sql = data.get('sql', '').strip()
        
        # 改良されたSQL比較ロジック
        normalized_user_sql = normalize_sql(user_sql)
        normalized_correct_sql = normalize_sql(stage.correct_sql)
        is_correct = normalized_user_sql == normalized_correct_sql
        
        return JsonResponse({
            'correct': is_correct,
            'correct_sql': stage.correct_sql if not is_correct else None,
            'hint': stage.hint if not is_correct else None
        })
    
    return JsonResponse({'error': 'Invalid request'}, status=400)
# sqlquiz/urls.py