from django.utils import timezone
from datetime import datetime, timedelta
import random
from ..models import StudySession, KawadaMessage, UserStudyStats


class KawadaSchedulerManager:
    """川田スケジューラー管理クラス"""
    
    def __init__(self, user):
        self.user = user
        self.stats, _ = UserStudyStats.objects.get_or_create(user=user)
    
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
        app_names = {
            'cstudy': 'C言語学習',
            'sqlquiz': 'SQLクイズ',
            'chatlesson': 'ChatLesson',
            'linuxfun': 'Linux Fun',
            'aws': 'AWS学習',
            'typinggame': 'タイピングゲーム',
        }
        
        app_display = app_names.get(schedule.app_name, schedule.app_name)
        date_str = schedule.scheduled_date.strftime('%m月%d日 %H:%M')
        
        expressions = ['cheerful', 'smile', 'normal']
        
        KawadaMessage.objects.create(
            user=self.user,
            message_type='invitation',
            title=f'� {date_str}の学習予定',
            content=f'{date_str}に{app_display}の学習予定が入りました！計画的な学習で着実に成長していきましょう。準備してお待ちしています！',
            kawada_expression=random.choice(expressions)
        )
    
    def check_and_create_messages(self):
        """学習状況に応じてメッセージを作成"""
        # 連続学習のお祝いメッセージ
        if self.stats.current_streak > 0:
            self._create_streak_message()
        
        # 特定の成果に対するメッセージ
        self._create_achievement_messages()
    
    def _create_streak_message(self):
        """連続学習日数に応じたメッセージ"""
        streak = self.stats.current_streak
        
        # 重複メッセージを避けるため、今日既にストリークメッセージがあるかチェック
        today = timezone.now().date()
        existing_message = KawadaMessage.objects.filter(
            user=self.user,
            message_type='encouragement',
            created_at__date=today
        ).exists()
        
        if existing_message:
            return
        
        if streak == 3:
            KawadaMessage.objects.create(
                user=self.user,
                message_type='encouragement',
                title='3日連続達成！🔥',
                content='3日連続でお疲れさまです！習慣化の第一歩ですね。川田もとても嬉しいです💕',
                kawada_expression='cheerful'
            )
        elif streak == 7:
            KawadaMessage.objects.create(
                user=self.user,
                message_type='encouragement',
                title='1週間連続達成！✨',
                content='1週間毎日続けるなんて素晴らしい！川田、感動しちゃいました😭 ご褒美に特別な問題を用意しますね！',
                kawada_expression='smile'
            )
        elif streak == 14:
            KawadaMessage.objects.create(
                user=self.user,
                message_type='congratulations',
                title='2週間連続！すごすぎます！🎉',
                content='2週間毎日って...本当にすごいです！川田も見習わないと💪 あなたの努力、尊敬しちゃいます！',
                kawada_expression='cheerful'
            )
        elif streak == 30:
            KawadaMessage.objects.create(
                user=self.user,
                message_type='congratulations',
                title='1ヶ月連続達成！伝説級です！👑',
                content='1ヶ月毎日...もう言葉になりません！あなたは川田の自慢の生徒さんです💕 お祝いに特別なサプライズを考えますね！',
                kawada_expression='smile'
            )
    
    def _create_achievement_messages(self):
        """特定の成果に応じたメッセージ"""
        # セッション数に応じたメッセージ
        if self.stats.total_sessions == 10:
            KawadaMessage.objects.create(
                user=self.user,
                message_type='congratulations',
                title='学習セッション10回達成！🎯',
                content='学習セッション10回突破です！継続は力なり、を体現していますね。川田も応援し続けます！',
                kawada_expression='normal'
            )
        elif self.stats.total_sessions == 50:
            KawadaMessage.objects.create(
                user=self.user,
                message_type='congratulations',
                title='学習セッション50回達成！🌟',
                content='50回のセッション...すごい積み重ねです！あなたの学習への情熱、川田はずっと見ていました💕',
                kawada_expression='cheerful'
            )
    
    def create_reminder_message(self, schedule):
        """リマインダーメッセージを作成"""
        app_names = {
            'cstudy': 'C言語学習',
            'sqlquiz': 'SQLクイズ',
            'chatlesson': 'ChatLesson',
            'linuxfun': 'Linux Fun',
            'aws': 'AWS学習',
            'typinggame': 'タイピングゲーム',
        }
        
        app_display = app_names.get(schedule.app_name, schedule.app_name)
        time_str = schedule.scheduled_date.strftime('%H:%M')
        
        reminder_messages = [
            f'⏰ {time_str}からの{app_display}のお時間です！川田も準備万端です💕',
            f'📚 そろそろ{app_display}の時間ですね！一緒に頑張りましょう！',
            f'💪 {time_str}のお勉強の時間です！川田と一緒にレベルアップしませんか？',
        ]
        
        KawadaMessage.objects.create(
            user=self.user,
            message_type='reminder',
            title=f'📍 {app_display}のリマインダー',
            content=random.choice(reminder_messages),
            kawada_expression='normal'
        )
        
        # リマインダー送信済みにマーク
        schedule.reminder_sent = True
        schedule.save()
    
    def get_weekly_study_pattern(self):
        """週間学習パターンを分析"""
        today = timezone.now().date()
        week_start = today - timedelta(days=today.weekday())
        
        sessions = StudySession.objects.filter(
            user=self.user,
            created_at__date__range=[week_start, today]
        )
        
        # 曜日別セッション数を計算
        weekday_sessions = {}
        for session in sessions:
            weekday = session.created_at.weekday()
            weekday_sessions[weekday] = weekday_sessions.get(weekday, 0) + 1
        
        return weekday_sessions
    
    def suggest_optimal_schedule(self):
        """最適なスケジュールを提案"""
        pattern = self.get_weekly_study_pattern()
        
        # 最も活発な曜日を特定
        if pattern:
            best_day = max(pattern, key=pattern.get)
            weekdays = ['月', '火', '水', '木', '金', '土', '日']
            return f"{weekdays[best_day]}曜日"
        
        return "平日の夕方"
