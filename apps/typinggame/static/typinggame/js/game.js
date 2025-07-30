document.addEventListener('DOMContentLoaded', function() {
    const quoteText = document.getElementById('quote-text');
    const typingInput = document.getElementById('typing-input');
    
    // Array of Japanese quotes (can be expanded)
    const quotes = [
        '「君の未来に、我々の願いを重ねることが……許されるのなら」',
        '「知識は力なり、されど智慧こそ真の宝である」',
        '「困難は成長の階段である。一歩ずつ上がっていこう」',
        '「努力は必ず報われる。諦めない心が勝利への道筋だ」',
        '「プログラミングとは、論理的思考を形にする芸術である」'
    ];
    
    let currentQuote = '';
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
        let displayHTML = '';
        
        for (let i = 0; i < currentQuote.length; i++) {
            const char = currentQuote[i];
            
            if (i < currentPosition) {
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
