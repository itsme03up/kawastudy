// グローバルTTS設定
let globalTTSSettings = {
    autoTTS: true,
    pitch: 0.6,
    rate: 0.8
};

// すべての初期化を統合
document.addEventListener('DOMContentLoaded', function() {
    console.log('ページが読み込まれました');
    console.log('body classes:', document.body.className);
    
    // C言語学習ページの初期化
    if (document.body.classList.contains('cstudy-page')) {
        console.log('C言語学習ページを初期化します');
        console.log('lessonData:', lessonData);
        initCStudyPage();
        initNavigation();
        initCodeRunButtons();
    }
});

function initThemeToggle() {
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
}

function initFontSize() {
    const fontSizeSelect = document.getElementById('font-size');
    if (fontSizeSelect) {
        // 保存されたフォントサイズを復元
        const savedFontSize = localStorage.getItem('fontSize') || 'medium';
        fontSizeSelect.value = savedFontSize;
        changeFontSize();
        
        fontSizeSelect.addEventListener('change', changeFontSize);
    }
}

function initTTSSettings() {
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
}

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

function initCodeRunButtons() {
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
}

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
                // if (globalTTSSettings.autoTTS) {
                //     setTimeout(() => {
                //         speakKawadaComment(kawadaComment);
                //     }, 1000);
                // }
                
            }, 500);
        }, 800);
    }, 600);
}

// 川田のコメントを音声で読み上げる関数
// function speakKawadaComment(text) {
//     if ('speechSynthesis' in window && globalTTSSettings.autoTTS) {
//         const utterance = new SpeechSynthesisUtterance(text);
        
//         // 利用可能な音声から最適なものを選択
//         const voices = speechSynthesis.getVoices();
//         const japaneseVoice = voices.find(voice => 
//             voice.lang.includes('ja') || voice.name.includes('Japanese')
//         );
        
//         if (japaneseVoice) {
//             utterance.voice = japaneseVoice;
//         }
        
//         utterance.pitch = globalTTSSettings.pitch;
//         utterance.rate = globalTTSSettings.rate;
//         utterance.volume = 1.0;
        
//         speechSynthesis.speak(utterance);
//     }
// }

// ===== C言語学習ページの新機能 =====

// 学習レッスンデータ
const lessonData = {
    intro: {
        title: "📖 C言語について",
        content: `
            <h2>C言語とは？</h2>
            <p>C言語は1972年にデニス・リッチーによって開発されたプログラミング言語です。</p>
            <ul>
                <li>システムプログラミングに適している</li>
                <li>高速で効率的</li>
                <li>多くの言語の基礎となっている</li>
                <li>ハードウェアに近い制御が可能</li>
            </ul>
            <p>まずは簡単なプログラムから始めてみましょう！</p>
        `,
        kawadaComment: "C言語はプログラミングの基礎中の基礎です。しっかり学んで、コンピューターと仲良くなりましょう！"
    },
    hello: {
        title: "1️⃣ Hello World プログラム",
        code: `#include <stdio.h>

int main(void) {
    printf("Hello, World!\\n");
    return 0;
}`,
        content: `
            <h2>初めてのC言語プログラム</h2>
            <p>プログラミングの第一歩は「Hello World」を出力することです。下のコードを編集して実行してみましょう！</p>
            
            <div class="code-editor-section">
                <h3>📝 コードエディター</h3>
                <textarea id="code-editor-hello" class="code-editor" spellcheck="false"></textarea>
                <div class="editor-buttons">
                    <button class="reset-code-btn" onclick="resetCode('hello')">🔄 リセット</button>
                    <button class="try-run-button" onclick="runUserCode('hello')">▶️ 実行してみる</button>
                </div>
                <div id="output-hello" class="run-output"></div>
            </div>
            
            <div class="explanation-section">
                <h3>📚 解説</h3>
                <ul>
                    <li><code>#include &lt;stdio.h&gt;</code> - 標準入出力ライブラリを読み込み</li>
                    <li><code>int main(void)</code> - プログラムの開始点</li>
                    <li><code>printf()</code> - 文字列を出力する関数</li>
                    <li><code>return 0;</code> - プログラムの正常終了</li>
                </ul>
                
                <div class="tip-box">
                    <h4>💡 チャレンジ</h4>
                    <p>「Hello, World!」の部分を「こんにちは、世界！」に変更してみましょう。</p>
                </div>
            </div>
        `,
        kawadaComment: "おめでとうございます！最初のプログラムが動きましたね。printf関数は画面に文字を表示する魔法の呪文です！"
    },
    variables: {
        title: "2️⃣ 変数と計算",
        content: `
            <h2>変数を使った計算</h2>
            <p>変数は値を保存する「箱」のようなものです。</p>
            <pre><code>#include &lt;stdio.h&gt;

int main(void) {
    int a = 10;
    int b = 20;
    int sum = a + b;
    
    printf("a = %d, b = %d\\n", a, b);
    printf("a + b = %d\\n", sum);
    return 0;
}</code></pre>
            <button class="try-run-button" onclick="runCode('variables')">▶️ 実行してみる</button>
            <div id="output-variables" class="run-output"></div>
            
            <h3>解説</h3>
            <ul>
                <li><code>int</code> - 整数型の変数</li>
                <li><code>%d</code> - 整数を表示するフォーマット指定子</li>
                <li>変数は値を計算に使える</li>
            </ul>
        `,
        kawadaComment: "変数は料理のボウルのようなものです。材料（値）を入れて、混ぜ合わせて（計算して）、美味しい結果を作り出せます！"
    },
    input: {
        title: "3️⃣ 入力と出力",
        content: `
            <h2>ユーザーからの入力</h2>
            <p>scanf関数を使ってユーザーから値を入力してもらいましょう。</p>
            <pre><code>#include &lt;stdio.h&gt;

int main(void) {
    int number;
    
    printf("好きな数字を入力してください: ");
    scanf("%d", &number);
    
    printf("入力された数字は %d です\\n", number);
    printf("2倍すると %d になります\\n", number * 2);
    
    return 0;
}</code></pre>
            <button class="try-run-button" onclick="runCode('input')">▶️ 実行してみる</button>
            <div id="output-input" class="run-output"></div>
            
            <h3>解説</h3>
            <ul>
                <li><code>scanf()</code> - ユーザーからの入力を受け取る</li>
                <li><code>&number</code> - 変数のアドレスを指定</li>
                <li>インタラクティブなプログラムが作れる</li>
            </ul>
        `,
        kawadaComment: "入力機能があると、プログラムが会話できるようになります！ユーザーとコンピューターの架け橋ですね。"
    }
};

// 学習進捗管理
let studyProgress = {
    completedLessons: JSON.parse(localStorage.getItem('cstudy-completed') || '[]'),
    currentLesson: 'intro'
};

function initCStudyPage() {
    console.log('C言語学習ページを初期化中...');
    
    // 初期レッスンを表示
    showLesson('intro');
    updateProgressDisplay();
    
    // レッスンボタンのイベントリスナー
    const lessonButtons = document.querySelectorAll('.lesson-btn');
    console.log('レッスンボタンの数:', lessonButtons.length);
    
    lessonButtons.forEach((btn, index) => {
        console.log(`ボタン ${index + 1}:`, btn.getAttribute('data-lesson'));
        btn.addEventListener('click', function() {
            const lessonId = this.getAttribute('data-lesson');
            console.log('レッスンボタンがクリックされました:', lessonId);
            showLesson(lessonId);
            
            // アクティブ状態を更新
            document.querySelectorAll('.lesson-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function showLesson(lessonId) {
    console.log('レッスンを表示中:', lessonId);
    const lesson = lessonData[lessonId];
    if (!lesson) {
        console.error('レッスンが見つかりません:', lessonId);
        return;
    }
    
    console.log('レッスンデータ:', lesson);
    studyProgress.currentLesson = lessonId;
    
    // コンテンツエリアを更新
    const contentArea = document.getElementById('lesson-content');
    if (contentArea) {
        contentArea.innerHTML = lesson.content;
        console.log('コンテンツエリアを更新しました');
    } else {
        console.error('lesson-contentエリアが見つかりません');
    }
    
    // 川田のコメントを更新
    const kawadaComment = document.getElementById('kawada-comment');
    if (kawadaComment) {
        kawadaComment.innerHTML = `<p>${lesson.kawadaComment}</p>`;
        console.log('川田のコメントを更新しました');
    } else {
        console.error('kawada-commentエリアが見つかりません');
    }
    
    // コードエディターにデフォルトコードを設定
    if (lesson.code) {
        const editor = document.getElementById(`code-editor-${lessonId}`);
        if (editor) {
            editor.value = lesson.code;
        }
    }
    
    // 川田のコメントを音声で読み上げ
    if (globalTTSSettings.autoTTS) {
        setTimeout(() => {
            speakKawadaComment(lesson.kawadaComment);
        }, 500);
    }
}

// ユーザーのコードを実行する関数
function runUserCode(lessonId) {
    const editor = document.getElementById(`code-editor-${lessonId}`);
    const outputElement = document.getElementById(`output-${lessonId}`);
    const button = document.querySelector(`button[onclick="runUserCode('${lessonId}')"]`);
    
    if (!editor || !outputElement || !button) return;
    
    const userCode = editor.value.trim();
    if (!userCode) {
        alert('コードを入力してください！');
        return;
    }
    
    // ボタンを無効化
    button.disabled = true;
    button.textContent = '⏳ 実行中...';
    
    // 出力エリアを表示
    outputElement.style.display = 'block';
    outputElement.textContent = 'コンパイルしています...\n';
    
    // シミュレーション
    setTimeout(() => {
        outputElement.textContent += '$ gcc -o program program.c\n';
        
        setTimeout(() => {
            outputElement.textContent += '$ ./program\n';
            
            setTimeout(() => {
                let result = simulateCodeExecution(lessonId, userCode);
                
                outputElement.textContent += result.output;
                outputElement.textContent += '\n✅ プログラムが正常に終了しました (終了コード: 0)';
                
                // ボタンを復活
                button.disabled = false;
                button.textContent = '▶️ 実行してみる';
                
                // レッスン完了処理
                markLessonCompleted(lessonId);
                
                // 川田の成功コメント
                if (globalTTSSettings.autoTTS) {
                    setTimeout(() => {
                        speakKawadaComment(result.kawadaComment);
                    }, 1000);
                }
                
            }, 600);
        }, 800);
    }, 500);
}

// コードリセット関数
function resetCode(lessonId) {
    const lesson = lessonData[lessonId];
    const editor = document.getElementById(`code-editor-${lessonId}`);
    
    if (lesson && lesson.code && editor) {
        editor.value = lesson.code;
        
        if (globalTTSSettings.autoTTS) {
            speakKawadaComment('コードをリセットしました。また挑戦してみてくださいね！');
        }
    }
}

// コード実行シミュレーション
function simulateCodeExecution(lessonId, userCode) {
    let output = '';
    let kawadaComment = '';
    
    // 簡単なパターンマッチングでアウトプットを予測
    if (userCode.includes('printf') && userCode.includes('Hello')) {
        output = 'Hello, World!\n';
        kawadaComment = '素晴らしい！Hello Worldプログラムが動きました！';
    } else if (userCode.includes('printf') && userCode.includes('こんにちは')) {
        output = 'こんにちは、世界！\n';
        kawadaComment = '日本語での出力、ナイスです！';
    } else if (userCode.includes('int') && userCode.includes('+')) {
        output = 'a = 10, b = 20\na + b = 30\n';
        kawadaComment = '計算プログラムが正常に動作しています！算数は得意ですね。';
    } else if (userCode.includes('scanf')) {
        output = '好きな数字を入力してください: 42\n入力された数字は 42 です\n2倍すると 84 になります\n';
        kawadaComment = '入力プログラムが完璧です！ユーザーとの対話ができていますね。';
    } else if (userCode.includes('printf')) {
        output = '(カスタム出力)\n';
        kawadaComment = 'おお、独自のプログラムを作りましたね！創造性が光っています！';
    } else {
        output = 'プログラムを実行しました。\n';
        kawadaComment = 'コードが実行されました。さらなる改善を目指しましょう！';
    }
    
    return { output, kawadaComment };
}

// ===== C言語学習ページのナビゲーション機能 =====

function initNavigation() {
    if (document.body.classList.contains('cstudy-page')) {
        initLearningNavigation();
    }
}

function initLearningNavigation() {
    // 進捗表示の初期化
    updateProgressDisplay();
    
    // 目次リンクのイベントリスナー
    document.querySelectorAll('.toc-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');
            scrollToSection(targetSection);
            updateCurrentSection(targetSection);
        });
    });
    
    // セクションナビゲーションボタン
    document.querySelectorAll('.prev-section-btn, .next-section-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-target');
            scrollToSection(targetSection);
            updateCurrentSection(targetSection);
        });
    });
    
    // 完了ボタン
    document.querySelectorAll('.mark-complete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            toggleSectionComplete(section);
        });
        
        // 既に完了済みの場合の表示更新
        const section = btn.getAttribute('data-section');
        if (studyProgress.completedLessons.includes(section)) {
            btn.textContent = '✅ 完了済み';
            btn.classList.add('completed');
        }
    });
    
    // スクロール監視
    setupScrollSpy();
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function updateCurrentSection(sectionId) {
    studyProgress.currentLesson = sectionId;
    
    // 目次の現在セクション表示を更新
    document.querySelectorAll('.toc-link').forEach(link => {
        link.classList.remove('current');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('current');
        }
    });
}

function toggleSectionComplete(sectionId) {
    const index = studyProgress.completedLessons.indexOf(sectionId);
    const btn = document.querySelector(`[data-section="${sectionId}"]`);
    
    if (index === -1) {
        // 完了に設定
        studyProgress.completedLessons.push(sectionId);
        btn.textContent = '✅ 完了済み';
        btn.classList.add('completed');
        
        // 川田のコメント
        if (globalTTSSettings.autoTTS) {
            setTimeout(() => {
                speakKawadaComment('お疲れ様です！このセクションを完了しましたね。順調な学習ペースです！');
            }, 500);
        }
    } else {
        // 完了を取り消し
        studyProgress.completedLessons.splice(index, 1);
        btn.textContent = '✅ 完了にする';
        btn.classList.remove('completed');
    }
    
    // 進捗を保存・更新
    localStorage.setItem('cstudy-completed', JSON.stringify(studyProgress.completedLessons));
    updateProgressDisplay();
    updateTOCCompletion();
}

function updateProgressDisplay() {
    const totalSections = 4; // intro, lesson1, lesson2, kawada-comment
    const completedCount = studyProgress.completedLessons.length;
    const percentage = Math.round((completedCount / totalSections) * 100);
    
    const progressBar = document.getElementById('learning-progress-bar');
    const progressText = document.getElementById('progress-text');
    
    if (progressBar && progressText) {
        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `進捗: ${percentage}% (${completedCount}/${totalSections})`;
    }
}

function updateTOCCompletion() {
    document.querySelectorAll('.toc-link').forEach(link => {
        const section = link.getAttribute('data-section');
        if (studyProgress.completedLessons.includes(section)) {
            link.classList.add('completed');
        } else {
            link.classList.remove('completed');
        }
    });
}

function setupScrollSpy() {
    const sections = ['intro', 'lesson1', 'lesson2', 'kawada-comment'];
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                if (sections.includes(sectionId)) {
                    updateCurrentSection(sectionId);
                }
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-120px 0px -50% 0px'
    });
    
    sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
            observer.observe(element);
        }
    });
}

// ===== メイン初期化 =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('ページが読み込まれました');
    console.log('body classes:', document.body.className);
    
    // C言語学習ページの初期化
    if (document.body.classList.contains('cstudy-page')) {
        console.log('C言語学習ページを初期化します');
        console.log('lessonData:', lessonData);
        initCStudyPage();
        initNavigation();
        initCodeRunButtons();
    }
});
