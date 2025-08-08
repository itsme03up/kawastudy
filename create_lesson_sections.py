#!/usr/bin/env python
import os
import sys
import django

# Django設定
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kawastudy.settings')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
django.setup()

from apps.cstudy.models import CLessonSection
from django.db import models

# Pylintのエラーを回避するために、objectsマネージャーを明示的に追加
if not hasattr(CLessonSection, 'objects'):
    CLessonSection.objects = models.Manager()

def create_lesson_sections():
    """パララックス学習用のサンプルセクションを作成"""
    
    # 既存のセクションをクリア
    CLessonSection.objects.all().delete()
    
    sections_data = [
        {
            'order': 1,
            'position': 100,
            'side': 'right',
            'type': 'text',
            'content': 'C言語の世界へようこそ\nスクロールしながら川田と一緒に学習の旅を始めましょう！\n川田がやさしくガイドします。',
            'kawada_emotion': 'cheerful'
        },
        {
            'order': 2,
            'position': 600,
            'side': 'left', 
            'type': 'explanation',
            'content': '基本概念\nC言語は1972年に開発されたプログラミング言語です。\nシステムプログラミングの基盤となる重要な言語です。',
            'kawada_emotion': 'thinking'
        },
        {
            'order': 3,
            'position': 1100,
            'side': 'right',
            'type': 'code',
            'content': 'Hello World\nプログラミングの第一歩！\nまずは定番の「Hello World」から始めてみましょう。',
            'kawada_emotion': 'smile'
        },
        {
            'order': 4,
            'position': 1600,
            'side': 'left',
            'type': 'explanation',
            'content': '変数と型\nデータを格納する変数の概念を学び、\nint、float、charなどの基本型を理解しましょう。',
            'kawada_emotion': 'default'
        },
        {
            'order': 5,
            'position': 2100,
            'side': 'right',
            'type': 'code',
            'content': '配列の基礎\n複数のデータをまとめて扱う配列について学びます。\nint numbers[5] = {1, 2, 3, 4, 5};',
            'kawada_emotion': 'thinking'
        },
        {
            'order': 6,
            'position': 2600,
            'side': 'left',
            'type': 'explanation',
            'content': '条件分岐\nif文を使ってプログラムの流れを制御しましょう。\n条件によって異なる処理を実行できます。',
            'kawada_emotion': 'gentle'
        },
        {
            'order': 7,
            'position': 3100,
            'side': 'right',
            'type': 'code',
            'content': 'ループ処理\nfor文やwhile文を使った繰り返し処理を学びます。\n効率的なプログラムを書けるようになります。',
            'kawada_emotion': 'cheerful'
        },
        {
            'order': 8,
            'position': 3600,
            'side': 'left',
            'type': 'explanation',
            'content': '関数の作成\n機能をまとめて再利用可能な関数を作成しましょう。\nコードの構造化と保守性が向上します。',
            'kawada_emotion': 'smile'
        },
        {
            'order': 9,
            'position': 4100,
            'side': 'right',
            'type': 'warning',
            'content': 'ポインタの基礎\nC言語の重要な概念であるポインタについて学びます。\nメモリアドレスを直接操作する強力な機能です。',
            'kawada_emotion': 'thinking'
        },
        {
            'order': 10,
            'position': 4600,
            'side': 'left',
            'type': 'text',
            'content': '学習完了！\nお疲れさまでした！\n川田と一緒にC言語の基礎を学びました。',
            'kawada_emotion': 'cheerful'
        },
        {
            'order': 11,
            'position': 5100,
            'side': 'right',
            'type': 'text',
            'content': '次のステップ\n実際のコーディングに挑戦してみましょう！\n川田がサポートします。',
            'kawada_emotion': 'default'
        },
        {
            'order': 12,
            'position': 5600,
            'side': 'left',
            'type': 'explanation',
            'content': '継続学習\nプログラミングは継続が重要です。\n毎日少しずつでも続けてみましょう！',
            'kawada_emotion': 'gentle'
        }
    ]
    
    created_count = 0
    for data in sections_data:
        section = CLessonSection.objects.create(**data)
        created_count += 1
        print(f"作成: {section}")
    
    print(f"\n{created_count}個のレッスンセクションを作成しました！")
    print("データベースの準備が完了しました。")

if __name__ == '__main__':
    create_lesson_sections()
