# kawastudy
**理知的で年下なIT講師・川田と一緒に学べるWebアプリ**です。  
タイピング・SQL・Chat対話・Linuxなど、ゲーム感覚で学習できる機能を搭載しています。

---

## 🌟 機能一覧

| モジュール     | 概要                                         |
|----------------|----------------------------------------------|
| 🎮 かわ打       | 寿司打風タイピングゲームで、川田語を入力練習できます |
| 💬 勉強         | ChatGPTとの川田語チャットで、対話的に勉強できます |
| 🧩 SQLクイズ    | ストーリー付きの恋愛風クイズ。川田と恋が始まる…？ |
| 🐧 楽しいLinux  | Linuxコマンドやサーバ管理を可視化学習できます     |

---

## 📁 ディレクトリ構成（概要）

apps/ # 各アプリごとの機能モジュール
├─ typinggame/ # タイピングゲーム
├─ chatlesson/ # GPTとの会話勉強モード
├─ sqlquiz/ # SQLクイズ問題
└─ linuxfun/ # Linux基礎知識編
templates/ # 共通テンプレート、ベースHTML
static/ # 共通CSSやchibi川田の素材など

---

## 🚀 開発環境セットアップ

```bash
git clone https://github.com/itsme03up/kawastudy.git
cd kawastudy
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py runserver
🛠 使用技術
Python / Django

HTML / CSS / JavaScript

Tailwind CSS（共通UI）

ChatGPT API（OpenAI）

SQLite（軽量なデータ保存）

🎨 キャラクター：川田について
川田は理知的なIT講師。
黒縁メガネにオールバック、ポロシャツが特徴。
話し方は丁寧で控えめ、しかし誠実で情熱的です。

📚 制作協力・貢献
このプロジェクトは誰でも参加できます！
Issue・PR・アイデア大歓迎です。
問題作成、UIアニメーションなど募集中！

📄 ライセンス
MIT License


kawastudy/
├── manage.py
├── kawastudy/                # プロジェクト設定ディレクトリ
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py               # ルーティング統合
│   └── asgi.py
│
├── apps/
│   ├── core/                 # 共通UI／ホーム画面
│   │   ├── views.py
│   │   ├── templates/core/
│   │   └── static/core/
│   │
│   ├── typinggame/           # 寿司打風かわ打
│   │   ├── views.py
│   │   ├── static/typinggame/
│   │   └── templates/typinggame/
│   │
│   ├── chatlesson/           # ChatGPTとの対話勉強
│   │   ├── views.py
│   │   ├── prompts/          # 川田語などのプリセット
│   │   ├── templates/chatlesson/
│   │   └── static/chatlesson/
│   │
│   ├── sqlquiz/              # SQLクイズ（川田恋愛編）
│   │   ├── views.py
│   │   ├── models.py         # 問題データ
│   │   ├── templates/sqlquiz/
│   │   └── static/sqlquiz/
│   │
│   └── linuxfun/             # 楽しいLinux学習
│       ├── views.py
│       ├── templates/linuxfun/
│       └── static/linuxfun/
│
├── static/                   # 共通アセット（chibi川田など）
├── templates/                # ベーステンプレート群
│   └── base.html             # 共通UI（ヘッダー・フッター）
│
└── README.md
