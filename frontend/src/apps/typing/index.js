// タイピングゲーム用Reactコンポーネント
import React from 'react';
import { createRoot } from 'react-dom/client';
import TypingGame from './TypingGame';

console.log('🔥 typing/index.js file loaded!');

// タイピングゲームコンテナが存在する場合のみ初期化
const typingContainer = document.getElementById('react-typing-game');
console.log('🔥 Container search result:', typingContainer);

if (typingContainer) {
  console.log('🔥 Container found, creating React root...');
  const root = createRoot(typingContainer);
  
  // Django から渡されたデータを取得
  const questionsData = window.typingQuestionsData || [];
  const initialQuestion = window.typingInitialQuestion || null;
  
  console.log('🔥 About to render TypingGame with:', {
    questionsData: questionsData.length,
    initialQuestion: initialQuestion
  });
  
  root.render(
    <TypingGame 
      questions={questionsData} 
      initialQuestion={initialQuestion}
    />
  );
  
  console.log('🔥 TypingGame rendered successfully!');
} else {
  console.error('🔥 Container #react-typing-game not found!');
}
