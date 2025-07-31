// メインのReactエントリーポイント
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// メインアプリケーション用
const mainContainer = document.getElementById('react-main');
if (mainContainer) {
  const root = createRoot(mainContainer);
  root.render(<App />);
}

// 共通コンポーネントのエクスポート
export { default as KawadaCharacter } from './components/KawadaCharacter';
export { default as ProgressCard } from './components/ProgressCard';
export { default as LearningStats } from './components/LearningStats';
