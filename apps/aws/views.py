from django.shortcuts import render

# AWSコラム一覧ページ
def column_list(request):
    # 仮のコラムデータ
    columns = [
        {"id": 1, "title": "AWSとは？", "summary": "AWSの概要と特徴を解説します。"},
        {"id": 2, "title": "EC2の基礎", "summary": "仮想サーバーEC2の使い方とポイント。"},
    ]
    return render(request, "aws/column_list.html", {"columns": columns})

# AWSクイズ一覧ページ
def quiz_list(request):
    # 仮のクイズデータ
    quizzes = [
        {"id": 1, "question": "AWSの正式名称は？", "choices": ["Amazon Web Service", "Amazon Web Services", "Advanced Web Service", "Amazon Wide Service"], "answer": 1},
        {"id": 2, "question": "EC2は何の略？", "choices": ["Elastic Compute Cloud", "Easy Cloud", "Enterprise Cloud", "Elastic Cloud Compute"], "answer": 0},
    ]
    return render(request, "aws/quiz_list.html", {"quizzes": quizzes})

def index(request):
    return render(request, "aws/index.html")
