# views.py
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import CLessonSection, CQuizQuestion
import subprocess, tempfile, os
import json

def index(request):
    """新しいパララックス学習ページ"""
    return render(request, "cstudy/parallax.html")

@api_view(['GET'])
def lesson_data(request):
    """学習セクションデータAPI"""
    sections = CLessonSection.objects.filter(is_active=True)
    data = []
    for section in sections:
        data.append({
            'id': section.id,
            'position': section.position,
            'side': section.side,
            'type': section.type,
            'content': section.content,
            'kawada_emotion': section.kawada_emotion,
            'order': section.order
        })
    return Response(data)

@api_view(['GET'])
def quiz_data(request):
    """Warning問題データAPI"""
    quizzes = CQuizQuestion.objects.filter(is_active=True)
    data = []
    for quiz in quizzes:
        data.append({
            'id': quiz.id,
            'question': quiz.question,
            'options': quiz.options,
            'correct_answer': quiz.correct_answer,
            'explanation': quiz.explanation,
            'kawada_correct_message': quiz.kawada_correct_message,
            'kawada_wrong_message': quiz.kawada_wrong_message,
            'trigger_position': quiz.trigger_position,
            'order': quiz.order
        })
    return Response(data)

@api_view(['POST'])
def submit_quiz_answer(request):
    """Warning問題の回答処理"""
    quiz_id = request.data.get('quiz_id')
    answer = request.data.get('answer')
    
    try:
        quiz = CQuizQuestion.objects.get(id=quiz_id)
        is_correct = answer == quiz.correct_answer
        
        return Response({
            'correct': is_correct,
            'explanation': quiz.explanation,
            'kawada_message': quiz.kawada_correct_message if is_correct else quiz.kawada_wrong_message
        })
    except CQuizQuestion.DoesNotExist:
        return Response({'error': 'Quiz not found'}, status=404)

def run_code(request):
    """C言語コード実行（既存機能維持）"""
    if request.method != 'POST':
        return JsonResponse({'error': 'POST method required'}, status=405)
    
    try:
        payload = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    
    code = payload.get('source', '')
    if not code:
        return JsonResponse({'error': 'No source code provided'}, status=400)
    
    # 一時ファイルに保存
    with tempfile.NamedTemporaryFile(suffix='.c', delete=False) as src:
        src.write(code.encode('utf-8'))
        src_path = src.name
    
    exe_path = src_path.replace('.c','')
    
    try:
        # コンパイル
        compile = subprocess.run(['gcc', src_path, '-o', exe_path], capture_output=True, text=True)
        if compile.returncode != 0:
            os.remove(src_path)
            return JsonResponse({'stderr': compile.stderr}, status=200)
        
        # 実行
        run = subprocess.run([exe_path], capture_output=True, text=True, timeout=5)
        
        # 後片付け
        os.remove(src_path)
        os.remove(exe_path)
        
        return JsonResponse({'stdout': run.stdout, 'stderr': run.stderr})
    
    except subprocess.TimeoutExpired:
        # 後片付け
        if os.path.exists(src_path):
            os.remove(src_path)
        if os.path.exists(exe_path):
            os.remove(exe_path)
        return JsonResponse({'stderr': 'Code execution timed out'}, status=200)
    except Exception as e:
        # 後片付け
        if os.path.exists(src_path):
            os.remove(src_path)
        if os.path.exists(exe_path):
            os.remove(exe_path)
        return JsonResponse({'error': str(e)}, status=500)

