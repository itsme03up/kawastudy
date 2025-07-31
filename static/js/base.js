// 共通JavaScript機能
document.addEventListener('DOMContentLoaded', function() {
    // ダークモード切り替え
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        // 保存されたテーマを復元
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.checked = true;
        }
        
        themeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            }
        });
    }
    
    // フォントサイズ変更
    const fontSizeSelect = document.getElementById('font-size');
    if (fontSizeSelect) {
        // 保存されたフォントサイズを復元
        const savedFontSize = localStorage.getItem('fontSize') || 'medium';
        fontSizeSelect.value = savedFontSize;
        changeFontSize();
        
        fontSizeSelect.addEventListener('change', changeFontSize);
    }
});

function changeFontSize() {
    const fontSizeSelect = document.getElementById('font-size');
    if (!fontSizeSelect) return;
    
    const size = fontSizeSelect.value;
    document.documentElement.className = document.documentElement.className.replace(/font-size-\w+/g, '');
    document.documentElement.classList.add(`font-size-${size}`);
    localStorage.setItem('fontSize', size);
}

// CSS変数でフォントサイズを設定
const style = document.createElement('style');
style.textContent = `
    :root {
        --font-size-multiplier: 1;
    }
    
    .font-size-small {
        --font-size-multiplier: 0.9;
    }
    
    .font-size-medium {
        --font-size-multiplier: 1;
    }
    
    .font-size-large {
        --font-size-multiplier: 1.1;
    }
    
    body {
        font-size: calc(1rem * var(--font-size-multiplier));
    }
    
    [data-theme="dark"] {
        --bs-body-bg: #121212;
        --bs-body-color: #e8e8e8;
        --bs-card-bg: #1e1e1e;
        --bs-border-color: #404040;
    }
    
    [data-theme="dark"] .card {
        background-color: var(--bs-card-bg);
        border-color: var(--bs-border-color);
        color: var(--bs-body-color);
    }
    
    [data-theme="dark"] .navbar-light {
        background-color: #1e1e1e !important;
        border-bottom: 1px solid var(--bs-border-color);
    }
    
    [data-theme="dark"] .navbar-light .navbar-brand,
    [data-theme="dark"] .navbar-light .nav-link {
        color: var(--bs-body-color) !important;
    }
`;
document.head.appendChild(style);
