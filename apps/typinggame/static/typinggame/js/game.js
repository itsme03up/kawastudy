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
        
        // Check if input matches the expected Japanese text
        let matches = true;
        for (let i = 0; i < inputValue.length; i++) {
            if (currentPosition + i >= currentQuote.japanese.length || 
                inputValue[i] !== currentQuote.japanese[currentPosition + i]) {
                matches = false;
                break;
            }
        }
        
        if (matches) {
            // Input is correct so far
            e.target.style.backgroundColor = '';
            
            // Update position based on current input length
            const newPosition = currentPosition + inputValue.length;
            
            // Check if we've completed the quote
            if (newPosition >= currentQuote.japanese.length) {
                currentPosition = newPosition;
                finishGame();
                return;
            }
            
            // For Japanese input, we advance character by character as user types
            if (inputValue.length > 0) {
                // Clear input and advance position for each character
                const lastChar = inputValue[inputValue.length - 1];
                if (lastChar === currentQuote.japanese[currentPosition]) {
                    currentPosition++;
                    e.target.value = '';
                    updateDisplay();
                }
            }
        } else {
            // Wrong input
            errors++;
            e.target.style.backgroundColor = '#ff4444';
            setTimeout(() => {
                e.target.style.backgroundColor = '';
            }, 200);
            
            // Clear the input field on error
            e.target.value = '';
        }
    });
    
    // Handle composition events for Japanese input
    typingInput.addEventListener('compositionstart', function(e) {
        // Japanese input started
    });
    
    typingInput.addEventListener('compositionend', function(e) {
        // Japanese input finished, trigger input event
        const event = new Event('input', { bubbles: true });
        e.target.dispatchEvent(event);
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
