from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from apps.scheduler.models import StudySchedule
from apps.scheduler.utils.kawada_scheduler_utils import KawadaSchedulerManager


class Command(BaseCommand):
    help = '川田からのリマインダーメッセージを送信'

    def add_arguments(self, parser):
        parser.add_argument(
            '--minutes-before',
            type=int,
            default=30,
            help='何分前にリマインダーを送信するか（デフォルト: 30分）'
        )

    def handle(self, *args, **options):
        minutes_before = options['minutes_before']
        now = timezone.now()
        remind_time = now + timedelta(minutes=minutes_before)
        
        # リマインダー送信対象のスケジュールを取得
        schedules = StudySchedule.objects.filter(
            scheduled_date__lte=remind_time,
            scheduled_date__gt=now,
            reminder_sent=False,
            completed=False
        )
        
        sent_count = 0
        
        for schedule in schedules:
            try:
                kawada_manager = KawadaSchedulerManager(schedule.user)
                kawada_manager.create_reminder_message(schedule)
                sent_count += 1
                
                self.stdout.write(
                    self.style.SUCCESS(
                        f'リマインダー送信: {schedule.user.username} - {schedule.title}'
                    )
                )
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(
                        f'リマインダー送信失敗: {schedule.user.username} - {str(e)}'
                    )
                )
        
        self.stdout.write(
            self.style.SUCCESS(f'合計 {sent_count} 件のリマインダーを送信しました')
        )
