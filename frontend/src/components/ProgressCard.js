import React, { useState, useEffect } from 'react';

const ProgressCard = () => {
  const [progress, setProgress] = useState({
    typing: 0,
    sql: 0,
    linux: 0
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // プログレスデータを取得（実際の実装では API からデータを取得）
    const fetchProgress = async () => {
      try {
        // ダミーデータ（実際の実装では API エンドポイントからデータを取得）
        const data = {
          typing: 75,
          sql: 50,
          linux: 25
        };
        
        // アニメーション効果のために段階的に更新
        setProgress({ typing: 0, sql: 0, linux: 0 });
        setIsLoading(false);
        
        setTimeout(() => setProgress(prev => ({ ...prev, typing: data.typing })), 300);
        setTimeout(() => setProgress(prev => ({ ...prev, sql: data.sql })), 600);
        setTimeout(() => setProgress(prev => ({ ...prev, linux: data.linux })), 900);
        
      } catch (error) {
        console.error('プログレスデータの取得に失敗:', error);
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const getProgressColor = (value) => {
    if (value >= 75) return 'success';
    if (value >= 50) return 'info';
    if (value >= 25) return 'warning';
    return 'danger';
  };

  const ProgressBar = ({ label, value, icon }) => (
    <div className="mb-3">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <span className="fw-medium">
          {icon} {label}
        </span>
        <span className="text-muted small">{value}%</span>
      </div>
      <div className="progress" style={{ height: '8px' }}>
        <div 
          className={`progress-bar bg-${getProgressColor(value)}`}
          role="progressbar" 
          style={{ 
            width: `${value}%`,
            transition: 'width 1s ease-in-out'
          }} 
          aria-valuenow={value} 
          aria-valuemin="0" 
          aria-valuemax="100"
        />
      </div>
    </div>
  );

  return (
    <div className="card h-100">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">
          📈 学習進捗
          {isLoading && (
            <span className="spinner-border spinner-border-sm ms-2" role="status">
              <span className="visually-hidden">読み込み中...</span>
            </span>
          )}
        </h5>
      </div>
      <div className="card-body">
        <p className="card-text mb-4">今日も頑張りましょう！</p>
        
        <ProgressBar 
          label="タイピング練習" 
          value={progress.typing} 
          icon="⌨️"
        />
        
        <ProgressBar 
          label="SQL問題" 
          value={progress.sql} 
          icon="💾"
        />
        
        <ProgressBar 
          label="Linux学習" 
          value={progress.linux} 
          icon="🐧"
        />
        
        <div className="mt-4 p-3 bg-light rounded">
          <div className="text-center">
            <small className="text-muted">
              総合レベル: <strong>{Math.round((progress.typing + progress.sql + progress.linux) / 3)}%</strong>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;
