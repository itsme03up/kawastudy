#!/usr/bin/env python3
"""
C言語学習用のサンプルデータを作成するスクリプト
"""

import os
import sys
import json
import django

# Djangoの設定を読み込む
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kawastudy.settings')
django.setup()

from apps.cstudy.models import CLessonSection, CQuizQuestion

def create_sample_data():
    """サンプルの学習データとクイズデータを作成"""
    
    # 既存データの削除
    CLessonSection.objects.all().delete()
    CQuizQuestion.objects.all().delete()
    
    # 学習セクションデータ
    lesson_sections = [
        {
            'position': 200,
            'side': 'left',
            'type': 'text',
            'content': 'C言語へようこそ！川田と一緒に基礎から学んでいきましょう🌟\n\nC言語は多くのプログラミング言語の基礎となる重要な言語です。',
            'kawada_emotion': 'cheerful',
            'order': 1
        },
        {
            'position': 500,
            'side': 'right',
            'type': 'code',
            'content': '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!");\n    return 0;\n}',
            'kawada_emotion': 'default',
            'order': 2
        },
        {
            'position': 800,
            'side': 'left',
            'type': 'text',
            'content': 'これが基本的なC言語プログラムです。\n#include <stdio.h> は標準入出力ライブラリを読み込んでいます。\n\n川田、これとても大事なんです！',
            'kawada_emotion': 'thinking',
            'order': 3
        },
        {
            'position': 1200,
            'side': 'right',
            'type': 'text',
            'content': 'main関数はプログラムの実行開始点です。\nすべてのC言語プログラムにはmain関数が必要なんです。',
            'kawada_emotion': 'gentle',
            'order': 4
        },
        {
            'position': 1600,
            'side': 'left',
            'type': 'code',
            'content': 'int age = 25;\nchar name[] = "Kawada";\nfloat height = 175.5;\n\nprintf("名前: %s\\n", name);\nprintf("年齢: %d歳\\n", age);\nprintf("身長: %.1fcm\\n", height);',
            'kawada_emotion': 'smile',
            'order': 5
        },
        {
            'position': 2000,
            'side': 'right',
            'type': 'text',
            'content': '変数を使ってデータを格納できます。\nint（整数）、char（文字）、float（小数）など様々な型があります。\n\n川田、プログラミングって面白いですね！',
            'kawada_emotion': 'cheerful',
            'order': 6
        },
        {
            'position': 2400,
            'side': 'left',
            'type': 'code',
            'content': 'if (age >= 20) {\n    printf("成人です\\n");\n} else {\n    printf("未成年です\\n");\n}',
            'kawada_emotion': 'thinking',
            'order': 7
        },
        {
            'position': 2800,
            'side': 'right',
            'type': 'text',
            'content': 'if文を使って条件分岐ができます。\n条件が真（true）の場合は{}内の処理が実行されます。\n\n川田、ちょっと恥ずかしいですが、これ大事なんです……',
            'kawada_emotion': 'gentle',
            'order': 8
        },
        {
            'position': 3200,
            'side': 'left',
            'type': 'code',
            'content': 'for (int i = 1; i <= 5; i++) {\n    printf("%d回目のループ\\n", i);\n}\n\nint count = 0;\nwhile (count < 3) {\n    printf("while: %d\\n", count);\n    count++;\n}',
            'kawada_emotion': 'default',
            'order': 9
        },
        {
            'position': 3600,
            'side': 'right',
            'type': 'text',
            'content': 'ループ処理でプログラムを繰り返し実行できます。\nfor文とwhile文が代表的なループです。\n\n焦らなくて大丈夫です。川田、ここにいますから✨',
            'kawada_emotion': 'gentle',
            'order': 10
        }
    ]
    
    # 学習セクションを作成
    for section_data in lesson_sections:
        CLessonSection.objects.create(**section_data)
    
    # クイズデータ
    quiz_questions = [
        {
            'question': 'セミコロンが必要なのはどれ？',
            'options': ['int a = 10', 'int b = 20;', 'printf("Hello")'],
            'correct_answer': 1,
            'explanation': 'C言語では文の終わりにセミコロンが必要です。正解は「int b = 20;」です。',
            'kawada_correct_message': '川田、正解です！セミコロンは大切ですね✨',
            'kawada_wrong_message': '川田、もう一度考えてみましょう。文の終わりには何が必要でしょうか？',
            'trigger_position': 900,
            'order': 1
        },
        {
            'question': 'printf関数で変数を表示するとき、整数の書式指定子は？',
            'options': ['%s', '%d', '%f'],
            'correct_answer': 1,
            'explanation': '整数を表示する際は %d を使用します。%s は文字列、%f は浮動小数点数用です。',
            'kawada_correct_message': '川田、素晴らしい！%dは整数用の書式指定子です！',
            'kawada_wrong_message': '川田、それも昔やりました……整数用の書式指定子を思い出してみてください。',
            'trigger_position': 1800,
            'order': 2
        },
        {
            'question': 'if文の条件式で「以上」を表すのは？',
            'options': ['>', '>=', '=='],
            'correct_answer': 1,
            'explanation': '>= は「以上」を表します。> は「より大きい」、== は「等しい」です。',
            'kawada_correct_message': '川田、照れてます……正解です！>= が「以上」ですね💕',
            'kawada_wrong_message': '川田、ヒントです。「以上」は「等しいか、それより大きい」という意味です。',
            'trigger_position': 2600,
            'order': 3
        },
        {
            'question': 'for文でカウンタ変数iを1増やすには？',
            'options': ['i + 1', 'i++', 'i = +1'],
            'correct_answer': 1,
            'explanation': 'i++ はインクリメント演算子で、変数を1増やします。',
            'kawada_correct_message': '川田、完璧です！i++でインクリメントですね🌟',
            'kawada_wrong_message': '川田、インクリメント演算子を思い出してみてください……',
            'trigger_position': 3400,
            'order': 4
        }
    ]
    # クイズを作成
    for quiz_data in quiz_questions:
        quiz_data['options'] = json.dumps(quiz_data['options'], ensure_ascii=False)
        CQuizQuestion.objects.create(**quiz_data)
        CQuizQuestion.objects.create(**quiz_data)
    
    print("✅ サンプルデータの作成が完了しました！")
    print(f"📚 学習セクション: {len(lesson_sections)}個")
    print(f"⚠️ クイズ問題: {len(quiz_questions)}個")
    print("\n🚀 ブラウザで /cstudy/ にアクセスして新しいパララックス学習を体験してください！")

if __name__ == '__main__':
    create_sample_data()
