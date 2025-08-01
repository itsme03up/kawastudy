# chatlesson/views.py
import os
import uuid
from openai import OpenAI
from django.http import JsonResponse
from django.shortcuts import render
import json
from .utils import kawada_prompt
from .models import ChatSession, ChatMessage

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


def get_kawada_reply(user_message, mode="dry"):
    """
    ユーザーのメッセージを川田語で返す
    mode: "dry", "cheerful", "gentle" のいずれか
    """
    system_prompt = kawada_prompt.get_system_prompt(mode=mode)

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
        # エラーが発生した場合は、川田語でフォールバック応答を返す
        print(f"OpenAI API Error: {e}")
        
        # APIクォータエラーの場合
        if "insufficient_quota" in str(e) or "quota" in str(e).lower():
            return "川田、APIの使用量が限界に達してしまいました。申し訳ございません。少し時間を置いてから再度お試しください。"
        
        # その他のエラーの場合
        fallback_responses = [
            "少し調子が悪いようですね。後でまた試してみてください。",
            "川田、今回は上手く答えられませんでした。申し訳ありません。",
            "システムに問題があるようですね。川田、確認してみます。"
        ]
        import random
        return random.choice(fallback_responses)


def get_or_create_session(request):
    """
    チャットセッションを取得または新規作成する
    """
    # セッションIDをブラウザセッションから取得
    session_id = request.session.get('chat_session_id')
    
    if session_id:
        try:
            chat_session = ChatSession.objects.get(session_id=session_id)
            return chat_session
        except ChatSession.DoesNotExist:
            pass
    
    # 新しいセッションを作成
    session_id = str(uuid.uuid4())
    chat_session = ChatSession.objects.create(
        user=request.user if request.user.is_authenticated else None,
        session_id=session_id
    )
    
    # ブラウザセッションに保存
    request.session['chat_session_id'] = session_id
    
    return chat_session

def save_message(session, sender, message):
    """
    メッセージをデータベースに保存する
    """
    return ChatMessage.objects.create(
        session=session,
        sender=sender,
        message=message
    )


def chat_api(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_message = data.get('message')
            character_id = data.get('character', 'kawada')  # デフォルトは通常の川田

            if not user_message:
                return JsonResponse({'error': 'Message not provided'}, status=400)

            # チャットセッションを取得または作成
            chat_session = get_or_create_session(request)
            
            # ユーザーメッセージを保存
            save_message(chat_session, 'user', user_message)
            
            # キャラクターIDからモードを決定
            mode_mapping = {
                'kawada': 'dry',
                'kawada-normal': 'dry',
                'kawada-cheerful': 'cheerful',
                'kawada-gentle': 'gentle',
                'kawada-thinking': 'dry'  # 考え中も基本はドライモード
            }
            
            mode = mode_mapping.get(character_id, 'dry')
            
            # 川田の返答を取得（選択されたモードで）
            reply = get_kawada_reply(user_message, mode=mode)
            
            # 川田の返答を保存
            save_message(chat_session, 'kawada', reply)
            
            # セッションのタイトルを自動生成（最初のメッセージから）
            if not chat_session.title and user_message:
                title = user_message[:30] + "..." if len(user_message) > 30 else user_message
                chat_session.title = title
                chat_session.save()
            
            return JsonResponse({'reply': reply})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            print(f"Unexpected error in chat_api: {e}")
            return JsonResponse({'error': f'サーバーエラーが発生しました: {str(e)}'}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


def chat(request):
    # 現在のセッションの会話履歴を取得
    chat_session = get_or_create_session(request)
    messages = chat_session.messages.all()
    
    context = {
        "hide_sidebar": True,
        "chat_messages": messages,
        "session_id": chat_session.session_id
    }
    return render(request, 'chatlesson/chat.html', context)

def get_chat_history(request):
    """
    チャット履歴をJSON形式で返すAPI
    """
    if request.method == 'GET':
        try:
            session_id = request.GET.get('session_id') or request.session.get('chat_session_id')
            
            if not session_id:
                return JsonResponse({'messages': []})
                
            chat_session = ChatSession.objects.get(session_id=session_id)
            messages = chat_session.messages.all()
            
            message_data = []
            for msg in messages:
                message_data.append({
                    'sender': msg.sender,
                    'message': msg.message,
                    'timestamp': msg.timestamp.isoformat()
                })
            
            return JsonResponse({'messages': message_data})
        except ChatSession.DoesNotExist:
            return JsonResponse({'messages': []})
        except Exception as e:
            print(f"Error in get_chat_history: {e}")
            return JsonResponse({'error': 'Failed to load chat history'}, status=500)
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)
