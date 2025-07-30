document.addEventListener('DOMContentLoaded', function() {
    const quoteText = document.getElementById('quote-text');
    const romajiText = document.getElementById('romaji-text');
    const typingInput = document.getElementById('typing-input');
    
    // Array of Japanese quotes with their romaji
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
    
    // Initialize game
    function initGame() {
        currentQuote = quotes[Math.floor(Math.random() * quotes.length)];
        currentPosition = 0;
        errors = 0;
        startTime = null;
        
        updateDisplay();
        typingInput.value = '';
        typingInput.focus();
    }
    
    // Update the display with highlighted characters
    function updateDisplay() {
        // Update Japanese text with highlighting
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
        
        // Update romaji text (for reference only)
        romajiText.innerHTML = currentQuote.romaji;
    }
    
    // Handle typing input
    typingInput.addEventListener('input', function(e) {
        if (startTime === null) {
            startTime = new Date().getTime();
        }
        
        const inputValue = e.target.value;
        
        // Skip processing during composition (Japanese input)
        if (isComposing) {
            return;
        }
        
        if (inputValue.length === 0) {
            return;
        }
        
        // Get the last character typed
        const lastChar = inputValue[inputValue.length - 1];
        const expectedChar = currentQuote.japanese[currentPosition];
        
        if (lastChar === expectedChar) {
            // Correct character
            currentPosition++;
            e.target.value = '';
            e.target.style.backgroundColor = '';
            
            // Check if we've completed the quote
            if (currentPosition >= currentQuote.japanese.length) {
                finishGame();
                return;
            }
            
            updateDisplay();
        } else {
            // Wrong character
            errors++;
            e.target.style.backgroundColor = '#ff4444';
            e.target.value = '';
            
            setTimeout(() => {
                e.target.style.backgroundColor = '';
            }, 300);
        }
    });
    
    // Handle composition events for Japanese input
    let isComposing = false;
    
    typingInput.addEventListener('compositionstart', function(e) {
        isComposing = true;
    });
    
    typingInput.addEventListener('compositionend', function(e) {
        isComposing = false;
        // Process the finalized Japanese input
        const event = new Event('input', { bubbles: true });
        event.isComposing = false;
        e.target.dispatchEvent(event);
    });
    
    // Update input event to check composition state
    typingInput.addEventListener('beforeinput', function(e) {
        if (isComposing) {
            return;
        }
    });
    
    // Finish game and show results
    function finishGame() {
        const endTime = new Date().getTime();
        const timeElapsed = (endTime - startTime) / 1000;
        
        // 日本語向けWPM計算：1文字 = 1語として計算
        // 英語の標準的な1語=5文字の概念を日本語では1文字=1語に変更
        const japaneseWPM = Math.round(currentQuote.japanese.length / (timeElapsed / 60));
        
        // 正確性計算：負の値にならないように修正
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
    
    // Start the game
    initGame();
});
