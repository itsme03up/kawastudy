from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from apps.scheduler.models import UserStudyStats, StudySession
from apps.scheduler.utils.kawada_scheduler_utils import KawadaSchedulerManager
from django.utils import timezone
from datetime import timedelta


class Command(BaseCommand):
    help = '川田からの定期メッセージを送信（日次実行）'

    def handle(self, *args, **options):
        users = User.objects.filter(is_active=True)
        message_count = 0
        
        for user in users:
            try:
                stats, created = UserStudyStats.objects.get_or_create(user=user)
                kawada_manager = KawadaSchedulerManager(user)
                
                # 最後の学習からの経過日数をチェック
                days_since_last = stats.get_days_since_last_study()
                
                if days_since_last is not None:
                    # 学習が途切れた場合の励ましメッセージ
                    if days_since_last == 2:
                        kawada_manager._create_comeback_message(2)
                        message_count += 1
                    elif days_since_last == 7:
                        kawada_manager._create_comeback_message(7)
                        message_count += 1
                    elif days_since_last == 30:
                        kawada_manager._create_comeback_message(30)
                        message_count += 1
                
                # 特別な記念日メッセージ
                if stats.current_streak > 0:
                    self._check_special_milestones(user, stats, kawada_manager)
                
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'ユーザー {user.username} の処理に失敗: {str(e)}')
                )
        
        self.stdout.write(
            self.style.SUCCESS(f'合計 {message_count} 件のメッセージを送信しました')
        )
    
    def _check_special_milestones(self, user, stats, kawada_manager):
        """特別なマイルストーンをチェック"""
        today = timezone.now().date()
        
        # アカウント作成からの日数
        if user.date_joined.date() == today.replace(day=today.day):
            # 月間記念日
            months = (today.year - user.date_joined.date().year) * 12 + (today.month - user.date_joined.date().month)
            if months > 0:
                kawada_manager._create_anniversary_message(months)


# KawadaSchedulerManagerに追加メソッドを定義（実際の実装では utils ファイルに追加）
class ExtendedKawadaSchedulerManager(KawadaSchedulerManager):
    
    def _create_comeback_message(self, days):
        """復帰を促すメッセージ"""
        from apps.scheduler.models import KawadaMessage
        
        messages = {
            2: {
                'title': '川田からの心配のメッセージ💙',
                'content': '2日間お疲れ様でした。少し休憩も大切ですが、川田は待っていますよ😊 無理をしない程度に、また一緒に学習しませんか？',
                'expression': 'gentle'
            },
            7: {
                'title': '川田からの久しぶりのメッセージ🌸',
                'content': '1週間お疲れ様でした！きっと忙しかったんですね。川田はいつでも待っています💕 今度の空いた時間に、軽い復習からはじめませんか？',
                'expression': 'thinking'
            },
            30: {
                'title': '川田からの再会のメッセージ💌',
                'content': '1ヶ月ぶりですね...元気にしていましたか？川田はずっと待っていました。あなたのペースで大丈夫です。また一緒に学習できる日を楽しみにしています💕',
                'expression': 'gentle'
            }
        }
        
        message_data = messages.get(days)
        if message_data:
            KawadaMessage.objects.create(
                user=self.user,
                message_type='welcome_back',
                title=message_data['title'],
                content=message_data['content'],
                kawada_expression=message_data['expression']
            )
    
    def _create_anniversary_message(self, months):
        """記念日メッセージ"""
        from apps.scheduler.models import KawadaMessage
        
        KawadaMessage.objects.create(
            user=self.user,
            message_type='congratulations',
            title=f'🎉 {months}ヶ月記念日おめでとう！',
            content=f'KawaStudyを始めて{months}ヶ月ですね！継続は力なり、あなたの成長を川田はずっと見守っています💕 これからもよろしくお願いします！',
            kawada_expression='cheerful'
        )
