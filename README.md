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


kawastudy/                    ← リポジトリのルート（git initここ）
├── .gitignore                ← ← Git除外設定
├── manage.py                 ← Django管理コマンド入口
├── requirements.txt          ← Python依存関係
├── kawastudy/                ← プロジェクト設定ディレクトリ
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py               ← ルートURLルーティング
│   ├── asgi.py
│   └── wsgi.py
│
├── templates/                ← 全体共通テンプレート
│   └── base.html             ← 共通UI（ナビ・ヘッダ）を定義
│
├── static/                   ← 静的ファイル（CSS, JS, 画像など）
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── main.js
│
├── media/                    ← アップロード用（任意）
│
├── apps/                     ← Djangoアプリをまとめるディレクトリ
│   ├── typing/               ← かわ打（寿司打パロディ）
│   │   ├── templates/typing/
│   │   │   └── typing.html
│   │   ├── static/typing/
│   │   └── views.py
│   │
│   ├── sqlquiz/              ← SQLクイズ
│   │   ├── templates/sqlquiz/
│   │   └── views.py
│   │
│   ├── studychat/            ← ChatGPTと勉強
│   │   └── views.py
│   │
│   └── linuxfun/             ← 楽しいLinux
│       └── views.py
│
└── .env                      ← （必要なら）環境変数ファイル
