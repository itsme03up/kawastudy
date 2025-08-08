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
            'type': 'code',
            'content': ('printf と scanf\n基本的な入出力\n\n#include <stdio.h>\n\n'
                       'int main() {\n    int num;\n    printf("整数を入力してください: ");\n'
                       '    scanf("%d", &num);\n    printf("入力された値は %d です。\\n", num);\n'
                       '    return 0;\n}'),
            'kawada_emotion': 'default',
            'order': 2
        },
        {
            'position': 800,
            'side': 'right',
            'type': 'explanation',
            'content': ('printf は画面に文字列や変数の値を表示する関数でした。\n'
                       'scanf はキーボードからの入力を受け取り、指定した変数に格納しますね。\n'
                       '書式指定子 %d は整数用、%f は小数、%s は文字列用でした。'),
            'kawada_emotion': 'gentle',
            'order': 3
        },
        {
            'position': 1200,
            'side': 'right',
            'type': 'code',
            'content': ('int 型\n整数型の特徴\n\n#include <stdio.h>\n\n'
                       'int main() {\n    int a = 10;\n    int b = 3;\n'
                       '    int c = a / b;   // 整数同士の割り算 → 商だけが残る\n'
                       '    printf("c = %d\\n", c);\n    return 0;\n}'),
            'kawada_emotion': 'thinking',
            'order': 4
        },
        {
            'position': 1600,
            'side': 'right',
            'type': 'explanation',
            'content': ('int は整数型です。\n'
                       '小数点以下は切り捨てられるので、割り算の結果に注意が必要でした……。\n'
                       '整数を扱うときにまずは int を思い出してくださいね。'),
            'kawada_emotion': 'gentle',
            'order': 5
        },
        {
            'position': 2000,
            'side': 'right',
            'type': 'code',
            'content': ('sum += と i++\n便利な演算子\n\n#include <stdio.h>\n\n'
                       'int main() {\n    int sum = 0;\n    for (int i = 1; i <= 5; i++) {\n'
                       '        sum += i;   // sum = sum + i と同じ\n'
                       '        // i++ は i = i + 1 と同じ意味\n    }\n'
                       '    printf("1～5 の合計は %d です。\\n", sum);\n    return 0;\n}'),
            'kawada_emotion': 'smile',
            'order': 6
        },
        {
            'position': 2400,
            'side': 'right',
            'type': 'explanation',
            'content': ('sum += i は「現在の sum に i を足して sum に戻す」演算子でした。\n'
                       'i++ は「後置インクリメント」で、ループのカウントアップに便利ですね😊'),
            'kawada_emotion': 'cheerful',
            'order': 7
        },
        {
            'position': 2800,
            'side': 'right',
            'type': 'code',
            'content': ('for 文\n繰り返し処理の基本\n\n#include <stdio.h>\n\n'
                       'int main() {\n    for (int i = 0; i < 3; i++) {\n'
                       '        printf("for ループ %d 回目\\n", i + 1);\n    }\n'
                       '    return 0;\n}'),
            'kawada_emotion': 'default',
            'order': 8
        },
        {
            'position': 3200,
            'side': 'right',
            'type': 'explanation',
            'content': ('for 文は繰り返し回数がはっきりしているときに使います。\n'
                       '初期化・条件・更新を一行で書けるので、コードがすっきりしましたね。'),
            'kawada_emotion': 'thinking',
            'order': 9
        },
        {
            'position': 3600,
            'side': 'right',
            'type': 'code',
            'content': ('while 文\n条件付き繰り返し\n\n#include <stdio.h>\n\n'
                       'int main() {\n    int count = 0;\n    while (count < 3) {\n'
                       '        printf("while ループ %d 回目\\n", count + 1);\n'
                       '        count++;\n    }\n    return 0;\n}'),
            'kawada_emotion': 'default',
            'order': 10
        },
        {
            'position': 4000,
            'side': 'right',
            'type': 'explanation',
            'content': ('while 文は「条件を見てから繰り返す」ので、ループ回数が未知の場合に適しています。\n'
                       '条件が先に評価されることを忘れずに……ここ大事でした。'),
            'kawada_emotion': 'gentle',
            'order': 11
        },
        {
            'position': 4400,
            'side': 'right',
            'type': 'code',
            'content': ('do…while 文\n実行してから判定\n\n#include <stdio.h>\n\n'
                       'int main() {\n    int num;\n    do {\n'
                       '        printf("正の整数を入力してください: ");\n'
                       '        scanf("%d", &num);\n    } while (num <= 0);\n'
                       '    printf("入力された正の整数は %d です。\\n", num);\n    return 0;\n}'),
            'kawada_emotion': 'default',
            'order': 12
        },
        {
            'position': 4800,
            'side': 'right',
            'type': 'explanation',
            'content': ('do…while は「必ず一度は処理を実行してから、条件をチェック」します。\n'
                       'ユーザー入力など、一度は動かしたいときに便利でしたね。'),
            'kawada_emotion': 'thinking',
            'order': 13
        },
        {
            'position': 5200,
            'side': 'right',
            'type': 'code',
            'content': ('if 文\n条件分岐\n\n#include <stdio.h>\n\n'
                       'int main() {\n    int x = 7;\n    if (x % 2 == 0) {\n'
                       '        printf("x は偶数です。\\n");\n    } else {\n'
                       '        printf("x は奇数です。\\n");\n    }\n    return 0;\n}'),
            'kawada_emotion': 'default',
            'order': 14
        },
        {
            'position': 5600,
            'side': 'right',
            'type': 'explanation',
            'content': ('if 文は条件に応じて処理を分岐します。\n'
                       'else if を使えば、多岐にわたる分岐もスッキリ書けましたね。'),
            'kawada_emotion': 'smile',
            'order': 15
        },
        {
            'position': 6000,
            'side': 'right',
            'type': 'code',
            'content': ('switch 文\n多分岐処理\n\n#include <stdio.h>\n\n'
                       'int main() {\n    int day = 3;\n    switch (day) {\n'
                       '        case 1:\n            printf("月曜日\\n");\n            break;\n'
                       '        case 2:\n            printf("火曜日\\n");\n            break;\n'
                       '        case 3:\n            printf("水曜日\\n");\n            break;\n'
                       '        default:\n            printf("その他の日\\n");\n    }\n    return 0;\n}'),
            'kawada_emotion': 'default',
            'order': 16
        },
        {
            'position': 6400,
            'side': 'right',
            'type': 'explanation',
            'content': ('switch は複数の値による分岐を簡潔に書けます。\n'
                       'break を忘れると次のケースまで実行されるので要注意でした……。'),
            'kawada_emotion': 'gentle',
            'order': 17
        },
        {
            'position': 6800,
            'side': 'right',
            'type': 'code',
            'content': ('ネスト（入れ子構造）\n二重ループ\n\n#include <stdio.h>\n\n'
                       'int main() {\n    for (int i = 1; i <= 3; i++) {\n'
                       '        for (int j = 1; j <= 2; j++) {\n'
                       '            printf("i=%d, j=%d\\n", i, j);\n        }\n    }\n'
                       '    return 0;\n}'),
            'kawada_emotion': 'thinking',
            'order': 18
        },
        {
            'position': 7200,
            'side': 'right',
            'type': 'explanation',
            'content': ('ループの中にループを入れると、二重ループ（ネスト）になります。\n'
                       '条件分岐やループは入れ子にして複雑な処理も表現できましたね。'),
            'kawada_emotion': 'cheerful',
            'order': 19
        },
        {
            'position': 7600,
            'side': 'right',
            'type': 'code',
            'content': ('配列\n複数のデータ管理\n\n#include <stdio.h>\n\n'
                       'int main() {\n    int a[4] = {10, 20, 30, 40};\n'
                       '    for (int i = 0; i < 4; i++) {\n'
                       '        printf("a[%d] = %d\\n", i, a[i]);\n    }\n'
                       '    return 0;\n}'),
            'kawada_emotion': 'default',
            'order': 20
        },
        {
            'position': 8000,
            'side': 'right',
            'type': 'explanation',
            'content': ('配列は同じ型のデータをまとめて管理します。\n'
                       '添字は 0 から始まるので、範囲外アクセスに注意でした。'),
            'kawada_emotion': 'gentle',
            'order': 21
        },
        {
            'position': 8400,
            'side': 'right',
            'type': 'text',
            'content': ('学習完了！\nお疲れさまでした！\n川田と一緒にC言語の基礎を学びました。\n\n'
                       '次は実際のコーディングに挑戦してみましょう！'),
            'kawada_emotion': 'cheerful',
            'order': 22
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
            'kawada_correct_message': '正解です！>= が「以上」ですね',
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
