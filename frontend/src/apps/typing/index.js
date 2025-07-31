// タイピングゲーム用Reactコンポーネント
import React from 'react';
import { createRoot } from 'react-dom/client';
import TypingGame from './TypingGame';

// タイピングゲームコンテナが存在する場合のみ初期化
const typingContainer = document.getElementById('react-typing-game');
if (typingContainer) {
  const root = createRoot(typingContainer);
  
  // Django から渡されたデータを取得
  const questionsData = window.typingQuestionsData || [];
  const initialQuestion = window.typingInitialQuestion || null;
  
  root.render(
    <TypingGame 
      questions={questionsData} 
      initialQuestion={initialQuestion}
    />
  );
}
