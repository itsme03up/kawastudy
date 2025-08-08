#!/usr/bin/env python3
"""
C言語学習システム用の完全なサンプルデータを作成するスクリプト
学習セクション + クイズ問題を統合して管理
"""

import os
import sys
import json
import django

# Djangoの設定を読み込む
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kawastudy.settings')
django.setup()

# pylint: disable=import-error,wrong-import-position
from apps.cstudy.models import CLessonSection, CQuizQuestion

def create_complete_data():
    """完全な学習データとクイズデータを作成"""

    print("🚀 C言語学習システムのデータ作成を開始...")

    # 既存データの削除
    CLessonSection.objects.all().delete()  # pylint: disable=no-member
    CQuizQuestion.objects.all().delete()  # pylint: disable=no-member
    print("📋 既存データをクリアしました")
    
    # 学習セクションデータ（詳細版）
    lesson_sections = [
        {
            'position': 200,
            'side': 'right',
            'type': 'text',
            'content': ('C言語の世界へようこそ\n川田と一緒に学習の旅を始めましょう！🌟\n\n'
                       'C言語は多くのプログラミング言語の基礎となる重要な言語です。'),
            'kawada_emotion': 'cheerful',
            'order': 1
        },
        {
            'position': 500,
            'side': 'right',
            'type': 'explanation',
            'content': ('基本概念\nC言語は1972年に開発されたプログラミング言語です。\n'
                       'システムプログラミングの基盤となる重要な言語で、'
                       '多くの現代的言語に影響を与えています。'),
            'kawada_emotion': 'thinking',
            'order': 2
        },
        {
            'position': 800,
            'side': 'right',
            'type': 'code',
            'content': ('Hello World\n最初のプログラム\n\n#include <stdio.h>\n\n'
                       'int main() {\n    printf("Hello, World!");\n    return 0;\n}'),
            'kawada_emotion': 'smile',
            'order': 3
        },
        {
            'position': 1200,
            'side': 'right',
            'type': 'explanation',
            'content': ('プログラムの構造\n#include <stdio.h> は標準入出力ライブラリを読み込んでいます。\n'
                       'main関数はプログラムの実行開始点です。\n\n川田、これとても大事なんです！'),
            'kawada_emotion': 'gentle',
            'order': 4
        },
        {
            'position': 1600,
            'side': 'right',
            'type': 'code',
            'content': ('変数と型\nデータを格納する変数\n\nint age = 25;\nchar name[] = "Kawada";\n'
                       'float height = 175.5;\n\nprintf("名前: %s\\n", name);\n'
                       'printf("年齢: %d歳\\n", age);\nprintf("身長: %.1fcm\\n", height);'),
            'kawada_emotion': 'default',
            'order': 5
        },
        {
            'position': 2000,
            'side': 'right',
            'type': 'explanation',
            'content': ('変数の種類\n変数を使ってデータを格納できます。\n'
                       'int（整数）、char（文字）、float（小数）など様々な型があります。\n\n'
                       '川田、プログラミングって面白いですね！'),
            'kawada_emotion': 'cheerful',
            'order': 6
        },
        {
            'position': 2400,
            'side': 'right',
            'type': 'code',
            'content': ('条件分岐\nif文による条件処理\n\nif (age >= 20) {\n'
                       '    printf("成人です\\n");\n} else {\n    printf("未成年です\\n");\n}'),
            'kawada_emotion': 'thinking',
            'order': 7
        },
        {
            'position': 2800,
            'side': 'right',
            'type': 'explanation',
            'content': ('if文の使い方\nif文を使って条件分岐ができます。\n'
                       '条件が真（true）の場合は{}内の処理が実行されます。\n\n'
                       '川田、ちょっと恥ずかしいですが、これ大事なんです……'),
            'kawada_emotion': 'gentle',
            'order': 8
        },
        {
            'position': 3200,
            'side': 'right',
            'type': 'code',
            'content': ('ループ処理\n繰り返し処理の基本\n\nfor (int i = 1; i <= 5; i++) {\n'
                       '    printf("%d回目のループ\\n", i);\n}\n\nint count = 0;\n'
                       'while (count < 3) {\n    printf("while: %d\\n", count);\n    count++;\n}'),
            'kawada_emotion': 'smile',
            'order': 9
        },
        {
            'position': 3600,
            'side': 'right',
            'type': 'explanation',
            'content': ('ループの種類\nループ処理でプログラムを繰り返し実行できます。\n'
                       'for文とwhile文が代表的なループです。\n\n'
                       '焦らなくて大丈夫です。川田、ここにいますから✨'),
            'kawada_emotion': 'gentle',
            'order': 10
        },
        {
            'position': 4000,
            'side': 'right',
            'type': 'code',
            'content': ('配列の基礎\n複数のデータを管理\n\nint numbers[5] = {1, 2, 3, 4, 5};\n\n'
                       'for (int i = 0; i < 5; i++) {\n'
                       '    printf("numbers[%d] = %d\\n", i, numbers[i]);\n}'),
            'kawada_emotion': 'default',
            'order': 11
        },
        {
            'position': 4400,
            'side': 'right',
            'type': 'explanation',
            'content': ('関数の作成\n機能をまとめて再利用可能な関数を作成しましょう。\n'
                       'コードの構造化と保守性が向上します。'),
            'kawada_emotion': 'thinking',
            'order': 12
        },
        {
            'position': 4800,
            'side': 'right',
            'type': 'warning',
            'content': ('ポインタの基礎\nC言語の重要な概念であるポインタについて学びます。\n'
                       'メモリアドレスを直接操作する強力な機能です。\n\n'
                       '川田、これは少し難しいですが、がんばりましょう！'),
            'kawada_emotion': 'thinking',
            'order': 13
        },
        {
            'position': 5200,
            'side': 'right',
            'type': 'text',
            'content': ('学習完了！\nお疲れさまでした！\n川田と一緒にC言語の基礎を学びました。\n\n'
                       '次は実際のコーディングに挑戦してみましょう！'),
            'kawada_emotion': 'cheerful',
            'order': 14
        }
    ]
    
    # 学習セクションを作成
    created_sections = 0
    for section_data in lesson_sections:
        CLessonSection.objects.create(**section_data)  # pylint: disable=no-member
        created_sections += 1

    print(f"📚 学習セクション: {created_sections}個を作成しました")
    
    # クイズデータ
    quiz_questions = [
        {
            'question': 'C言語のプログラムで、セミコロンが必要なのはどれ？',
            'options': ['int a = 10', 'int b = 20;', 'printf("Hello")'],
            'correct_answer': 1,
            'explanation': 'C言語では文の終わりにセミコロンが必要です。正解は「int b = 20;」です。',
            'kawada_correct_message': '正解です！セミコロンは大切ですね✨',
            'kawada_wrong_message': 'もう一度考えてみましょう。文の終わりには何が必要でしょうか？',
            'trigger_position': 900,
            'order': 1
        },
        {
            'question': 'printf関数で整数変数を表示するとき、正しい書式指定子は？',
            'options': ['%s', '%d', '%f'],
            'correct_answer': 1,
            'explanation': ('整数を表示する際は %d を使用します。'
                           '%s は文字列、%f は浮動小数点数用です。'),
            'kawada_correct_message': '素晴らしい！%dは整数用の書式指定子です！',
            'kawada_wrong_message': ('川田、それ昔やりました……'
                                     '整数用の書式指定子を思い出してみてください。'),
            'trigger_position': 1800,
            'order': 2
        },
        {
            'question': 'if文の条件式で「以上」を表す演算子は？',
            'options': ['>', '>=', '=='],
            'correct_answer': 1,
            'explanation': ('>= は「以上」を表します。> は「より大きい」、'
                           '== は「等しい」です。'),
            'kawada_correct_message': '川田、照れてます……正解です！>= が「以上」ですね',
            'kawada_wrong_message': ('ヒントです。「以上」は「等しいか、'
                                     'それより大きい」という意味です。'),
            'trigger_position': 2600,
            'order': 3
        },
        {
            'question': 'for文でカウンタ変数iを1増やすために使う演算子は？',
            'options': ['i + 1', 'i++', 'i = +1'],
            'correct_answer': 1,
            'explanation': 'i++ はインクリメント演算子で、変数を1増やします。',
            'kawada_correct_message': '完璧です！i++でインクリメントですね🌟',
            'kawada_wrong_message': ('インクリメント演算子を'
                                     '思い出してみてください……'),
            'trigger_position': 3400,
            'order': 4
        },
        {
            'question': '配列 int arr[5] で、最初の要素にアクセスするには？',
            'options': ['arr[1]', 'arr[0]', 'arr[first]'],
            'correct_answer': 1,
            'explanation': ('C言語の配列は0から始まります。'
                           '最初の要素は arr[0] でアクセスします。'),
            'kawada_correct_message': 'その通りです！配列は0から始まるんです😊',
            'kawada_wrong_message': ('配列のインデックスは何から始まるか'
                                     '思い出してみてください。'),
            'trigger_position': 4200,
            'order': 5
        }
    ]
    
    # クイズを作成
    created_quizzes = 0
    for quiz_data in quiz_questions:
        quiz_data['options'] = json.dumps(quiz_data['options'], ensure_ascii=False)
        CQuizQuestion.objects.create(**quiz_data)  # pylint: disable=no-member
        created_quizzes += 1

    print(f"❓ クイズ問題: {created_quizzes}個を作成しました")
    
    print("\n✅ C言語学習データの作成が完了しました！")
    print("🚀 ブラウザで /cstudy/ にアクセスして新しい学習システムを体験してください！")
    print("\n📋 作成されたデータ:")
    print(f"  - 学習セクション: {created_sections}個")
    print(f"  - クイズ問題: {created_quizzes}個")

if __name__ == '__main__':
    create_complete_data()
