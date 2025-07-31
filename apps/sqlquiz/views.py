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

def check_sql_equivalence(user_sql, stage):
    """SQLの意味的同等性をチェック"""
    normalized_user_sql = normalize_sql(user_sql)
    
    # メインの正解パターンをチェック
    normalized_correct_sql = normalize_sql(stage.correct_sql)
    if normalized_user_sql == normalized_correct_sql:
        return True
    
    # 代替正解パターンをチェック
    alternative_solutions = stage.get_alternative_solutions()
    for alt_sql in alternative_solutions:
        normalized_alt_sql = normalize_sql(alt_sql)
        if normalized_user_sql == normalized_alt_sql:
            return True
    
    # BETWEEN パターンの自動検出と変換
    return check_between_equivalence(normalized_user_sql, normalized_correct_sql)

def check_between_equivalence(user_sql, correct_sql):
    """BETWEEN句と比較演算子の同等性をチェック"""
    # BETWEEN パターン: WHERE price BETWEEN 1000 AND 2000
    # 比較演算子パターン: WHERE price >= 1000 AND price <= 2000
    
    # BETWEEN → 比較演算子への変換
    between_pattern = r'(\w+)\s+between\s+(\d+)\s+and\s+(\d+)'
    comparison_pattern = r'\1 >= \2 and \1 <= \3'
    
    # ユーザー入力のBETWEENを比較演算子に変換
    user_converted = re.sub(between_pattern, comparison_pattern, user_sql)
    if user_converted == correct_sql:
        return True
    
    # 正解のBETWEENを比較演算子に変換（逆パターン）
    correct_converted = re.sub(between_pattern, comparison_pattern, correct_sql)
    if user_sql == correct_converted:
        return True
    
    return False

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
    total_stages = QuizStage.objects.count()
    return render(request, 'sqlquiz/quiz_play.html', {
        'stage': stage,
        'total_stages': total_stages
    })

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
        
        # 改良されたSQL同等性チェック
        is_correct = check_sql_equivalence(user_sql, stage)
        
        return JsonResponse({
            'correct': is_correct,
            'correct_sql': stage.correct_sql if not is_correct else None,
            'hint': stage.hint if not is_correct else None
        })
    
    return JsonResponse({'error': 'Invalid request'}, status=400)

def get_stage_info(request):
    """ステージ情報を取得するAPI"""
    stages = QuizStage.objects.all().order_by('stage_number')
    stage_info = {
        'total_stages': stages.count(),
        'available_stages': [stage.stage_number for stage in stages]
    }
    return JsonResponse(stage_info)
# sqlquiz/urls.py