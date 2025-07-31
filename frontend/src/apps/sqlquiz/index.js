// SQLクイズ用Reactコンポーネント
import React from 'react';
import { createRoot } from 'react-dom/client';
import SQLQuizGame from './SQLQuizGame';

// SQLクイズコンテナが存在する場合のみ初期化
const sqlContainer = document.getElementById('react-sql-quiz');
if (sqlContainer) {
  const root = createRoot(sqlContainer);
  
  // Django から渡されたデータを取得
  const stageData = window.sqlStageData || {};
  const stageNumber = window.sqlStageNumber || 1;
  
  root.render(
    <SQLQuizGame 
      stageData={stageData}
      stageNumber={stageNumber}
    />
  );
}
