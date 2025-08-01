// チャット機能用Reactコンポーネント
import React from 'react';
import ReactDOM from 'react-dom';
import ChatInterface from './ChatInterface';

// React 18 と React 17 両方に対応
const chatContainer = document.getElementById('chat-root');
if (chatContainer) {
  try {
    // React 18 の createRoot を試す
    if (ReactDOM.createRoot) {
      const { createRoot } = ReactDOM;
      const root = createRoot(chatContainer);
      root.render(<ChatInterface />);
      console.log('✅ Using React 18 createRoot');
    } else {
      // React 17 以前のレンダリング方式にフォールバック
      ReactDOM.render(<ChatInterface />, chatContainer);
      console.log('✅ Using React 17 ReactDOM.render');
    }
  } catch (error) {
    console.error('❌ React rendering error:', error);
    // 最後の手段として直接的なレンダリングを試す
    try {
      ReactDOM.render(<ChatInterface />, chatContainer);
      console.log('✅ Fallback to ReactDOM.render succeeded');
    } catch (fallbackError) {
      console.error('❌ Fallback rendering also failed:', fallbackError);
    }
  }
} else {
  console.error('❌ Chat container not found: #chat-root');
}
