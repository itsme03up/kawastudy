document.addEventListener('DOMContentLoaded', function() {
    const quoteText = document.getElementById('quote-text');
    const romajiText = document.getElementById('romaji-text');
    const typingInput = document.getElementById('typing-input');
    
    // Array of Japanese quotes with their romaji
    const quotes = [
        {
            japanese: '「君の未来に、我々の願いを重ねることが……許されるのなら」',
            romaji: 'kimi no mirai ni, wareware no negai wo kasaneru koto ga... yurusareru no nara'
        },
        {
            japanese: '「知識は力なり、されど智慧こそ真の宝である」',
            romaji: 'chishiki ha chikara nari, saredo chie koso shin no takara de aru'
        },
        {
            japanese: '「困難は成長の階段である。一歩ずつ上がっていこう」',
            romaji: 'konnan ha seichou no kaidan de aru. ippozutsu agatte ikou'
        },
        {
            japanese: '「努力は必ず報われる。諦めない心が勝利への道筋だ」',
            romaji: 'doryoku ha kanarazu mukuwareru. akiramenai kokoro ga shouri e no michisuji da'
        },
        {
            japanese: '「プログラミングとは、論理的思考を形にする芸術である」',
            romaji: 'puroguramingu to ha, ronriteki shikou wo katachi ni suru geijutsu de aru'
        }
    ];
    
    let currentQuote = null;
    let currentPosition = 0;
    let startTime = null;
    let errors = 0;
    let inputBuffer = '';
    
    // Initialize game
    function initGame() {
        currentQuote = quotes[Math.floor(Math.random() * quotes.length)];
        currentPosition = 0;
        errors = 0;
        startTime = null;
        inputBuffer = '';
        
        updateDisplay();
        typingInput.value = '';
        typingInput.focus();
    }
    
    // Update the display with highlighted characters
    function updateDisplay() {
        // Update Japanese text
        let japaneseHTML = '';
        for (let i = 0; i < currentQuote.japanese.length; i++) {
            const char = currentQuote.japanese[i];
            japaneseHTML += `<span class="pending">${char}</span>`;
        }
        quoteText.innerHTML = japaneseHTML;
        
        // Update romaji text with highlighting
        let romajiHTML = '';
        for (let i = 0; i < currentQuote.romaji.length; i++) {
            const char = currentQuote.romaji[i];
            
            if (i < currentPosition) {
                romajiHTML += `<span class="correct">${char}</span>`;
            } else if (i === currentPosition) {
                romajiHTML += `<span class="current">${char}</span>`;
            } else {
                romajiHTML += `<span class="pending">${char}</span>`;
            }
        }
        romajiText.innerHTML = romajiHTML;
    }
    
    // Handle typing input
    typingInput.addEventListener('input', function(e) {
        if (startTime === null) {
            startTime = new Date().getTime();
        }
        
        const inputValue = e.target.value.toLowerCase();
        
        // Check if input matches the expected text at current position
        let matches = true;
        for (let i = 0; i < inputValue.length; i++) {
            if (currentPosition + i >= currentQuote.romaji.length || 
                inputValue[i] !== currentQuote.romaji[currentPosition + i]) {
                matches = false;
                break;
            }
        }
        
        if (matches) {
            // Input is correct so far
            e.target.style.backgroundColor = '';
            
            // Check if we should advance (space or punctuation triggers advancement)
            const nextChar = currentQuote.romaji[currentPosition + inputValue.length];
            if (inputValue.endsWith(' ') || inputValue.endsWith('.') || inputValue.endsWith(',') || 
                inputValue.endsWith('!') || inputValue.endsWith('?') || inputValue.endsWith('...')) {
                
                // Advance position
                currentPosition += inputValue.length;
                e.target.value = '';
                
                if (currentPosition >= currentQuote.romaji.length) {
                    finishGame();
                } else {
                    updateDisplay();
                }
            } else if (nextChar === ' ' || nextChar === '.' || nextChar === ',' || 
                      nextChar === '!' || nextChar === '?' || !nextChar) {
                // Auto-advance when we've typed a complete word
                currentPosition += inputValue.length;
                e.target.value = '';
                
                if (currentPosition >= currentQuote.romaji.length) {
                    finishGame();
                } else {
                    updateDisplay();
                }
            }
        } else {
            // Wrong input
            errors++;
            e.target.style.backgroundColor = '#ff4444';
            setTimeout(() => {
                if (matches || e.target.value === '') {
                    e.target.style.backgroundColor = '';
                }
            }, 200);
        }
    });
    
    // Handle backspace to allow corrections
    typingInput.addEventListener('keydown', function(e) {
        if (e.key === 'Backspace' && e.target.value === '' && currentPosition > 0) {
            // Allow backspace to previous word
            let newPosition = currentPosition - 1;
            while (newPosition > 0 && currentQuote.romaji[newPosition] !== ' ') {
                newPosition--;
            }
            if (currentQuote.romaji[newPosition] === ' ') {
                newPosition++;
            }
            currentPosition = newPosition;
            updateDisplay();
        }
    });
    
    // Finish game and show results
    function finishGame() {
        const endTime = new Date().getTime();
        const timeElapsed = (endTime - startTime) / 1000; // in seconds
        const wpm = Math.round((currentQuote.romaji.length / 5) / (timeElapsed / 60));
        const accuracy = Math.round(((currentQuote.romaji.length - errors) / currentQuote.romaji.length) * 100);
        
        romajiText.innerHTML = `
            <div style="text-align: center; color: #4CAF50;">
                <h2>完了！</h2>
                <p>時間: ${timeElapsed.toFixed(1)}秒</p>
                <p>WPM: ${wpm}</p>
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
        
        typingInput.style.display = 'none';
    }
    
    // Start the game
    initGame();
});
