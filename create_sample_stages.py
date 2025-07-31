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
            'title': '夜カフェを探して',
            'description': '夜遅くでも安心！名前に"カフェ"が入り、22時以降も営業しているお店を探そう！',
            'question': '「名前に"カフェ"を含み」、かつ「22時以降も営業している」お店を表示してください。',
            'correct_sql': 'SELECT name FROM shop WHERE name LIKE \'%カフェ%\' AND close_hour >= \'22:00\';',
            'alternative_solutions_json': '["SELECT name FROM shop WHERE category = \'カフェ\' AND close_hour >= \'22:00\'"]',
            'hint': 'LIKE句で名前に「カフェ」を含むか、categoryを使っても良いかもしれません。',
            'story_text': '……川田、ちょっと夜にカフェで過ごしたいと思ってました。\n喧騒じゃなくて、静かな場所で、温かい飲み物と本を。\n22時くらいまで開いてるところ……あると嬉しいです。',
            'table_name': 'shop',
            'sample_data_json': '[{"id": 1, "name": "星空カフェ", "category": "カフェ", "open_hour": "10:00", "close_hour": "22:00"}, {"id": 2, "name": "スナックあけぼの", "category": "スナック", "open_hour": "19:00", "close_hour": "01:00"}, {"id": 3, "name": "居酒屋まるしん", "category": "居酒屋", "open_hour": "17:00", "close_hour": "23:00"}, {"id": 4, "name": "カフェド・モナリザ", "category": "カフェ", "open_hour": "08:00", "close_hour": "21:00"}, {"id": 5, "name": "深夜カフェロワ", "category": "カフェ", "open_hour": "18:00", "close_hour": "23:30"}]',
            'success_reaction': '川田、こういう場所が欲しかったんです。\n夜の静けさに溶けるように、灯りがあって、温かくて……\nちゃんと見つけられて、良かったです。',
            'failure_reaction': 'それ、惜しかったです。時間か、「名前の中に"カフェ"」の条件、どちらかが漏れていたかもしれません。',
            'mock_result_json': '[{"name": "星空カフェ"}, {"name": "深夜カフェロワ"}]'
        },
        {
            'stage_number': 3,
            'title': 'カロリー控えめがいい日',
            'description': '健康を気にして、300kcal以下のヘルシーなスイーツを見つけよう！',
            'question': '健康を意識して、300kcal以下の低カロリーなスイーツを選んでください。',
            'correct_sql': 'SELECT name FROM sweets WHERE calories <= 300;',
            'alternative_solutions_json': '[]',
            'hint': 'WHERE句で数値の上限を指定してみましょう。300kcal以下という条件を忘れずに。',
            'story_text': '川田、今日はちょっとだけ控えめにしたいと思ってました。\n甘いものが好きなのは変わらないんですが……\n胃が重くならないくらいの、優しい甘さを探してました。カロリーが300kcal以下のスイーツを抽出しましょう。',
            'table_name': 'sweets',
            'sample_data_json': '[{"id": 1, "name": "濃厚チョコケーキ", "calories": 420}, {"id": 2, "name": "いちごゼリー", "calories": 180}, {"id": 3, "name": "ミルフィーユ", "calories": 350}, {"id": 4, "name": "杏仁豆腐", "calories": 240}, {"id": 5, "name": "フルーツ寒天", "calories": 160}]',
            'success_reaction': '川田、それくらいがちょうど良いと思ってました。\n胃も心も、軽やかでいられる甘さですね。',
            'failure_reaction': '川田、それ……ちょっと重たかったかもしれません。\n300kcalを超えていないか、もう一度確認してみてください。',
            'mock_result_json': '[{"name": "いちごゼリー"}, {"name": "杏仁豆腐"}, {"name": "フルーツ寒天"}]'
        },
        {
            'stage_number': 4,
            'title': '本棚の整理をしよう',
            'description': 'GROUP BY句を使って、ジャンル別に本の冊数を集計する問題です。カテゴリごとのデータをまとめて把握しましょう。',
            'question': '川田の本棚にある本を、ジャンル別に冊数を集計してください。各ジャンルに何冊ずつあるかを表示してください。',
            'correct_sql': 'SELECT genre, COUNT(*) as book_count FROM books GROUP BY genre;',
            'alternative_solutions_json': '["SELECT genre, COUNT(id) as book_count FROM books GROUP BY genre", "SELECT genre, COUNT(*) FROM books GROUP BY genre", "SELECT genre, COUNT(id) FROM books GROUP BY genre"]',
            'hint': 'GROUP BY句でジャンルごとにグループ化し、COUNT(*)で各グループの件数を数えましょう。',
            'story_text': '川田、部屋の本棚がごちゃごちゃになってました。\n技術書、小説、漫画……色々混ざっていて、何がどれくらいあるのか分からなくて。\n整理する前に、まずはジャンル別の冊数（book_count）を把握したいと思ってました。',
            'table_name': 'books',
            'sample_data_json': '[{"id": 1, "title": "Python入門", "genre": "技術書", "author": "山田太郎"}, {"id": 2, "title": "ノルウェイの森", "genre": "小説", "author": "村上春樹"}, {"id": 3, "title": "ワンピース 1巻", "genre": "漫画", "author": "尾田栄一郎"}, {"id": 4, "title": "Django実践ガイド", "genre": "技術書", "author": "田中花子"}, {"id": 5, "title": "吾輩は猫である", "genre": "小説", "author": "夏目漱石"}, {"id": 6, "title": "進撃の巨人 1巻", "genre": "漫画", "author": "諫山創"}, {"id": 7, "title": "JavaScript完全ガイド", "genre": "技術書", "author": "佐藤次郎"}]',
            'success_reaction': '川田、これで分かりました。\n技術書が多いのは予想通りでしたが、小説も意外と持ってたんですね。\nこうやって数字で見ると、整理の方針も立てやすくなります。',
            'failure_reaction': '川田、それだと個別の本が表示されてしまったかもしれません。\nGROUP BYでジャンルごとにまとめて、COUNT(*)で冊数を数えてみてください。',
            'mock_result_json': '[{"genre": "技術書", "book_count": 3}, {"genre": "小説", "book_count": 2}, {"genre": "漫画", "book_count": 2}]'
        },
        {
            'stage_number': 5,
            'title': '新作ガンプラ、リストに追加！',
            'description': 'INSERT INTO 文で、新しく発売されたガンプラを購入予定リストに追加する問題です。',
            'question': 'ガンプラ「HG νガンダム（2025年版）」を、購入予定リストに追加してください。',
            'correct_sql': 'INSERT INTO wishlist (name, category) VALUES (\'HG νガンダム（2025年版）\', \'ガンプラ\');',
            'alternative_solutions_json': '[]',
            'hint': '`INSERT INTO テーブル名 (カラム1, カラム2) VALUES (値1, 値2)`の形式を使いましょう。',
            'story_text': '……川田、今朝コンビニでホビー誌を立ち読みしました。\nHG νガンダムの新バージョン、すごく良かったんです。\n「HG νガンダム（2025年版）」、カテゴリは「ガンプラ」で、\n必ずnameとcategoryのカラム名を指定して、購入リストに入れておきたいと思ってました。',
            'table_name': 'wishlist',
            'sample_data_json': '[{"id": 1, "name": "MG シャア専用ザク Ver.2.0", "category": "ガンプラ"}, {"id": 2, "name": "SDガンダム クロスシルエット", "category": "ガンプラ"}]',
            'success_reaction': 'ありがとうございます。川田、これで忘れずに済みました。\nこういう「好き」が、毎日を支えてくれている気がします。',
            'failure_reaction': '川田……惜しかったです。`INSERT INTO`で、ちゃんとカラムを指定して追加してあげてください。',
            'mock_result_json': '[{"id": 1, "name": "MG シャア専用ザク Ver.2.0", "category": "ガンプラ"}, {"id": 2, "name": "SDガンダム クロスシルエット", "category": "ガンプラ"}, {"id": 3, "name": "HG νガンダム（2025年版）", "category": "ガンプラ"}]'
        },
        {
            'stage_number': 6,
            'title': '秋葉原・秋月電子でパーツを照合せよ！',
            'description': 'JOIN句を使って、部品名から在庫数と用途を照合する問題です。2つのテーブルを正しく結合しましょう。',
            'question': '秋月電子で購入予定の「100uF 電解コンデンサ」の在庫と用途を照合してください。',
            'correct_sql': 'SELECT name, stock, purpose FROM parts_with_usage WHERE name = \'100uF 電解コンデンサ\';',
            'alternative_solutions_json': '[]',
            'hint': '2つの表を`JOIN`で結合し、必要なカラムを絞って取得しましょう。',
            'story_text': '川田、明日は秋葉原に寄れそうでした。\n秋月電子で「100uFの電解コンデンサ」、見ておきたかったんです。\n在庫と、どの回路で使えるか……事前に確認しておくと安心でした。',
            'table_name': 'parts_with_usage',
            'sample_data_json': '[{"id": 1, "name": "10uF セラミック", "stock": 120, "purpose": "ノイズ除去"}, {"id": 2, "name": "100uF 電解コンデンサ", "stock": 45, "purpose": "電源平滑"}, {"id": 3, "name": "470uF 電解コンデンサ", "stock": 0, "purpose": "アンプ出力"}]',
            'success_reaction': '川田、それでした……安心して秋葉原に行けます。\n機能と在庫、両方見えていると心の準備も整いますね。',
            'failure_reaction': '結合が……上手くいってなかったかもしれません。\n`JOIN`で関連するidを繋げて、そこからカラムを取るのがコツでした。',
            'mock_result_json': '[{"name": "100uF 電解コンデンサ", "stock": 45, "purpose": "電源平滑"}]'
        },
        {
            'stage_number': 7,
            'title': 'うちの犬に、もう一度チャンスを',
            'description': 'NOT IN を使って、過去に食べなかったおやつを除外しつつ、価格条件を満たすおやつを選ぶ問題です。',
            'question': '飼い犬にあげるおやつを、以前食べなかったものを除いて、\nかつ300円以内のものに絞って選んでください。',
            'correct_sql': 'SELECT name FROM dog_snacks WHERE price <= 300 AND name NOT IN (SELECT snack_name FROM rejected_history);',
            'alternative_solutions_json': '[]',
            'hint': '`NOT IN`を使って、「食べなかった履歴に含まれないもの」を除外しましょう。',
            'story_text': '川田、こないだ買ったおやつ……見向きもされなかったんです。\nでも、もう一度ちゃんと考え直して、喜んでくれるものを選びたくて。\n今度は、無駄にしたくないと思ってました。',
            'table_name': 'dog_snacks, rejected_history',
            'sample_data_json': '{"dog_snacks": [{"id": 1, "name": "ビーフジャーキー", "price": 280}, {"id": 2, "name": "チーズキューブ", "price": 310}, {"id": 3, "name": "さつまいもスティック", "price": 290}, {"id": 4, "name": "ボーロ", "price": 180}], "rejected_history": [{"id": 1, "snack_name": "ビーフジャーキー"}]}',
            'success_reaction': '川田……今回は、ちゃんと喜んでもらえる気がしました。\n無理させたくなくて。でも、ちゃんと選び直せたと思います。',
            'failure_reaction': 'うまく除外できていなかったかもしれません。\n過去の履歴と照合して、「もう与えない」って条件、忘れずにでした。',
            'mock_result_json': '[{"name": "さつまいもスティック"}, {"name": "ボーロ"}]'
        },
        {
            'stage_number': 8,
            'title': '混雑してる店は、今日はちょっと……',
            'description': 'WHERE句で「混雑中ではない」カフェを選ぶ問題です。NOT、!=、<>の使い方を学べます。',
            'question': '現在「混雑中」ではない店をすべて表示してください。',
            'correct_sql': 'SELECT name FROM cafe_status WHERE status != \'混雑中\';',
            'alternative_solutions_json': '["SELECT name FROM cafe_status WHERE NOT status = \'混雑中\'", "SELECT name FROM cafe_status WHERE status <> \'混雑中\'"]',
            'hint': '`!=` や `NOT` を使って、ある条件を除く方法を試してみましょう。',
            'story_text': '川田、今日はちょっとだけ静かに過ごしたかったんです。\n普段なら賑やかなのも悪くないですが、今は……少しだけ距離を取りたくて。',
            'table_name': 'cafe_status',
            'sample_data_json': '[{"id": 1, "name": "陽だまりカフェ", "status": "空席あり"}, {"id": 2, "name": "喫茶エトランゼ", "status": "混雑中"}, {"id": 3, "name": "珈琲館ひつじ", "status": "空席わずか"}, {"id": 4, "name": "ナイトカフェ・ロッソ", "status": "閉店中"}]',
            'success_reaction': '川田、それでした。\n少し静かな場所に身を置くだけで……心って落ち着くんですね。',
            'failure_reaction': '川田、それだと、混雑中の店も含まれてしまっていたかもしれません。\n`!=` や `<>`、あるいは `NOT` を試してみてください。',
            'mock_result_json': '[{"name": "陽だまりカフェ"}, {"name": "珈琲館ひつじ"}, {"name": "ナイトカフェ・ロッソ"}]'
        },
        {
            'stage_number': 9,
            'title': '川田、恋をする（荻窪からのデート）',
            'description': '荻窪駅から10km以内で行けるデートスポットを抽出する問題です。距離条件とorigin指定を両立させましょう。',
            'question': '荻窪駅から10km以内で行ける場所を選んでください。\n※候補の中には、ちょっと遠い所も混ざっています。',
            'correct_sql': 'SELECT name FROM date_spots WHERE origin = \'荻窪\' AND distance_km <= 10;',
            'alternative_solutions_json': '[]',
            'hint': '条件を満たす距離の範囲を `WHERE` でしっかり絞るのがポイントでした。',
            'story_text': '……川田、ちょっとだけ寄り道したい場所がありました。\nあまり遠くじゃなくて、でも少しだけ特別で。\n荻窪から、10km以内の場所で……一緒に行ってくれる人がいたらって、思ってました。',
            'table_name': 'date_spots',
            'sample_data_json': '[{"id": 1, "name": "井の頭公園", "origin": "荻窪", "distance_km": 6.2}, {"id": 2, "name": "葛西臨海公園", "origin": "荻窪", "distance_km": 18.5}, {"id": 3, "name": "ジブリ美術館", "origin": "荻窪", "distance_km": 4.7}, {"id": 4, "name": "等々力渓谷", "origin": "荻窪", "distance_km": 9.8}, {"id": 5, "name": "箱根彫刻の森", "origin": "荻窪", "distance_km": 75.0}]',
            'success_reaction': '川田、それくらいの距離が……ちょうどいいって、思ってました。\n近すぎず、遠すぎず。誰かと行くには、ちょうどいいくらいの。',
            'failure_reaction': '川田、それだと……ちょっと遠くまで行ってしまうかもしれません。\n距離にちゃんと制限をつけて、10km以内を選んでみてください。',
            'mock_result_json': '[{"name": "井の頭公園"}, {"name": "ジブリ美術館"}, {"name": "等々力渓谷"}]'
        },
        {
            'stage_number': 10,
            'title': '今日は静かな場所で（岩吉さんを避けて）',
            'description': '特定の駅から20km以上離れていて、かつ静かな場所を選ぶ問題です。フラグと数値条件のAND指定が必要です。',
            'question': '岩吉さんが今日は「新宿駅」付近に営業に行っています。\nそこで、新宿駅から20km以上離れていて、かつ「静か（quiet = TRUE）」な場所を探してください。',
            'correct_sql': 'SELECT name FROM spots WHERE quiet = TRUE AND distance_from_shinjuku >= 20;',
            'alternative_solutions_json': '["SELECT name FROM spots WHERE quiet = 1 AND distance_from_shinjuku >= 20"]',
            'hint': '`quiet`フラグと距離の条件、2つを両立させる必要がありました。',
            'story_text': '……川田、今日は静かに過ごしたかったんです。\n新宿には岩吉さんがいるので、少し離れた場所を選びました。\n騒がしいライブハウスとかじゃなくて、もっと落ち着いた場所が、今はいいと思ってました。',
            'table_name': 'spots',
            'sample_data_json': '[{"id": 1, "name": "水族館（しながわ）", "quiet": true, "distance_from_shinjuku": 24}, {"id": 2, "name": "ライブハウス・ブレイズ", "quiet": false, "distance_from_shinjuku": 2}, {"id": 3, "name": "温泉センター（八王子）", "quiet": true, "distance_from_shinjuku": 35}, {"id": 4, "name": "映画館（中野）", "quiet": false, "distance_from_shinjuku": 5}, {"id": 5, "name": "カフェ・ユグドラシル", "quiet": true, "distance_from_shinjuku": 12}]',
            'success_reaction': '川田、それが……今の自分にはちょうど良い距離でした。\n静かで、少し遠くて。安心できる場所があるって、思えました。',
            'failure_reaction': '川田、それだと近すぎたかもしれません。\n距離と静けさ、両方を満たす選び方を、もう一度だけ見直してみてください。',
            'mock_result_json': '[{"name": "水族館（しながわ）"}, {"name": "温泉センター（八王子）"}]'
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
