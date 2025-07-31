# kawastudy
**理知的なIT講師・川田と一緒に学べるWebアプリ**です。  
タイピング・SQL・Chat対話・Linuxなど、ゲーム感覚で学習できる機能を搭載しています。

---

## 🌟 機能一覧

| モジュール     | 概要                                         |
|----------------|----------------------------------------------|
| 🎮 かわ打       | タイピングゲームで入力練習できます |
| 💬 勉強         | ChatGPTとの川田語チャットで、対話的に勉強できます |
| 🧩 SQLクイズ    | ストーリー付きのクイズ。川田の恋が始まる…？ |
| 🐧 楽しいLinux  | Linuxコマンドやサーバ管理を可視化学習できます     |

---

## 📁 ディレクトリ構成

```
kawastudy/
├── frontend/               # React frontend (separate)
│   ├── src/               # React source code
│   ├── public/            # Static assets
│   ├── package.json       # Frontend dependencies
│   └── webpack.config.js  # Build configuration
├── apps/                  # Django apps (backend)
│   ├── typinggame/        # タイピングゲーム
│   ├── chatlesson/        # GPTとの会話勉強モード
│   ├── sqlquiz/           # SQLクイズ問題
│   └── linuxfun/          # Linux基礎知識編
├── kawastudy/             # Django project settings
├── templates/             # Django templates
├── static/                # Backend static files
├── venv/                  # Python virtual environment
├── manage.py              # Django management
└── requirements.txt       # Python dependencies
```

---

## 🚀 開発環境セットアップ

### バックエンド (Django)

```bash
git clone https://github.com/itsme03up/kawastudy.git
cd kawastudy

# Python仮想環境の設定
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Djangoサーバーの起動
python manage.py runserver
```

### フロントエンド (React)

```bash
# フロントエンドディレクトリに移動
cd frontend

# Node.js依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

### React開発環境

```bash
# フロントエンドディレクトリで実行
cd frontend

# 開発サーバー（ホットリロード付き）
npm run dev

# プロダクションビルド
npm run build

# ビルドのウォッチモード
npm run watch
```  

## ⚙️ サンプルデータ生成

```bash
# マイグレーションの実行とサンプルデータ投入
python manage.py migrate
python create_sample_stages.py
```  

## 🎨 UIガイド

詳細なUIカスタマイズ方法は `UI_GUIDE.md` を参照してください。

🛠 使用技術
**バックエンド**
- Python / Django
- SQLite（軽量なデータ保存）
- ChatGPT API（OpenAI）

**フロントエンド**
- React 18（モダンなUI コンポーネント）
- HTML / CSS / JavaScript（フォールバック対応）
- Bootstrap 5（レスポンシブUI）
- Webpack（モジュールバンドラー）

**開発ツール**
- Babel（ES6+ トランスパイル）
- VS Code Tasks（ビルド自動化）

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
