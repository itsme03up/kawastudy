#!/usr/bin/env python
"""
SQLクイズのサンプルデータを作成するスクリプト
"""
import os
import sys
import django

# Django設定
sys.path.append('/Users/annayanchuk/kawastudy')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kawastudy.settings')
django.setup()

from apps.sqlquiz.models import QuizStage

def create_sample_stages():
    """サンプルステージを作成"""
    
    stages_data = [
        {
            'stage_number': 1,
            'title': '給料日ランチ',
            'description': '今日は給料日！1000円〜2000円の予算で美味しいランチを探そう！',
            'question': '「1000円以上2000円以下」のメニューを取得してください',
            'correct_sql': 'SELECT name FROM lunch_menu WHERE price >= 1000 AND price <= 2000;',
            'hint': 'WHERE句でprice >= 1000 AND price <= 2000 を使いましょう！',
            'story_text': '……川田、今日は給料日でした。\n少し贅沢したいですが、高すぎるのも気が引けます。\n1000円以上、でも2000円以下のメニューが食いたいですね……',
            'table_name': 'lunch_menu',
            'sample_data_json': """
[
  {"id": 1, "name": "ハンバーグ定食", "category": "洋食", "price": 980, "available": true},
  {"id": 2, "name": "鰻重", "category": "和食", "price": 1980, "available": true},
  {"id": 3, "name": "牛丼", "category": "和食", "price": 590, "available": false},
  {"id": 4, "name": "天ぷらそば", "category": "和食", "price": 1050, "available": true},
  {"id": 5, "name": "カレーライス", "category": "洋食", "price": 850, "available": true}
]
            """,
            'success_reaction': 'それ……まさに理想的な昼食でした。\n鰻重も、天ぷらそばも……ちょっと贅沢で、でもちゃんと現実的で。\n川田、こういうの、大事にしたいと思ってました。',
            'failure_reaction': 'それは惜しかったです……もう一度一緒にやってみましょうか？',
            'mock_result_json': """
[
    {"name": "鰻重"},
    {"name": "天ぷらそば"}
]
            """
        },
        {
            'stage_number': 2,
            'title': 'カロリー控えめがいい日',
            'description': '健康を気にして、600kcal未満のヘルシーメニューを見つけよう！',
            'question': '''今日は健康志向！メニューテーブルから、カロリーが600kcal未満のメニューを全て取得してください。

テーブル構造：
- menu(id, name, price, category, calories)

カロリーが低い順に並べて表示してください。''',
            'correct_sql': 'SELECT * FROM menu WHERE calories < 600 ORDER BY calories;',
            'hint': 'WHERE calories < 600 と ORDER BY calories を組み合わせましょう！'
        },
        {
            'stage_number': 3,
            'title': '夜のカフェイン控えめ',
            'description': '夜遅くでも安心！名前に"カフェ"が入り、19時以降も営業しているお店を探そう！',
            'question': '''お店テーブル（shops）から、以下の条件に合うお店を探してください：
1. 店名に「カフェ」という文字が含まれている
2. 営業終了時間が19時以降（19時含む）

テーブル構造：
- shops(id, name, open_time, close_time, area)

例：「川田カフェ」営業時間 8:00-22:00''',
            'correct_sql': 'SELECT * FROM shops WHERE name LIKE "%カフェ%" AND close_time >= "19:00";',
            'hint': 'LIKE演算子で"%カフェ%"を使い、close_time >= "19:00"で時間条件を指定しましょう！'
        },
        {
            'stage_number': 4,
            'title': 'デザートランキング',
            'description': 'デザート好きの川田さんのために、人気デザートTOP3を見つけよう！',
            'question': '''メニューテーブルから、カテゴリが「デザート」のメニューを人気順（人気度の高い順）でTOP3を取得してください。

テーブル構造：
- menu(id, name, price, category, calories, popularity_score)

popularity_scoreが高いほど人気です。''',
            'correct_sql': 'SELECT * FROM menu WHERE category = "デザート" ORDER BY popularity_score DESC LIMIT 3;',
            'hint': 'WHERE category = "デザート"、ORDER BY popularity_score DESC、LIMIT 3を組み合わせましょう！'
        },
        {
            'stage_number': 5,
            'title': 'お気に入りにINSERT',
            'description': '川田さんが新しく見つけたお気に入りメニューをデータベースに追加しよう！',
            'question': '''お気に入りテーブル（favorites）に、川田さんの新しいお気に入りメニューを追加してください。

追加する情報：
- user_id: 1 (川田さんのID)
- menu_id: 15 (新しく気に入ったメニューのID)
- added_date: "2024-07-31"

テーブル構造：
- favorites(user_id, menu_id, added_date)''',
            'correct_sql': 'INSERT INTO favorites (user_id, menu_id, added_date) VALUES (1, 15, "2024-07-31");',
            'hint': 'INSERT INTO テーブル名 (カラム名1, カラム名2, カラム名3) VALUES (値1, 値2, 値3); の形式で書きましょう！'
        }
    ]
    
    # 既存のデータを削除
    QuizStage.objects.all().delete()
    
    # 新しいデータを作成
    for stage_data in stages_data:
        stage = QuizStage.objects.create(**stage_data)
        print(f"作成: {stage}")
    
    print(f"\n✅ {len(stages_data)}個のステージを作成しました！")

if __name__ == '__main__':
    create_sample_stages()
