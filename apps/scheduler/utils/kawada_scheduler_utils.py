from django.utils import timezone
from datetime import datetime, timedelta
import random
from ..models import StudySession, Message, UserStats


class KawadaSchedulerManager:
    """川田スケジューラー管理クラス"""
    
    def __init__(self, user):
        self.user = user
        self.stats, _ = UserStats.objects.get_or_create(user=user)
    
    def generate_invitation_message(self):
        """学習頻度に応じたお誘いメッセージを生成"""
        days_since_last = self.stats.get_days_since_last_study()
        
        if days_since_last is None:
            # 初回ユーザー
            return {
                'title': '川田からのお誘い💕',
                'content': '一緒に勉強カフェで学習デートしませんか？今週末、SQLクイズで腕試しなんていかがでしょう？',
                'expression': 'cheerful',
                'suggestion': 'sqlquiz'
            }
        elif days_since_last == 0:
            # 今日も学習している
            return {
                'title': '川田からの特別なお誘い✨',
                'content': '今日も頑張っていますね！川田、とってもうれしいです💕 明日は一緒にC言語の新しい章に挑戦しませんか？',
                'expression': 'smile',
                'suggestion': 'cstudy'
            }
        elif days_since_last == 1:
            # 昨日学習していた
            return {
                'title': '川田からの今日のお誘い📚',
                'content': '昨日もお疲れさまでした！今日も一緒に学習しませんか？Linuxコマンドでサーバーデートはいかがでしょう？',
                'expression': 'normal',
                'suggestion': 'linuxfun'
            }
        elif days_since_last <= 3:
            # 2-3日空いている
            return {
                'title': '川田からの久しぶりのお誘い💙',
                'content': f'{days_since_last}日ぶりですね。ちょっと寂しかったです...今度はいつお時間ありますか？AWSの勉強会でもいかがでしょう？',
                'expression': 'gentle',
                'suggestion': 'aws'
            }
        elif days_since_last <= 7:
            # 4-7日空いている
            return {
                'title': '川田からの復習提案🌸',
                'content': '1週間ぶりくらいでしょうか？少し間が空きましたが、タイピングゲームで基礎から復習してみませんか？',
                'expression': 'thinking',
                'suggestion': 'typinggame'
            }
        else:
            # 長期間空いている
            return {
                'title': '川田からの学習再開提案�',
                'content': 'お久しぶりです。お忙しかったのでしょうか？無理をしなくても大丈夫です。お時間のある時に、軽いChatLessonから始めませんか？',
                'expression': 'gentle',
                'suggestion': 'chatlesson'
            }
    
    def create_schedule_confirmation_message(self, schedule):
        """スケジュール作成の確認メッセージ"""
        date_str = schedule.start_time.strftime('%m月%d日 %H:%M')
        
        Message.objects.create(
            user=self.user,
            message_type='invitation',
            content=f'{date_str}からの「{schedule.title}」の学習計画、受け取りました。楽しみにしています！'
        )

    def send_reminders(self):
        """リマインダーを送信"""
        now = timezone.now()
        upcoming_schedules = self.user.schedules.filter(
            start_time__gt=now,
            start_time__lte=now + timedelta(hours=1),
            is_completed=False
        )
        for schedule in upcoming_schedules:
            Message.objects.get_or_create(
                user=self.user,
                message_type='reminder',
                defaults={'content': f'まもなく「{schedule.title}」の学習時間です。準備はいいですか？'}
            )

    def check_and_create_welcome_back_message(self):
        """長期間学習していないユーザーに復帰を促すメッセージを送信"""
        if self.stats.last_study_date:
            days_since_last_study = (timezone.now().date() - self.stats.last_study_date).days
            if days_since_last_study >= 7:
                 # 7日以上学習がない場合にメッセージを送信
                Message.objects.get_or_create(
                    user=self.user,
                    message_type='welcome_back',
                    defaults={'content': 'お久しぶりです。また一緒に学習しませんか？'}
                )

    def check_and_create_congratulations_message(self):
        """継続日数などに応じたお祝いメッセージを送信"""
        streak = self.stats.current_streak
        if streak > 0 and streak % 5 == 0: # 5日継続ごとにお祝い
            Message.objects.get_or_create(
                user=self.user,
                message_type='congratulations',
                defaults={'content': f'{streak}日間も学習が続いていて素晴らしいです！この調子で頑張りましょう！'}
            )
