# chatlesson/views.py
import os
from openai import OpenAI
from django.http import JsonResponse
from django.shortcuts import render
import json
from .utils import kawada_prompt

# Copilotにお願い：POSTで送られてきたメッセージに対して
# ChatGPT APIを呼び出し、川田語で返信する関数を実装して。
# 入力はJSON形式 {"message": "..."}、出力は {"reply": "..."} の形にして。
# 川田語プロンプトは外部モジュール kawada_prompt.py から読み込む。

# OpenAI クライアントを初期化
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
debug_mode = os.getenv("DEBUG", "False")

# APIキーの確認用（デバッグ）
api_key = os.environ.get("OPENAI_API_KEY")
if api_key:
    print("API Key:", api_key[:8] + "*****")
else:
    print("API Key: Not set")


def get_kawada_reply(user_message):
    """
    ユーザーのメッセージを川田語で返す
    """
    system_prompt = kawada_prompt.get_system_prompt()

    # APIキーが設定されていない場合は、固定の応答を返す
    if not os.environ.get("OPENAI_API_KEY"):
        return "APIキーが設定されていないようですね。"

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        # エラーが発生した場合は、ドライな反応を返す
        print(f"Error: {e}")
        return kawada_prompt.get_dry_reaction("uncertainty")


def chat_api(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_message = data.get('message')

            if not user_message:
                return JsonResponse({'error': 'Message not provided'}, status=400)

            reply = get_kawada_reply(user_message)
            return JsonResponse({'reply': reply})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            print(f"Unexpected error in chat_api: {e}")
            return JsonResponse({'error': f'サーバーエラーが発生しました: {str(e)}'}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


def chat(request):
    return render(request, 'chatlesson/chat.html', {"hide_sidebar": True})
