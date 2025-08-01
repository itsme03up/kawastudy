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
  const [kawadaMood, setKawadaMood] = useState('normal'); // normal, thinking, encouraging
  const [selectedCharacter, setSelectedCharacter] = useState('kawada'); // デフォルトは通常の川田
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
      // ChatGPT API または模擬応答
      const response = await sendChatMessage(inputMessage);
      
      const kawadaMessage = {
        id: Date.now() + 1,
        sender: 'kawada',
        text: response.text,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, kawadaMessage]);
      setKawadaMood('encouraging');
      
      // 一定時間後に通常モードに戻す
      setTimeout(() => setKawadaMood('normal'), 3000);
      
    } catch (error) {
      console.error('チャット送信エラー:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'kawada',
        text: 'すみません、少し調子が悪いようです。もう一度お話しいただけますか？',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
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
      
      // エラー時のフォールバック応答
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
        className={`d-flex mb-3 ${isKawada ? 'justify-content-start' : 'justify-content-end'}`}
      >
        {isKawada && (
          <div className="me-2">
            <img 
              src={getCurrentCharacterImage()} 
              alt="川田先生" 
              className="rounded-circle"
              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
            />
          </div>
        )}
        
        <div 
          className={`max-width-70 ${isKawada ? 'me-auto' : 'ms-auto'}`}
          style={{ maxWidth: '70%' }}
        >
          <div 
            className={`p-3 rounded-3 ${
              isKawada 
                ? 'bg-light border' 
                : 'bg-primary text-white'
            }`}
          >
            <div className="message-text">
              {message.text}
            </div>
            <small 
              className={`d-block mt-1 ${
                isKawada ? 'text-muted' : 'text-white-50'
              }`}
            >
              {message.timestamp.toLocaleTimeString('ja-JP', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </small>
          </div>
        </div>
        
        {!isKawada && (
          <div className="ms-2">
            <div 
              className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white"
              style={{ width: '40px', height: '40px' }}
            >
              You
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg" style={{ height: '600px' }}>
            {/* チャットヘッダー */}
            <div className="card-header bg-primary text-white">
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
                      className="btn btn-outline-light btn-sm"
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
                    className="btn btn-outline-light btn-sm"
                    onClick={clearChat}
                    title="チャットをクリア"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>

            {/* メッセージエリア */}
            <div 
              className="card-body overflow-auto"
              style={{ height: 'calc(100% - 140px)' }}
            >
              {messages.map(renderMessage)}
              
              {isLoading && (
                <div className="d-flex justify-content-start mb-3">
                  <div className="me-2">
                    <img 
                      src={getCurrentCharacterImage()} 
                      alt="川田先生" 
                      className="rounded-circle"
                      style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="bg-light border rounded-3 p-3">
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

            {/* 入力エリア */}
            <div className="card-footer bg-light">
              <div className="input-group">
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="質問や話したいことを入力してください... (Enterで送信、Shift+Enterで改行)"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                />
                <button 
                  className="btn btn-primary"
                  onClick={sendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                >
                  {isLoading ? (
                    <span className="spinner-border spinner-border-sm" />
                  ) : (
                    '送信'
                  )}
                </button>
              </div>
              <small className="text-muted mt-1 d-block">
                プログラミング、データベース、ネットワークなど、ITに関する質問をお気軽にどうぞ！
              </small>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .typing-indicator {
          display: flex;
          gap: 4px;
        }
        
        .typing-indicator span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #007bff;
          animation: typing 1.4s infinite ease-in-out;
        }
        
        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.5;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }
        
        .message-text {
          line-height: 1.5;
          word-wrap: break-word;
        }
      `}</style>
    </div>
  );
};

export default ChatInterface;
