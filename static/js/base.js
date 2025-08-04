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

// グローバルTTS設定
let globalTTSSettings = {
    autoTTS: true,
    pitch: 0.6,
    rate: 0.8
};

// TTS設定の初期化
document.addEventListener('DOMContentLoaded', function() {
    // 保存された設定を復元
    const savedSettings = localStorage.getItem('ttsSettings');
    if (savedSettings) {
        globalTTSSettings = JSON.parse(savedSettings);
    }
    
    // UI要素の初期化
    const autoTTSCheckbox = document.getElementById('global-auto-tts');
    const pitchSlider = document.getElementById('global-pitch');
    const rateSlider = document.getElementById('global-rate');
    const pitchValue = document.getElementById('global-pitch-value');
    const rateValue = document.getElementById('global-rate-value');
    
    if (autoTTSCheckbox) {
        autoTTSCheckbox.checked = globalTTSSettings.autoTTS;
        autoTTSCheckbox.addEventListener('change', function() {
            globalTTSSettings.autoTTS = this.checked;
            saveTTSSettings();
        });
    }
    
    if (pitchSlider) {
        pitchSlider.value = globalTTSSettings.pitch;
        pitchValue.textContent = globalTTSSettings.pitch;
        pitchSlider.addEventListener('input', function() {
            globalTTSSettings.pitch = parseFloat(this.value);
            pitchValue.textContent = this.value;
            saveTTSSettings();
        });
    }
    
    if (rateSlider) {
        rateSlider.value = globalTTSSettings.rate;
        rateValue.textContent = globalTTSSettings.rate;
        rateSlider.addEventListener('input', function() {
            globalTTSSettings.rate = parseFloat(this.value);
            rateValue.textContent = this.value;
            saveTTSSettings();
        });
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

function saveTTSSettings() {
    localStorage.setItem('ttsSettings', JSON.stringify(globalTTSSettings));
}

function testGlobalVoice() {
    if ('speechSynthesis' in window) {
        const testText = "川田です。音声のテストをしています。設定は正常に動作しています。";
        const utterance = new SpeechSynthesisUtterance(testText);
        
        // 利用可能な音声から最適なものを選択
        const voices = speechSynthesis.getVoices();
        const japaneseVoice = voices.find(voice => 
            voice.lang.includes('ja') || voice.name.includes('Japanese')
        );
        
        if (japaneseVoice) {
            utterance.voice = japaneseVoice;
        }
        
        utterance.pitch = globalTTSSettings.pitch;
        utterance.rate = globalTTSSettings.rate;
        utterance.volume = 1.0;
        
        speechSynthesis.speak(utterance);
    } else {
        alert('お使いのブラウザは音声合成に対応していません。');
    }
}

// グローバルTTS設定を取得する関数（他のページから使用可能）
function getGlobalTTSSettings() {
    return globalTTSSettings;
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

// C言語学習ページ専用機能
document.addEventListener('DOMContentLoaded', function() {
    // C言語コード実行ボタンの処理
    const tryRunButton = document.getElementById('try-run');
    if (tryRunButton) {
        tryRunButton.addEventListener('click', function() {
            runCCode('try-run', 'run-output', 1);
        });
    }
    
    const tryRunButton2 = document.getElementById('try-run-2');
    if (tryRunButton2) {
        tryRunButton2.addEventListener('click', function() {
            runCCode('try-run-2', 'run-output-2', 2);
        });
    }
});

// C言語コードを実行する関数（シミュレーション）
function runCCode(buttonId, outputId, exampleNumber) {
    const outputElement = document.getElementById(outputId);
    if (!outputElement) return;
    
    // ボタンを無効化
    const button = document.getElementById(buttonId);
    if (button) {
        button.disabled = true;
        button.textContent = '実行中...';
    }
    
    // 実行開始メッセージ
    outputElement.textContent = 'コンパイル中...\n';
    outputElement.style.display = 'block';
    
    // 実際のコンパイル・実行をシミュレート
    setTimeout(() => {
        outputElement.textContent += 'gcc -o example example.c\n';
        
        setTimeout(() => {
            outputElement.textContent += './example\n';
            
            setTimeout(() => {
                let result = '';
                let kawadaComment = '';
                
                if (exampleNumber === 1) {
                    result = 'こんにちは、C言語！\n';
                    kawadaComment = 'おお、見事に動きましたね！完璧です！';
                } else if (exampleNumber === 2) {
                    result = 'a = 10, b = 20\na + b = 30\n';
                    kawadaComment = '変数と計算、バッチリですね！プログラミングの基本が身についています！';
                }
                
                outputElement.textContent += result;
                outputElement.textContent += '\nプログラムが正常に終了しました。（終了コード：0）';
                
                // ボタンを復活
                if (button) {
                    button.disabled = false;
                    button.textContent = 'このコードを試す';
                }
                
                // 川田のコメントを音声で読み上げ（TTS設定に従う）
                if (globalTTSSettings.autoTTS) {
                    setTimeout(() => {
                        speakKawadaComment(kawadaComment);
                    }, 1000);
                }
                
            }, 500);
        }, 800);
    }, 600);
}

// 川田のコメントを音声で読み上げる関数
function speakKawadaComment(text) {
    if ('speechSynthesis' in window && globalTTSSettings.autoTTS) {
        const utterance = new SpeechSynthesisUtterance(text);
        
        // 利用可能な音声から最適なものを選択
        const voices = speechSynthesis.getVoices();
        const japaneseVoice = voices.find(voice => 
            voice.lang.includes('ja') || voice.name.includes('Japanese')
        );
        
        if (japaneseVoice) {
            utterance.voice = japaneseVoice;
        }
        
        utterance.pitch = globalTTSSettings.pitch;
        utterance.rate = globalTTSSettings.rate;
        utterance.volume = 1.0;
        
        speechSynthesis.speak(utterance);
    }
}
