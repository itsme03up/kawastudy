# views.py
from django.shortcuts import render
from django.http import JsonResponse
import subprocess, tempfile, os

def index(request):
    return render(request, "cstudy/index.html")

def run_code(request):
    payload = json.loads(request.body)
    code = payload.get('source', '')
    # 一時ファイルに保存
    with tempfile.NamedTemporaryFile(suffix='.c', delete=False) as src:
        src.write(code.encode('utf-8'))
        src_path = src.name
    exe_path = src_path.replace('.c','')
    # コンパイル
    compile = subprocess.run(['gcc', src_path, '-o', exe_path], capture_output=True, text=True)
    if compile.returncode != 0:
        os.remove(src_path)
        return JsonResponse({'stderr': compile.stderr}, status=200)
    # 実行
    run = subprocess.run([exe_path], capture_output=True, text=True, timeout=5)
    # 後片付け
    os.remove(src_path); os.remove(exe_path)
    return JsonResponse({'stdout': run.stdout, 'stderr': run.stderr})

