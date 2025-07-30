document.addEventListener('DOMContentLoaded', function() {
    const quoteText = document.getElementById('quote-text');
    const romajiText = document.getElementById('romaji-text');
    const typingInput = document.getElementById('typing-input');
    
    // Array of Japanese quotes with their romaji
    const quotes = [
        {
            japanese: '君に出来ないことを僕は出来るかもしれない。',
            romaji: 'kimi ni dekinai koto wo boku ha dekiru kamo shirenai.'
        },
        {
            japanese: '俺がガンダムだ！',
            romaji: 'ore ga gandamu da!'
        },
        {
            japanese: '君はどうしたいんだい。',
            romaji: 'kimi ha dou shitain dai.'
        },
        {
            japanese: '見せてもらおうか。',
            romaji: 'misete moraou ka.'
        },
        {
            japanese: '当たらなければ、どうという事はない！',
            romaji: 'ataranakereha, dou to iu koto ha nai!'
        },
        {
            japanese: 'あなたは私の光。',
            romaji: 'anata ha watashi no hikari.'
        },
        {
            japanese: '命なんて安いものだ。',
            romaji: 'inochi nante yasui mono da.'
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
                // Already typed correctly
                romajiHTML += `<span class="correct">${char}</span>`;
            } else if (i === currentPosition) {
                // Current character to type
                romajiHTML += `<span class="current">${char}</span>`;
            } else {
                // Not yet typed
                romajiHTML += `<span class="pending">${char}</span>`;
            }
        }
        
        romajiText.innerHTML = romajiHTML;
    }
                // Already typed correctly
                displayHTML += `<span class="correct">${char}</span>`;
            } else if (i === currentPosition) {
                // Current character to type
                displayHTML += `<span class="current">${char}</span>`;
            } else {
                // Not yet typed
                displayHTML += `<span class="pending">${char}</span>`;
            }
        }
        
        quoteText.innerHTML = displayHTML;
    }
    
    // Handle typing input
    typingInput.addEventListener('input', function(e) {
        if (startTime === null) {
            startTime = new Date().getTime();
        }
        
        const inputValue = e.target.value;
        const expectedChar = currentQuote[currentPosition];
        const typedChar = inputValue[inputValue.length - 1];
        
        if (typedChar === expectedChar) {
            currentPosition++;
            e.target.value = '';
            
            if (currentPosition >= currentQuote.length) {
                // Quote completed
                finishGame();
            } else {
                updateDisplay();
            }
        } else if (typedChar) {
            // Wrong character
            errors++;
            e.target.style.backgroundColor = '#ff4444';
            setTimeout(() => {
                e.target.style.backgroundColor = '';
            }, 200);
        }
    });
    
    // Finish game and show results
    function finishGame() {
        const endTime = new Date().getTime();
        const timeElapsed = (endTime - startTime) / 1000; // in seconds
        const wpm = Math.round((currentQuote.length / 5) / (timeElapsed / 60));
        const accuracy = Math.round(((currentQuote.length - errors) / currentQuote.length) * 100);
        
        quoteText.innerHTML = `
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
