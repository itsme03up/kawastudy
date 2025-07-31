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
  const messagesEndRef = useRef(null);

  // メッセージエリアを自動スクロール
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    // 実際の実装ではChatGPT APIを呼び出す
    // ここではダミーレスポンスを返す
    await new Promise(resolve => setTimeout(resolve, 1500)); // 応答遅延をシミュレート
    
    const responses = [
      'それは興味深い質問ですね。詳しく説明させていただきます。',
      'なるほど、そのトピックについて一緒に考えてみましょう。',
      'とても良い着眼点です！その通りです。',
      'そのような疑問を持つことは、学習において非常に重要です。',
      'その問題について、段階的に解説してみますね。'
    ];
    
    return {
      text: responses[Math.floor(Math.random() * responses.length)]
    };
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
              src="/static/img/kawada.png" 
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
                  💬 川田先生との学習チャット
                  {kawadaMood === 'thinking' && (
                    <span className="ms-2">
                      <small>(考え中...)</small>
                    </span>
                  )}
                </h5>
                <button 
                  className="btn btn-outline-light btn-sm"
                  onClick={clearChat}
                  title="チャットをクリア"
                >
                  🗑️
                </button>
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
                      src="/static/img/kawada.png" 
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
