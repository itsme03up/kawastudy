// ----------------------------------------
// DOM要素の取得
// ----------------------------------------
const panel = document.getElementById('panel');
const header = document.getElementById('header');
const questionNumberEl = document.getElementById('question-number');
const totalQuestionsEl = document.getElementById('total-questions');
const timeEl = document.getElementById('time');
const wpmEl = document.getElementById('wpm');
const accuracyEl = document.getElementById('accuracy');
const textDisplay = document.getElementById('text-display');
const romajiDisplay = document.getElementById('romaji-display');
const overlay = document.getElementById('overlay');
const message = document.getElementById('message');

// ----------------------------------------
// グローバル変数
// ----------------------------------------
let currentQuestionIndex = 0;
let typedRomaji = '';
let totalTypedCount = 0;
let totalMissCount = 0;
let startTime;
let timerId;
let isPlaying = false;
const GAME_TIME_LIMIT = 60; // 制限時間（秒）

// ----------------------------------------
// 初期化処理
// ----------------------------------------
document.addEventListener('DOMContentLoaded', init);

function init() {
    // 状態変数をリセット
    currentQuestionIndex = 0;
    typedRomaji = '';
    totalTypedCount = 0;
    totalMissCount = 0;
    isPlaying = false;
    clearInterval(timerId);

    // UIを初期状態に設定
    totalQuestionsEl.textContent = questions.length;
    timeEl.textContent = GAME_TIME_LIMIT.toFixed(1);
    wpmEl.textContent = '0';
    accuracyEl.textContent = '0.00';
    message.textContent = '';
    overlay.style.display = 'block';
    
    setQuestion(currentQuestionIndex);
}

// ----------------------------------------
// 問題設定
// ----------------------------------------
function setQuestion(index) {
    if (index >= questions.length) {
        endGame();
        return;
    }
    const q = questions[index];
    
    // 日本語表示を初期化
    const textDisplay = document.getElementById('text-display');
    textDisplay.innerHTML = `<span>${q.japanese}</span>`;

    // ローマ字表示を初期化
    romajiDisplay.innerHTML = `<span>${q.romaji}</span>`;

    // 問題番号更新
    questionNumberEl.textContent = index + 1;

    // 入力済みローマ字をリセット
    typedRomaji = '';
}

// ----------------------------------------
// イベントリスナー
// ----------------------------------------
document.addEventListener('keydown', handleKeyDown);

function handleKeyDown(e) {
    if (e.isComposing) return;

    // ゲーム開始 (スペースキー)
    if (!isPlaying && e.code === 'Space') {
        e.preventDefault();
        startGame();
        return;
    }

    if (!isPlaying) return;

    // アルファベットキーのみを処理
    if (e.key.length === 1 && e.key.match(/[a-z]/i)) {
        e.preventDefault();
        checkInput(e.key);
    }
}

// ----------------------------------------
// ゲームロジック
// ----------------------------------------
function startGame() {
    isPlaying = true;
    startTime = Date.now();
    overlay.style.display = 'none';
    startTimer();
}

function startTimer() {
    timerId = setInterval(() => {
        const elapsedTime = (Date.now() - startTime) / 1000;
        const remainingTime = GAME_TIME_LIMIT - elapsedTime;

        if (remainingTime <= 0) {
            timeEl.textContent = '0.0';
            endGame();
        } else {
            timeEl.textContent = remainingTime.toFixed(1);
            updateStats();
        }
    }, 100);
}

function checkInput(key) {
    const currentQuestion = questions[currentQuestionIndex];
    const targetRomaji = currentQuestion.romaji;
    const expectedChar = targetRomaji[typedRomaji.length];

    if (key === expectedChar) {
        // 正解
        typedRomaji += key;
        totalTypedCount++;

        // ローマ字表示を更新（文字ごとに色分け）
        updateRomajiDisplay(targetRomaji, typedRomaji);

        // 対応する日本語部分を移動（色分けも追加）
        const progress = typedRomaji.length / targetRomaji.length;
        const jpLen = currentQuestion.japanese.length;
        const jpDoneLen = Math.floor(jpLen * progress);
        
        updateJapaneseDisplay(currentQuestion.japanese, jpDoneLen);

        // 問題をクリアした場合
        if (typedRomaji === targetRomaji) {
            nextQuestion();
        }
    } else {
        // 不正解
        totalMissCount++;
        panel.classList.add('shake');
        setTimeout(() => panel.classList.remove('shake'), 100);
    }
    updateStats();
}

// ローマ字表示を更新する関数（正しく入力された文字を緑色で表示）
function updateRomajiDisplay(targetRomaji, typedRomaji) {
    let html = '';
    
    // 入力済みの文字を緑色で表示
    for (let i = 0; i < typedRomaji.length; i++) {
        html += `<span style="color: #28a745;">${typedRomaji[i]}</span>`;
    }
    
    // 未入力の文字を通常色で表示
    const remaining = targetRomaji.substring(typedRomaji.length);
    html += `<span>${remaining}</span>`;
    
    // romajiDisplayに表示
    romajiDisplay.innerHTML = html;
}

// 日本語表示を更新する関数（正しく入力された部分を緑色で表示）
function updateJapaneseDisplay(japanese, doneLength) {
    const textDisplay = document.getElementById('text-display');
    let html = '';
    
    // 入力済みの文字を緑色で表示
    const donePart = japanese.substring(0, doneLength);
    if (donePart) {
        html += `<span style="color: #28a745;">${donePart}</span>`;
    }
    
    // 未入力の文字を通常色で表示
    const remainingPart = japanese.substring(doneLength);
    if (remainingPart) {
        html += `<span>${remainingPart}</span>`;
    }
    
    textDisplay.innerHTML = html;
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex >= questions.length) {
        endGame();
    } else {
        setQuestion(currentQuestionIndex);
    }
}

function endGame() {
    if (!isPlaying) return; // 既に終了している場合は何もしない
    
    isPlaying = false;
    clearInterval(timerId);
    
    const elapsedTime = (Date.now() - startTime) / 1000;
    const finalWpm = calculateWPM(totalTypedCount, elapsedTime);
    const finalAccuracy = calculateAccuracy(totalTypedCount, totalMissCount);

    wpmEl.textContent = finalWpm;
    accuracyEl.textContent = finalAccuracy.toFixed(2);

    message.innerHTML = `終了！ WPM: ${finalWpm}, 正解率: ${finalAccuracy.toFixed(2)}% <br> スペースキーでリトライ`;
    overlay.style.display = 'block';
    
    // リトライのためにkeydownイベントを再度リッスンするが、
    // init()を呼ぶことでリセットされるので、ここでは何もしなくて良い。
    // 次のスペースキー押下でinit()が呼ばれ、再度ゲームが開始される準備が整う。
    document.removeEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', restartHandler);
}

function restartHandler(e) {
    if (e.code === 'Space') {
        e.preventDefault();
        document.removeEventListener('keydown', restartHandler);
        init(); // ゲームをリセットして初期化
        document.addEventListener('keydown', handleKeyDown); // 元のハンドラを再設定
    }
}

// ----------------------------------------
// 統計計算
// ----------------------------------------
function updateStats() {
    const elapsedTime = (Date.now() - startTime) / 1000;
    if (elapsedTime === 0) return;

    // WPMの計算
    const wpm = calculateWPM(totalTypedCount, elapsedTime);
    wpmEl.textContent = wpm;

    // 正解率の計算
    const accuracy = calculateAccuracy(totalTypedCount, totalMissCount);
    accuracyEl.textContent = accuracy.toFixed(2);
}

function calculateWPM(typed, timeInSeconds) {
    if (timeInSeconds === 0) return 0;
    // 1文字1ワードと見なす
    return Math.round((typed / timeInSeconds) * 60);
}

function calculateAccuracy(typed, missed) {
    const total = typed + missed;
    if (total === 0) return 0.00;
    return (typed / total) * 100;
}
