# Kawada Study 共通UI システム

このプロジェクトの共通UIシステムの使用方法について説明します。

## 📁 ファイル構成

```
templates/
├── base.html                    # ベーステンプレート
├── components/
│   ├── navigation.html         # ナビゲーションバー
│   ├── sidebar.html           # サイドバー（川田キャラクター含む）
│   └── footer.html            # フッター
├── core/
│   └── home.html              # ホームページ
└── [app_name]/
    └── *.html                 # 各アプリのテンプレート

static/
├── css/
│   └── style.css              # 共通スタイル（958行の包括的スタイル）
├── js/
│   ├── base.js                # 共通JavaScript
│   ├── base-reorganized.js    # リファクタリング版
│   └── kawada-scheduler.js    # スケジューラー専用JS
└── img/
    ├── kawada-default.png     # 川田の基本表情
    ├── kawada-cheerful.png    # 明るい表情
    ├── kawada-gentle.png      # 優しい表情
    ├── kawada-thinking.png    # 考える表情
    ├── kawada-smile.png       # 笑顔
    ├── kawada-angry.png       # 怒り表情
    ├── kawada-normal.png      # 通常表情
    └── kawada-sam.png         # 特別表情
```

## 🎨 レイアウトシステム

### 基本レイアウト構造

kawastudyは固定ヘッダー・サイドバー・フッターの3カラムレイアウトを採用しています：

```
┌─────────────────────────────────┐
│          Navigation Bar         │  (固定ヘッダー、56px)
├─────────┬───────────────────────┤
│         │                       │
│Sidebar  │    Main Content       │  (スクロール可能エリア)
│(250px)  │                       │
│         │                       │
├─────────┴───────────────────────┤
│             Footer              │  (固定フッター、56px)
└─────────────────────────────────┘
```

### CSSレイアウトクラス

```css
.main-layout          # フレックスボックスのメインコンテナ
.sidebar-fixed        # 250px固定幅サイドバー
.sidebar-content      # サイドバー内コンテンツ（スクロール対応）
.main-content         # メインコンテンツエリア
.character-area       # 川田キャラクター表示エリア
```

## 🎭 川田キャラクターシステム

### 表情画像の種類と用途

| 画像ファイル | 用途 | 説明 |
|-------------|------|------|
| `kawada-default.png` | デフォルト | 基本的な表情 |
| `kawada-cheerful.png` | 成功・お祝い | 明るく喜んでいる表情 |
| `kawada-gentle.png` | 癒し・励まし | 優しく微笑む表情 |
| `kawada-thinking.png` | 考え中・解説 | 深く考えている表情 |
| `kawada-smile.png` | 通常の喜び | 穏やかな笑顔 |
| `kawada-angry.png` | 間違い・注意 | 少し困った表情 |
| `kawada-normal.png` | 中立 | 感情のない状態 |
| `kawada-sam.png` | 特別 | 特別なシーン用 |

### 表情の使い分け

```html
<!-- 成功時 -->
<img src="{% static 'img/kawada-cheerful.png' %}" alt="川田" class="kawada-character">

<!-- 説明時 -->
<img src="{% static 'img/kawada-thinking.png' %}" alt="川田" class="kawada-character">

<!-- 励まし時 -->
<img src="{% static 'img/kawada-gentle.png' %}" alt="川田" class="kawada-character">
```

## 🧭 ナビゲーション・認証システム

### アプリのURL設定

各アプリの `urls.py` に `app_name` を設定：

```python
# apps/your_app/urls.py
from django.urls import path
from . import views

app_name = 'your_app'  # 重要！

urlpatterns = [
    path('', views.index, name='index'),
]
```

### 現在のアプリ一覧とURL

| アプリ名 | URL | app_name | 説明 |
|---------|-----|----------|------|
| ホーム | `/` | core | メインダッシュボード |
| タイピング | `/typing/` | typinggame | かわ打ゲーム |
| チャット学習 | `/chat/` | chatlesson | ChatGPT対話学習 |
| SQLクイズ | `/sqlquiz/` | sqlquiz | SQL問題練習 |
| Linux学習 | `/linux/` | linuxfun | Linux基礎 |
| AWS学習 | `/aws/` | aws | AWS学習 |
| C言語学習 | `/cstudy/` | cstudy | C言語基礎 |
| スケジューラー | `/schedule/` | scheduler | 川田スケジューラー |

### 認証機能（django-allauth）

```html
<!-- ログイン状態の確認 -->
{% if user.is_authenticated %}
    <p>こんにちは、{{ user.username }}さん</p>
    <a href="{% url 'account_logout' %}">ログアウト</a>
{% else %}
    <a href="{% url 'account_login' %}">ログイン</a>
    <a href="{% url 'account_signup' %}">新規登録</a>
{% endif %}

<!-- Google OAuth2ログイン -->
{% load socialaccount %}
<a href="{% provider_login_url 'google' %}">Googleでログイン</a>
```

### アクティブな状態の表示

現在のアプリが自動的にハイライトされます。`request.resolver_match.app_name` で判定。

## 🎯 ベーステンプレートの使用方法

### 1. 基本的な使用方法

```html
{% extends 'base.html' %}

{% block title %}ページタイトル{% endblock %}

{% block content %}
<div class="container">
    <h1>ページコンテンツ</h1>
</div>
{% endblock %}
```

### 2. 追加CSS/JavaScriptの読み込み

```html
{% extends 'base.html' %}

{% block extra_css %}
<link rel="stylesheet" href="{% static 'app_name/css/custom.css' %}">
<style>
    .custom-class { color: red; }
</style>
{% endblock %}

{% block extra_js %}
<script src="{% static 'app_name/js/custom.js' %}"></script>
<script>
    // インラインJavaScript
</script>
{% endblock %}
```

## 🎨 利用可能なCSSクラス

### グリッドシステム
```html
<div class="container">
    <div class="row">
        <div class="col-6">半分</div>
        <div class="col-6">半分</div>
    </div>
</div>
```

### カードコンポーネント
```html
<div class="card">
    <div class="card-header">
        <h3 class="card-title">タイトル</h3>
    </div>
    <div class="card-body">
        コンテンツ
    </div>
</div>
```

### ボタン
```html
<button class="btn btn-primary">メインボタン</button>
<button class="btn btn-success">成功ボタン</button>
<button class="btn btn-warning">警告ボタン</button>
<button class="btn btn-danger">危険ボタン</button>
```

### フォーム
```html
<form>
    <div class="form-group">
        <label class="form-label">ラベル</label>
        <input type="text" class="form-control" placeholder="入力してください">
    </div>
</form>
```

### ユーティリティクラス
```html
<!-- テキスト配置 -->
<div class="text-center">中央</div>
<div class="text-left">左</div>
<div class="text-right">右</div>

<!-- マージン -->
<div class="mt-3">上マージン</div>
<div class="mb-3">下マージン</div>

<!-- パディング -->
<div class="p-3">全方向パディング</div>

<!-- アニメーション -->
<div class="fade-in">フェードイン</div>
<div class="slide-in">スライドイン</div>
```

## 📊 データモデル

### 主要なモデル構造

#### スケジューラー（apps.scheduler）
```python
# 学習スケジュール
class Schedule(models.Model):
    user = models.ForeignKey(User)
    title = models.CharField(max_length=200)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    is_completed = models.BooleanField(default=False)

# 川田からのメッセージ
class Message(models.Model):
    user = models.ForeignKey(User)
    message_type = models.CharField(max_length=20)  # encouragement, reminder, etc.
    content = models.TextField()
    is_read = models.BooleanField(default=False)

# ユーザー統計
class UserStats(models.Model):
    user = models.OneToOneField(User)
    total_study_hours = models.DecimalField()
    current_streak = models.IntegerField()
    longest_streak = models.IntegerField()

# 学習セッション
class StudySession(models.Model):
    user = models.ForeignKey(User)
    app_name = models.CharField(max_length=50)
    duration_minutes = models.IntegerField()
    completed_at = models.DateTimeField()
```

#### チャット学習（apps.chatlesson）
```python
# チャットセッション
class ChatSession(models.Model):
    user = models.ForeignKey(User)
    title = models.CharField(max_length=200)
    mood = models.CharField(max_length=20)  # cheerful, gentle, dry
    created_at = models.DateTimeField(auto_now_add=True)

# チャットメッセージ
class ChatMessage(models.Model):
    session = models.ForeignKey(ChatSession)
    sender = models.CharField(max_length=20)  # user, kawada
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
```

#### SQLクイズ（apps.sqlquiz）
```python
# クイズステージ
class QuizStage(models.Model):
    stage_number = models.IntegerField()
    title = models.CharField(max_length=200)
    kawada_image = models.CharField(max_length=100)
    story_text = models.TextField()

# クイズ問題
class Quiz(models.Model):
    stage = models.ForeignKey(QuizStage)
    question_text = models.TextField()
    correct_sql = models.TextField()
    explanation = models.TextField()
```

## ⚙️ テーマ・設定機能

### ダークモード
- ナビゲーションバーの⚙️ボタンから切り替え
- `localStorage` に保存されて次回も適用

### フォントサイズ
- 小・中・大の3段階
- `localStorage` に保存

### カスタムプロパティ（CSS変数）
```css
:root {
    --primary-color: #2c3e50;
    --secondary-color: #34495e;
    --accent-color: #3498db;
    --text-color: #333;
    --bg-color: #f8f9fa;
    --card-bg: #ffffff;
}

[data-theme="dark"] {
    --text-color: #e8e8e8;
    --bg-color: #121212;
    --card-bg: #1e1e1e;
}
```

## 🔧 JavaScript ユーティリティ

### 通知表示
```javascript
showNotification('メッセージ', 'success'); // 成功
showNotification('エラー', 'error');       // エラー
showNotification('情報', 'info');          // 情報
```

### ローディング表示
```javascript
showLoading('#content');
hideLoading('#content', '新しいコンテンツ');
```

### ローカルストレージ
```javascript
saveToLocalStorage('key', data);
const data = loadFromLocalStorage('key', defaultValue);
```

### フォームバリデーション
```javascript
const isValid = validateForm(document.getElementById('my-form'));
```

## 📱 レスポンシブデザイン

- モバイル：480px以下
- タブレット：768px以下
- デスクトップ：768px以上

グリッドシステムは自動的にモバイルで縦並びになります。

## 🎨 カスタマイズ方法

### 1. 追加のCSS変数を定義
```css
:root {
    --custom-color: #your-color;
}
```

### 2. 新しいコンポーネントクラス
```css
.my-component {
    background-color: var(--card-bg);
    border: 1px solid var(--border-color);
    /* ... */
}
```

### 3. アプリ固有のスタイル
```html
{% block extra_css %}
<style>
    .app-specific-style {
        /* アプリ固有のスタイル */
    }
</style>
{% endblock %}
```

## 🚀 新しいアプリの追加手順

1. **Djangoアプリの作成**
```bash
python manage.py startapp apps/your_app
```

2. **設定ファイルに追加**
```python
# kawastudy/settings.py
INSTALLED_APPS = [
    # ...existing apps...
    'apps.your_app',
]
```

3. **URLの設定**
```python
# apps/your_app/urls.py
from django.urls import path
from . import views

app_name = 'your_app'  # 重要！

urlpatterns = [
    path('', views.index, name='index'),
]

# kawastudy/urls.py
urlpatterns = [
    # ...existing patterns...
    path('your_app/', include('apps.your_app.urls')),
]
```

4. **テンプレートの作成**
```html
<!-- apps/your_app/templates/your_app/index.html -->
{% extends 'base.html' %}

{% block title %}Your App{% endblock %}

{% block content %}
<div class="container">
    <h1>Your App Content</h1>
</div>
{% endblock %}
```

5. **ナビゲーションに追加**（必要に応じて）
```html
<!-- templates/components/navigation.html に追加 -->
<li class="nav-item">
    <a class="nav-link {% if request.resolver_match.app_name == 'your_app' %}active{% endif %}" 
       href="{% url 'your_app:index' %}">Your App</a>
</li>
```

## 🔧 開発時の注意点

### 1. 静的ファイルの管理
- 開発時: `STATICFILES_DIRS` で管理
- 本番時: `collectstatic` で `STATIC_ROOT` に収集
- WhiteNoiseによる効率的な配信

### 2. データベース
- 開発時: SQLite
- 本番時: PostgreSQL（DATABASE_URL環境変数経由）

### 3. 環境変数
```bash
# .env ファイル例
SECRET_KEY=your-secret-key
OPENAI_API_KEY=your-openai-api-key
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3
```

### 4. マイグレーション
```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. React連携
- Webpackによるバンドル
- Django静的ファイルとして配信
- 開発時はホットリロード対応