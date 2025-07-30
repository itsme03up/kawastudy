# Kawada Study 共通UI システム

このプロジェクトの共通UIシステムの使用方法について説明します。

## 📁 ファイル構成

```
templates/
├── base.html                    # ベーステンプレート
├── components/
│   ├── navigation.html         # ナビゲーションバー
│   └── footer.html            # フッター
├── core/
│   └── home.html              # ホームページ例
└── typinggame/
    └── index.html             # タイピングゲーム例

static/
├── css/
│   └── base.css               # 共通スタイル
└── js/
    └── base.js                # 共通JavaScript
```

## 🎨 ベーステンプレートの使用方法

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

## 🧭 ナビゲーションシステム

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

### アクティブな状態の表示

現在のアプリが自動的にハイライトされます。`request.resolver_match.app_name` で判定。

## 🎯 利用可能なCSSクラス

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

1. `apps/your_app/urls.py` に `app_name` を設定
2. `kawastudy/urls.py` に新しいアプリのURLを追加
3. テンプレートで `{% extends 'base.html' %}` を使用
4. 必要に応じて `templates/components/navigation.html` にリンクを追加

これで統一されたUIでアプリを開発できます！
