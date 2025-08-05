from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
from datetime import datetime, timedelta
import json
import random

from .models import Schedule, Message, UserStats, StudySession
from .forms import ScheduleForm
from .utils.kawada_scheduler_utils import KawadaSchedulerManager


@login_required
def scheduler_dashboard(request):
    """スケジューラーダッシュボード"""
    user = request.user
    stats, _ = UserStats.objects.get_or_create(user=user)
    
    upcoming_schedules = Schedule.objects.filter(
        user=user, 
        start_time__gte=timezone.now()
    ).order_by('start_time')[:5]
    
    recent_messages = Message.objects.filter(user=user).order_by('-sent_at')[:5]
    
    manager = KawadaSchedulerManager(user)
    daily_message = manager.get_daily_motivational_message()

    context = {
        'stats': stats,
        'upcoming_schedules': upcoming_schedules,
        'recent_messages': recent_messages,
        'daily_message': daily_message,
    }
    
    return render(request, 'scheduler/dashboard.html', context)


@login_required
def create_schedule(request):
    """新しいスケジュールを作成"""
    if request.method == 'POST':
        form = ScheduleForm(request.POST)
        if form.is_valid():
            schedule = form.save(commit=False)
            schedule.user = request.user
            schedule.save()
            
            manager = KawadaSchedulerManager(request.user)
            manager.create_schedule_confirmation_message(schedule)
            
            messages.success(request, '新しい学習計画を立てました！川田からメッセージが届いています。')
            return redirect('scheduler:dashboard')
    else:
        form = ScheduleForm()
        
    return render(request, 'scheduler/create_schedule.html', {'form': form})


@login_required
def kawada_messages(request):
    """川田からのメッセージ一覧"""
    messages_list = Message.objects.filter(user=request.user)
    
    # フィルタリング
    filter_type = request.GET.get('filter', 'all')
    if filter_type == 'unread':
        messages_list = messages_list.filter(is_read=False)
    elif filter_type in ['encouragement', 'invitation', 'congratulations', 'reminder', 'welcome_back']:
        messages_list = messages_list.filter(message_type=filter_type)
    
    context = {'messages': messages_list}
    return render(request, 'scheduler/messages.html', context)


@login_required
def mark_message_read(request, message_id):
    """メッセージを既読にする"""
    message = get_object_or_404(Message, id=message_id, user=request.user)
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
            completed_at=timezone.now()
        )
        
        # ユーザー統計を更新
        stats, created = UserStats.objects.get_or_create(user=request.user)
        stats.completed_sessions += 1
        stats.total_hours += (session.duration_minutes / 60)
        stats.update_streak()
        stats.save()
        
        return JsonResponse({'status': 'success', 'message': '学習セッションを記録しました。'})
    
    return JsonResponse({'status': 'error', 'message': '無効なリクエストです。'}, status=400)


@login_required
def get_unread_messages(request):
    """未読メッセージを取得"""
    messages_list = Message.objects.filter(user=request.user, is_read=False)
    
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
    stats, created = UserStats.objects.get_or_create(user=request.user)
    
    return JsonResponse({
        'total_study_days': stats.total_study_days,
        'current_streak': stats.current_streak,
        'days_since_last_study': stats.get_days_since_last_study(),
        'total_sessions': stats.total_sessions,
        'total_minutes': stats.total_minutes,
        'favorite_app': stats.favorite_app,
    })
