// チャット機能用Reactコンポーネント
import React from 'react';
import { createRoot } from 'react-dom/client';
import ChatInterface from './ChatInterface';

// チャットコンテナが存在する場合のみ初期化
const chatContainer = document.getElementById('chat-root');
if (chatContainer) {
  const root = createRoot(chatContainer);
  root.render(<ChatInterface />);
} else {
  console.error('Chat container not found: #chat-root');
}
