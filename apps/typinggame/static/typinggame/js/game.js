document.addEventListener('DOMContentLoaded', function() {
    const quoteText = document.getElementById('quote-text');
    const romajiText = document.getElementById('romaji-text');
    const typingInput = document.getElementById('typing-input');
    
    const quotes = [
        {
            japanese: '君の未来に、我々の願いを重ねることが……許されるのなら',
            romaji: 'kimi no mirai ni, wareware no negai wo kasaneru koto ga... yurusareru no nara'
        },
        {
            japanese: '知識は力なり、されど智慧こそ真の宝である',
            romaji: 'chishiki ha chikara nari, saredo chie koso shin no takara de aru'
        },
        {
            japanese: '困難は成長の階段である。一歩ずつ上がっていこう',
            romaji: 'konnan ha seichou no kaidan de aru. ippozutsu agatte ikou'
        },
        {
            japanese: '努力は必ず報われる。諦めない心が勝利への道筋だ',
            romaji: 'doryoku ha kanarazu mukuwareru. akiramenai kokoro ga shouri e no michisuji da'
        },
        {
            japanese: 'プログラミングとは、論理的思考を形にする芸術である',
            romaji: 'puroguramingu to ha, ronriteki shikou wo katachi ni suru geijutsu de aru'
        }
    ];
    
    let currentQuote = null;
    let currentPosition = 0;
    let startTime = null;
    let errors = 0;
    let isComposing = false;

    function initGame() {
        currentQuote = quotes[Math.floor(Math.random() * quotes.length)];
        currentPosition = 0;
        errors = 0;
        startTime = null;
        isComposing = false;
        
        updateDisplay();
        typingInput.value = '';
        typingInput.disabled = false;
        typingInput.focus();
    }
    
    function updateDisplay() {
        let japaneseHTML = '';
        for (let i = 0; i < currentQuote.japanese.length; i++) {
            const char = currentQuote.japanese[i];
            if (i < currentPosition) {
                japaneseHTML += `<span class="correct">${char}</span>`;
            } else if (i === currentPosition) {
                japaneseHTML += `<span class="current">${char}</span>`;
            } else {
                japaneseHTML += `<span class="pending">${char}</span>`;
            }
        }
        quoteText.innerHTML = japaneseHTML;
        romajiText.innerHTML = currentQuote.romaji;
    }

    // 入力処理をこの関数に集約
    function processInput(inputValue) {
        if (!inputValue) return;

        if (startTime === null) {
            startTime = new Date().getTime();
        }

        for (const char of inputValue) {
            const expectedChar = currentQuote.japanese[currentPosition];
            if (char === expectedChar) {
                currentPosition++;
            } else {
                errors++;
                typingInput.style.backgroundColor = '#ff4444';
                setTimeout(() => {
                    typingInput.style.backgroundColor = '';
                }, 300);
                break; 
            }
        }
        
        typingInput.value = '';

        if (currentPosition >= currentQuote.japanese.length) {
            finishGame();
        } else {
            updateDisplay();
        }
    }

    // IME変換開始
    typingInput.addEventListener('compositionstart', () => {
        isComposing = true;
    });

    // IME変換確定
    typingInput.addEventListener('compositionend', (e) => {
        isComposing = false;
        processInput(e.data); // 確定した文字で判定
    });

    // 直接入力（ローマ字など）
    typingInput.addEventListener('input', (e) => {
        if (isComposing) {
            return; // 変換中は無視
        }
        processInput(e.target.value);
    });

    function finishGame() {
        typingInput.disabled = true;
        const endTime = new Date().getTime();
        const timeElapsed = (endTime - startTime) / 1000;
        const japaneseWPM = Math.round(currentQuote.japanese.length / (timeElapsed / 60));
        const accuracy = Math.max(0, Math.round(((currentQuote.japanese.length - errors) / currentQuote.japanese.length) * 100));
        
        quoteText.innerHTML = `
            <div style="text-align: center; color: #4CAF50;">
                <h2>完了！</h2>
                <p>時間: ${timeElapsed.toFixed(1)}秒</p>
                <p>文字/分: ${japaneseWPM}</p>
                <p>正確性: ${accuracy}%</p>
                <p>エラー数: ${errors}</p>
                <button onclick="location.reload()" style="
                    padding: 10px 20px; 
                    font-size: 1.2rem; 
                    background: #4CAF50; 
                    color: white; 
                    border: none; 
                    border-radius: 5px; 
                    cursor: pointer;
                    margin-top: 20px;
                ">もう一度</button>
            </div>
        `;
        romajiText.innerHTML = '';
        typingInput.style.display = 'none';
    }
    
    initGame();
});
