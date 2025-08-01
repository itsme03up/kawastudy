import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'kawada',
      text: 'こんにちは！川田です。今日はどのような勉強をしたいですか？',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [kawadaMood, setKawadaMood] = useState('normal');
  const [selectedCharacter, setSelectedCharacter] = useState('kawada');
  const [showCharacterSelector, setShowCharacterSelector] = useState(false);
  const messagesEndRef = useRef(null);

  // キャラクター画像の選択肢
  const characterOptions = [
    { id: 'kawada', name: '川田（デフォルト）', image: '/static/img/kawada.png' },
    { id: 'kawada-normal', name: '川田（ドライ）', image: '/static/img/kawada-normal.png' },
    { id: 'kawada-cheerful', name: '川田（明るい）', image: '/static/img/kawada-cheerful.png' },
    { id: 'kawada-gentle', name: '川田（優しい）', image: '/static/img/kawada-gentle.png' },
    { id: 'kawada-thinking', name: '川田（考え中）', image: '/static/img/kawada-thinking.png' }
  ];

  // メッセージエリアを自動スクロール
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ローカルストレージからキャラクター設定を読み込み
  useEffect(() => {
    const savedCharacter = localStorage.getItem('selectedCharacter');
    if (savedCharacter && characterOptions.find(char => char.id === savedCharacter)) {
      setSelectedCharacter(savedCharacter);
      setTimeout(() => updateLeftPanelCharacter(savedCharacter), 100);
    }
  }, []);

  // キャラクターセレクター外クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCharacterSelector && !event.target.closest('.character-selector')) {
        setShowCharacterSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCharacterSelector]);

  // キャラクター変更時にローカルストレージに保存
  const handleCharacterChange = (characterId) => {
    setSelectedCharacter(characterId);
    localStorage.setItem('selectedCharacter', characterId);
    setShowCharacterSelector(false);
    updateLeftPanelCharacter(characterId);
  };

  // 現在選択されているキャラクターの情報を取得
  const getCurrentCharacter = () => {
    return characterOptions.find(char => char.id === selectedCharacter) || characterOptions[0];
  };

  // 現在選択されているキャラクターの画像パスを取得
  const getCurrentCharacterImage = () => {
    const character = getCurrentCharacter();
    return character.image;
  };

  // 左側パネルのキャラクター表示を更新
  const updateLeftPanelCharacter = (characterId) => {
    const character = characterOptions.find(char => char.id === characterId) || characterOptions[0];
    
    const characterImage = document.getElementById('character-image');
    const characterName = document.getElementById('character-name');
    
    if (characterImage) {
      characterImage.src = character.image;
      characterImage.alt = character.name;
    }
    
    if (characterName) {
      characterName.textContent = character.name.replace('川田（', '').replace('）', '');
    }
  };

  // メッセージ送信
  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setKawadaMood('thinking');

    try {
      const response = await sendChatMessage(inputMessage);
      
      const kawadaMessage = {
        id: Date.now() + 1,
        sender: 'kawada',
        text: response.text,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, kawadaMessage]);
      setKawadaMood('normal');
    } catch (error) {
      console.error('Failed to send message:', error);
      setKawadaMood('normal');
    } finally {
      setIsLoading(false);
    }
  };

  // チャットメッセージ送信（API呼び出し）
  const sendChatMessage = async (message) => {
    try {
      const response = await axios.post('/chat/api/', {
        message: message,
        character: selectedCharacter
      }, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]')?.value || ''
        }
      });
      
      return {
        text: response.data.reply
      };
    } catch (error) {
      console.error('Chat API Error:', error);
      
      const fallbackResponses = [
        '申し訳ありません。少し調子が悪いようです。',
        'エラーが発生しました。しばらく経ってから再試行してください。',
        '川田、今回は上手く答えられませんでした。'
      ];
      
      return {
        text: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
      };
    }
  };

  // Enterキーでメッセージ送信
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // クリア機能
  const clearChat = () => {
    setMessages([
      {
        id: 1,
        sender: 'kawada',
        text: '新しい話題を始めましょう。何について学びたいですか？',
        timestamp: new Date()
      }
    ]);
  };

  // メッセージの表示
  const renderMessage = (message) => {
    const isKawada = message.sender === 'kawada';
    
    return (
      <div 
        key={message.id}
        className={`message-wrapper ${isKawada ? 'bot' : 'user'} mb-3`}
      >
        {isKawada ? (
          <div className="chat-bubble bot-message">
            <div className="message-text">
              {message.text}
            </div>
            <small className="text-muted d-block mt-1">
              {message.timestamp.toLocaleTimeString('ja-JP', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </small>
          </div>
        ) : (
          <div className="d-flex justify-content-end">
            <div className="chat-bubble user-message">
              <div className="message-text">
                {message.text}
              </div>
              <small className="d-block mt-1" style={{ opacity: 0.7 }}>
                {message.timestamp.toLocaleTimeString('ja-JP', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </small>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="chat-container h-100 d-flex flex-column">
      <div className="card-header bg-white border-bottom">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            💬 {getCurrentCharacter().name}との学習チャット
            {kawadaMood === 'thinking' && (
              <span className="ms-2">
                <small>(考え中...)</small>
              </span>
            )}
          </h5>
          <div className="d-flex gap-2">
            <div className="position-relative character-selector">
              <button 
                className="btn btn-outline-primary btn-sm"
                onClick={() => setShowCharacterSelector(!showCharacterSelector)}
                title="キャラクター選択"
              >
                🎭
              </button>
              
              {showCharacterSelector && (
                <div 
                  className="position-absolute bg-white border rounded shadow-sm p-2"
                  style={{ 
                    top: '100%', 
                    right: '0', 
                    zIndex: 1000, 
                    minWidth: '200px',
                    marginTop: '5px'
                  }}
                >
                  <div className="text-dark small mb-2 fw-bold">キャラクター選択</div>
                  {characterOptions.map(character => (
                    <button
                      key={character.id}
                      className={`btn btn-sm w-100 mb-1 d-flex align-items-center ${
                        selectedCharacter === character.id 
                          ? 'btn-primary' 
                          : 'btn-outline-secondary'
                      }`}
                      onClick={() => handleCharacterChange(character.id)}
                    >
                      <img 
                        src={character.image} 
                        alt={character.name}
                        className="rounded-circle me-2"
                        style={{ width: '20px', height: '20px', objectFit: 'cover' }}
                      />
                      <small>{character.name}</small>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button 
              className="btn btn-outline-secondary btn-sm"
              onClick={clearChat}
              title="チャットをクリア"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

      <div 
        className="flex-grow-1 overflow-auto p-3"
        style={{ 
          background: 'linear-gradient(to bottom, #e9eff5, #d5e0f0)'
        }}
      >
        {messages.map(renderMessage)}
        
        {isLoading && (
          <div className="message-wrapper bot mb-3">
            <div className="chat-bubble bot-message">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div 
        className="border-top bg-light p-3"
        style={{ 
          boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
        }}
      >
        <div className="input-group">
          <textarea
            className="form-control chat-input"
            rows="2"
            placeholder="メッセージを入力... (Enterで送信、Shift+Enterで改行)"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <button 
            className="btn send-button ms-2"
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
          >
            {isLoading ? (
              <span className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">送信中...</span>
              </span>
            ) : (
              '送信'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;