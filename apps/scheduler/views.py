from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
from datetime import datetime, timedelta
import json
import random

from .models import StudySession, StudySchedule, KawadaMessage, UserStudyStats
from .utils.kawada_scheduler_utils import KawadaSchedulerManager


@login_required
def scheduler_dashboard(request):
    """スケジューラーダッシュボード"""
    user = request.user
    
    # ユーザー統計を取得または作成
    stats, created = UserStudyStats.objects.get_or_create(user=user)
    
    # 今週のスケジュール
    today = timezone.now().date()
    week_start = today - timedelta(days=today.weekday())
    week_end = week_start + timedelta(days=6)
    
    weekly_schedules = StudySchedule.objects.filter(
        user=user,
        scheduled_date__date__range=[week_start, week_end]
    ).order_by('scheduled_date')
    
    # 未読メッセージ
    unread_messages = KawadaMessage.objects.filter(user=user, is_read=False)[:5]
    
    # 最近の学習セッション
    recent_sessions = StudySession.objects.filter(user=user)[:10]
    
    # 川田からのお誘いメッセージを生成
    kawada_manager = KawadaSchedulerManager(user)
    invitation_message = kawada_manager.generate_invitation_message()
    
    context = {
        'stats': stats,
        'weekly_schedules': weekly_schedules,
        'unread_messages': unread_messages,
        'recent_sessions': recent_sessions,
        'invitation_message': invitation_message,
        'week_dates': [week_start + timedelta(days=i) for i in range(7)],
        'today': today,
    }
    
    return render(request, 'scheduler/dashboard.html', context)


@login_required
def create_schedule(request):
    """新しいスケジュールを作成"""
    if request.method == 'POST':
        title = request.POST.get('title')
        description = request.POST.get('description', '')
        app_name = request.POST.get('app_name')
        scheduled_date = request.POST.get('scheduled_date')
        scheduled_time = request.POST.get('scheduled_time')
        
        # 日時を結合
        datetime_str = f"{scheduled_date} {scheduled_time}"
        scheduled_datetime = datetime.strptime(datetime_str, '%Y-%m-%d %H:%M')
        scheduled_datetime = timezone.make_aware(scheduled_datetime)
        
        # スケジュール作成
        schedule = StudySchedule.objects.create(
            user=request.user,
            title=title,
            description=description,
            app_name=app_name,
            scheduled_date=scheduled_datetime
        )
        
        # 川田からの確認メッセージを作成
        kawada_manager = KawadaSchedulerManager(request.user)
        kawada_manager.create_schedule_confirmation_message(schedule)
        
        messages.success(request, 'スケジュールを作成しました！川田からメッセージが届いています。')
        return redirect('scheduler:dashboard')
    
    # GET: フォームを表示
    apps_choices = [
        ('cstudy', 'C言語学習'),
        ('sqlquiz', 'SQLクイズ'),
        ('chatlesson', 'ChatLesson'),
        ('linuxfun', 'Linux Fun'),
        ('aws', 'AWS学習'),
        ('typinggame', 'タイピングゲーム'),
    ]
    
    context = {'apps_choices': apps_choices}
    return render(request, 'scheduler/create_schedule.html', context)


@login_required
def kawada_messages(request):
    """川田からのメッセージ一覧"""
    messages_list = KawadaMessage.objects.filter(user=request.user)
    
    context = {'messages': messages_list}
    return render(request, 'scheduler/messages.html', context)


@login_required
def mark_message_read(request, message_id):
    """メッセージを既読にする"""
    message = get_object_or_404(KawadaMessage, id=message_id, user=request.user)
    message.is_read = True
    message.save()
    
    return JsonResponse({'status': 'success'})


@csrf_exempt
@login_required
def record_study_session(request):
    """学習セッションを記録"""
    if request.method == 'POST':
        data = json.loads(request.body)
        
        session = StudySession.objects.create(
            user=request.user,
            app_name=data.get('app_name'),
            lesson_name=data.get('lesson_name', ''),
            duration_minutes=data.get('duration_minutes', 0),
            completed=data.get('completed', False)
        )
        
        # 統計を更新
        stats, created = UserStudyStats.objects.get_or_create(user=request.user)
        stats.total_sessions += 1
        stats.total_minutes += session.duration_minutes
        stats.update_streak()
        stats.save()
        
        # 川田からのメッセージを生成
        kawada_manager = KawadaSchedulerManager(request.user)
        kawada_manager.check_and_create_messages()
        
        return JsonResponse({'status': 'success', 'session_id': session.id})
    
    return JsonResponse({'status': 'error'})


@login_required
def get_unread_messages(request):
    """未読メッセージを取得"""
    messages_list = KawadaMessage.objects.filter(user=request.user, is_read=False)
    
    messages_data = []
    for msg in messages_list:
        messages_data.append({
            'id': msg.id,
            'title': msg.title,
            'content': msg.content,
            'message_type': msg.message_type,
            'kawada_expression': msg.kawada_expression,
            'created_at': msg.created_at.isoformat(),
        })
    
    return JsonResponse({'messages': messages_data})


@login_required
def get_user_stats(request):
    """ユーザー統計を取得"""
    stats, created = UserStudyStats.objects.get_or_create(user=request.user)
    
    return JsonResponse({
        'total_study_days': stats.total_study_days,
        'current_streak': stats.current_streak,
        'days_since_last_study': stats.get_days_since_last_study(),
        'total_sessions': stats.total_sessions,
        'total_minutes': stats.total_minutes,
        'favorite_app': stats.favorite_app,
    })
