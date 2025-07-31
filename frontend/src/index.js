// メインのReactエントリーポイント
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// メインアプリケーション用
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

// 共通コンポーネントのエクスポート
export { default as KawadaCharacter } from './components/KawadaCharacter';
export { default as ProgressCard } from './components/ProgressCard';
export { default as LearningStats } from './components/LearningStats';
