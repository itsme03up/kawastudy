# typinggame/views.py
from django.shortcuts import render
import json

def index(request):
    # For simplicity, questions are hardcoded here.
    # In a real application, you would fetch these from a database.
  questions_data = [
    {'id': 1, 'japanese': 'エビ好きに悪人はいねえ', 'romaji': 'ebizukiniakuninhainee'},
    {'id': 2, 'japanese': 'エンタープライズ発進', 'romaji': 'entapuraizuhasshin'},
    {'id': 3, 'japanese': '俺がガンダムだ', 'romaji': 'oregagandamuda'},
    {'id': 4, 'japanese': 'これがシュタインズゲートの選択だよ', 'romaji': 'koregasyutainzgeetonosentakudayo'},
    {'id': 5, 'japanese': '知っているのか雷電', 'romaji': 'shitteirunokaraiden'},
    {'id': 6, 'japanese': 'こいつ動くぞ', 'romaji': 'koitsuugokuzo'},
    {'id': 7, 'japanese': 'ご照覧あれい', 'romaji': 'goshouranarei'},
    {'id': 8, 'japanese': 'お前が本当の橋になれ', 'romaji': 'omaegahontounohashininare'},
    {'id': 9, 'japanese': '誉れは浜で死にました', 'romaji': 'homorewahamadeshinimashita'},
    {'id': 10, 'japanese': '私は見たぞ', 'romaji': 'watashiwomitazo'}
]
    
    first_question = questions_data[0] if questions_data else None

    context = {
        'questions_json': json.dumps(questions_data),
        'initial_question_json': json.dumps(first_question),
        'question': first_question, # For initial display
    }
    return render(request, 'typinggame/index.html', context)
