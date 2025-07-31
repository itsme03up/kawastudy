# chatlesson/views.py
import os
import openai
from django.http import JsonResponse
from django.shortcuts import render
import json
from .utils import kawada_prompt

# Copilotにお願い：POSTで送られてきたメッセージに対して
# ChatGPT APIを呼び出し、川田語で返信する関数を実装して。
# 入力はJSON形式 {"message": "..."}、出力は {"reply": "..."} の形にして。
# 川田語プロンプトは外部モジュール kawada_prompt.py から読み込む。

# 注意：実際に使用する際は、APIキーを環境変数などに設定してください。
# openai.api_key = os.environ.get("OPENAI_API_KEY")
# ダミーのAPIキーを設定（動作確認用）
openai.api_key = "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"


def get_kawada_reply(user_message):
    """
    ユーザーのメッセージを川田語で返す
    """
    system_prompt = kawada_prompt.get_system_prompt()

    # ダミーモード：APIキーがない場合は、固定の応答を返す
    if openai.api_key == "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx":
        if "おはよう" in user_message:
            return kawada_prompt.get_dry_reaction("greetings")
        elif "ありがとう" in user_message:
            return kawada_prompt.get_dry_reaction("acknowledgements")
        else:
            return "ふむ、なるほどな。それで、君は何がしたいんだ？"

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ]
        )
        return response.choices[0].message["content"]
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

    return JsonResponse({'error': 'Invalid request method'}, status=405)


def chat(request):
    return render(request, 'chatlesson/chat.html')
