import React, { useState, useEffect } from 'react';

const KawadaCharacter = ({ mood = 'normal', message = '' }) => {
  const [currentMessage, setCurrentMessage] = useState(message);
  const [isVisible, setIsVisible] = useState(false);

  const messages = {
    normal: [
      '今日も一緒に勉強しましょう！',
      '少しずつでも続けることが大切ですね。',
      'あなたのペースで大丈夫です。'
    ],
    encouraging: [
      'とても良い調子ですね！',
      'この調子で頑張っていきましょう！',
      '素晴らしい成果です！'
    ],
    thinking: [
      'なるほど、興味深い質問ですね...',
      '一緒に考えてみましょう。',
      'それについて説明させていただきますね。'
    ]
  };

  useEffect(() => {
    if (!message) {
      const moodMessages = messages[mood] || messages.normal;
      const randomMessage = moodMessages[Math.floor(Math.random() * moodMessages.length)];
      setCurrentMessage(randomMessage);
    } else {
      setCurrentMessage(message);
    }
    
    setIsVisible(true);
  }, [mood, message]);

  const handleCharacterClick = () => {
    const moodMessages = messages[mood] || messages.normal;
    const randomMessage = moodMessages[Math.floor(Math.random() * moodMessages.length)];
    setCurrentMessage(randomMessage);
  };

  return (
    <div className={`kawada-character ${isVisible ? 'fade-in' : ''}`}>
      <div className="character-container" onClick={handleCharacterClick}>
        <div className="character-image">
          <img 
            src="/static/img/kawada.png" 
            alt="川田先生" 
            className="kawada-img"
            style={{ 
              width: '120px', 
              height: 'auto',
              borderRadius: '50%',
              border: '3px solid #007bff',
              cursor: 'pointer',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          />
        </div>
        <div className="speech-bubble">
          <div className="speech-content">
            {currentMessage}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .kawada-character {
          position: fixed;
          bottom: 100px;
          right: 30px;
          z-index: 1000;
          opacity: 0;
          transition: opacity 0.5s ease;
        }
        
        .kawada-character.fade-in {
          opacity: 1;
        }
        
        .character-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 200px;
        }
        
        .speech-bubble {
          background: white;
          border: 2px solid #007bff;
          border-radius: 15px;
          padding: 12px 16px;
          margin-bottom: 10px;
          position: relative;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          max-width: 180px;
        }
        
        .speech-bubble::after {
          content: '';
          position: absolute;
          bottom: -12px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 12px solid transparent;
          border-right: 12px solid transparent;
          border-top: 12px solid #007bff;
        }
        
        .speech-bubble::before {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 10px solid white;
        }
        
        .speech-content {
          font-size: 14px;
          color: #333;
          line-height: 1.4;
          text-align: center;
        }
        
        @media (max-width: 768px) {
          .kawada-character {
            bottom: 80px;
            right: 15px;
          }
          
          .character-image img {
            width: 80px !important;
          }
          
          .speech-bubble {
            max-width: 140px;
            padding: 8px 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default KawadaCharacter;
