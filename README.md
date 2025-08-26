# kawastudy
**理知的なIT講師・川田と一緒に学べるWebアプリ**です。  
タイピング・SQL・Chat対話・Linux・AWS・C言語・スケジュール管理など、ゲーム感覚で学習できる機能を搭載しています。

---

## 🌟 機能一覧

| モジュール     | 概要                                         |
|----------------|----------------------------------------------|
| 🎮 かわ打       | タイピングゲームで入力練習できます |
| 💬 勉強         | ChatGPTとの川田語チャットで、対話的に勉強できます |
| 🧩 SQLクイズ    | ストーリー付きのクイズ。川田の恋が始まる…？ |
| 🐧 楽しいLinux  | Linuxコマンドやサーバ管理を可視化学習できます     |
| ☁️ AWS学習      | AWSサービスの基礎を体系的に学習できます |
| 💻 C言語学習    | C言語のプログラミング基礎を学習できます |
| 📅 川田スケジューラー | 学習計画の管理と川田からのメッセージ機能 |
| 📖 研究 | 研究コンテンツ。マトリックス背景＋縦型タイムラインで進捗や研究履歴を可視化 |

---

## 📁 ディレクトリ構成

```
kawastudy/
├── frontend/               # React frontend (separate)
│   ├── src/               # React source code
│   │   ├── App.js         # メインアプリケーション
│   │   ├── index.js       # エントリーポイント
│   │   ├── apps/          # アプリ別Reactコンポーネント
│   │   └── components/    # 共通コンポーネント
│   ├── public/            # Static assets
│   ├── package.json       # Frontend dependencies
│   └── webpack.config.js  # Build configuration
├── apps/                  # Django apps (backend)
│   ├── core/              # コア機能（ホームページ、プロフィール）
│   ├── typinggame/        # タイピングゲーム
│   ├── chatlesson/        # GPTとの会話勉強モード
│   ├── sqlquiz/           # SQLクイズ問題
│   ├── linuxfun/          # Linux基礎知識編
│   ├── aws/               # AWS学習モジュール
│   ├── cstudy/            # C言語学習
│   ├── scheduler/         # 川田スケジューラー
│   └── teacherstudy/         # 教師向け研究・学習アプリ
├── kawastudy/             # Django project settings
├── templates/             # Django templates
│   ├── base.html          # ベーステンプレート
│   └── components/        # 共通テンプレートコンポーネント
├── static/                # Backend static files
│   ├── css/               # スタイルシート
│   ├── js/                # JavaScript
│   └── img/               # 川田の表情画像など
├── manage.py              # Django management
├── requirements.txt       # Python dependencies
├── build.sh               # ビルドスクリプト
└── create_sample_stages.py # サンプルデータ生成
```

---

## 🚀 開発環境セットアップ

### 必要な環境
- Python 3.11+
- Node.js 16+
- Git

### バックエンド (Django)

```bash
git clone https://github.com/itsme03up/kawastudy.git
cd kawastudy

# Python仮想環境の設定
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 環境変数の設定（必要に応じて.envファイル作成）
# OPENAI_API_KEY=your_openai_api_key
# SECRET_KEY=your_secret_key

# データベースの準備
python manage.py migrate

# サンプルデータの生成（オプション）
python create_sample_stages.py

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

## 📱 アプリ詳細

### 🎮 かわ打（タイピングゲーム）
- 段階的な難易度設定
- 実時間スコア表示
- 川田からの応援メッセージ

### 💬 勉強（ChatGPT対話）
- OpenAI API連携
- 川田の個性的な話し方で学習サポート
- 様々な感情表現（cheerful, gentle, dry）

### 🧩 SQLクイズ
- ストーリー仕立ての問題構成
- 段階別の学習コース
- データベース知識を実践的に習得

### 🐧 楽しいLinux
- コマンド学習
- サーバー管理の基礎
- インタラクティブな実習環境

### ☁️ AWS学習
- AWSサービスの基礎概念
- 実践的なクラウド学習

### 💻 C言語学習
- プログラミング基礎
- コンパイル・実行環境

### 📅 川田スケジューラー
- 学習計画の管理
- 川田からの励ましメッセージ
- 学習統計とプログレス追跡
- ユーザー別のカスタマイズ可能な学習目標  

### 📖 研究
- 研究コンテンツ
- マトリックス背景＋縦型タイムラインで進捗や研究履歴を可視化

## 🎨 UIガイド

詳細なUIカスタマイズ方法は `UI_GUIDE.md` を参照してください。

🛠 使用技術

**バックエンド**
- Python 3.11+ / Django 4.2+
- SQLite（軽量なデータ保存）
- ChatGPT API（OpenAI）
- django-allauth（認証システム・Google OAuth2対応）
- WhiteNoise（静的ファイル配信）
- Gunicorn（WSGIサーバー）

**フロントエンド**
- React 18（モダンなUI コンポーネント）
- HTML / CSS / JavaScript（フォールバック対応）
- Bootstrap 5（レスポンシブUI）
- Webpack（モジュールバンドラー）
- Axios（HTTP通信）

**開発ツール**
- Babel（ES6+ トランスパイル）
- VS Code Tasks（ビルド自動化）
- dotenv（環境変数管理）

**認証・セキュリティ**
- Google OAuth2ログイン対応
- CSRF保護
- セッション管理

**デプロイメント**
- Render対応（本番環境）
- PostgreSQL対応（DATABASE_URL経由）

🎨 キャラクター：川田について
川田は理知的なIT講師。
黒縁メガネにオールバック、ポロシャツが特徴。
話し方は丁寧で控えめ、しかし誠実で情熱的です。

## 🔍 プロジェクト状態チェック

### ✅ 実装済み機能
- ✅ Django backend with 8 apps
- ✅ React frontend with Webpack
- ✅ Google OAuth2 authentication  
- ✅ SQLite database with migrations
- ✅ 川田キャラクターシステム（9種類の表情）
- ✅ レスポンシブUI（Bootstrap 5）
- ✅ スケジューラー機能
- ✅ ChatGPT連携

### ⚠️ 注意事項

#### マイグレーション不足
以下のアプリでモデルが定義されているが、マイグレーションファイルが不足している可能性があります：
- `apps.aws` - models.pyの確認が必要
- `apps.cstudy` - models.pyの確認が必要  
- `apps.linuxfun` - models.pyの確認が必要
- `apps.typinggame` - models.pyの確認が必要

#### 推奨対応
```bash
# 全アプリのマイグレーション確認・生成
python manage.py makemigrations
python manage.py migrate

# Django admin画面での管理設定確認
# apps/*/admin.py でモデル登録の確認
```

📄 ライセンス
MIT License
