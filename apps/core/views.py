# core/views.py
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .forms import ProfileForm

def home(request):
    return render(request, 'core/home.html')

@login_required
def profile_edit(request):
    if request.method == 'POST':
        form = ProfileForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, 'プロフィールが更新されました。')
            return redirect('profile_edit')
    else:
        form = ProfileForm(instance=request.user)
    
    return render(request, 'core/profile_edit.html', {'form': form})
