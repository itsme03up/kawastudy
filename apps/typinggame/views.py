# typinggame/views.py
from django.shortcuts import render
import json

def index(request):
    # For simplicity, questions are hardcoded here.
    # In a real application, you would fetch these from a database.
    questions_data = [
        {'id': 1, 'japanese': 'こんにちは', 'romaji': 'konnnitiha'},
        {'id': 2, 'japanese': 'ありがとう', 'romaji': 'arigatou'},
        {'id': 3, 'japanese': 'さようなら', 'romaji': 'sayounara'},
        {'id': 4, 'japanese': 'はじめまして', 'romaji': 'hazimemasite'},
        {'id': 5, 'japanese': 'よろしくおねがいします', 'romaji': 'yorosikuonegaisimasu'},
        {'id': 6, 'japanese': 'すみません', 'romaji': 'sumimasen'},
        {'id': 7, 'japanese': 'ごめんなさい', 'romaji': 'gomennasai'},
        {'id': 8, 'japanese': 'おはようございます', 'romaji': 'ohayougozaimasu'},
        {'id': 9, 'japanese': 'こんばんは', 'romaji': 'konnbannha'},
        {'id': 10, 'japanese': 'おやすみなさい', 'romaji': 'oyasuminasai'},
    ]
    
    first_question = questions_data[0] if questions_data else None

    context = {
        'questions_json': json.dumps(questions_data),
        'initial_question_json': json.dumps(first_question),
        'question': first_question, # For initial display
    }
    return render(request, 'typinggame/index.html', context)
