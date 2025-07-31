import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SQLQuizGame = ({ stageNumber, stageData: initialStageData = {} }) => {
  const [stageData, setStageData] = useState(initialStageData);
  const [sqlInput, setSqlInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    // ステージデータを取得
    const fetchStageData = async () => {
      if (Object.keys(stageData).length === 0) {
        try {
          const response = await axios.get(`/sqlquiz/stage/${stageNumber}/data/`);
          setStageData(response.data);
        } catch (error) {
          console.error('ステージデータの取得に失敗:', error);
          setStageData({
            tableName: 'sample_table',
            story: 'データを読み込み中...',
            sampleData: [],
            successReaction: '成功しました！',
            failureReaction: 'もう一度挑戦してみてください。',
            mockResult: []
          });
        }
      }
    };

    fetchStageData();
  }, [stageNumber, stageData]);

  // SQL実行
  const executeSQL = async () => {
    if (!sqlInput.trim()) {
      alert('SQLを入力してください');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`/sqlquiz/stage/${stageNumber}/check/`, {
        sql: sqlInput
      });
      
      setResult(response.data);
      setShowResult(true);
    } catch (error) {
      console.error('Error:', error);
      alert('エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  // SQL入力クリア
  const clearSQL = () => {
    setSqlInput('');
    setShowResult(false);
    setResult(null);
  };

  // サンプルテーブルの生成
  const renderSampleTable = () => {
    if (!stageData.sampleData || stageData.sampleData.length === 0) {
      return <div className="text-muted">データがありません</div>;
    }

    const headers = Object.keys(stageData.sampleData[0]);
    
    return (
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              {headers.map(header => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stageData.sampleData.map((row, index) => (
              <tr key={index}>
                {headers.map(header => (
                  <td key={header}>{row[header]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // 実行結果テーブルの生成
  const renderResultTable = () => {
    if (!stageData.mockResult || stageData.mockResult.length === 0) {
      return <div className="text-muted">結果がありません</div>;
    }

    const headers = Object.keys(stageData.mockResult[0]);
    
    return (
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-success">
            <tr>
              {headers.map(header => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stageData.mockResult.map((row, index) => (
              <tr key={index}>
                {headers.map(header => (
                  <td key={header}>{row[header]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* ストーリーセクション */}
          <div className="card shadow mb-4">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">🍱 ストーリー</h5>
            </div>
            <div className="card-body bg-light">
              <div className="story-text p-3" style={{ 
                fontFamily: "'Hiragino Sans', 'Yu Gothic', sans-serif", 
                lineHeight: 1.8 
              }}>
                {stageData.story}
              </div>
            </div>
          </div>

          {/* サンプルテーブル表示 */}
          <div className="card shadow mb-4">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">📋 {stageData.tableName || 'sample_table'} テーブル（表示専用）</h5>
            </div>
            <div className="card-body">
              {renderSampleTable()}
            </div>
          </div>

          {/* SQL入力エリア */}
          <div className="card shadow mb-4">
            <div className="card-header bg-warning text-dark">
              <h5 className="mb-0">💬 あなたへの課題</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-lg-8">
                  <label htmlFor="sql-input" className="form-label fw-bold">SQLを入力：</label>
                  <textarea 
                    id="sql-input"
                    className="form-control font-monospace" 
                    rows="4" 
                    placeholder="SELECT ... FROM ... WHERE ..."
                    value={sqlInput}
                    onChange={(e) => setSqlInput(e.target.value)}
                  />
                  <div className="mt-3">
                    <button 
                      className="btn btn-primary btn-lg me-2"
                      onClick={executeSQL}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          実行中...
                        </>
                      ) : (
                        '🚀 実行ボタン'
                      )}
                    </button>
                    <button 
                      className="btn btn-secondary"
                      onClick={clearSQL}
                    >
                      🗑️ クリア
                    </button>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="card bg-info text-white mt-3 mt-lg-0">
                    <div className="card-body text-center">
                      <h6>🤖 川田のヒント</h6>
                      {showHint ? (
                        <p className="small mb-0">{stageData.hint || 'ヒントがありません'}</p>
                      ) : (
                        <button 
                          className="btn btn-light btn-sm"
                          onClick={() => setShowHint(true)}
                        >
                          ヒントを見る
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 結果表示エリア */}
          {showResult && result && (
            <div className="result-section">
              {/* 川田のリアクション */}
              <div className="card shadow mb-4">
                <div className={`card-header ${result.correct ? 'bg-success' : 'bg-danger'} text-white`}>
                  <h5 className="mb-0">
                    {result.correct ? '✅ 成功 - 川田の反応' : '❌ 失敗 - 川田の反応'}
                  </h5>
                </div>
                <div className="card-body">
                  <div className="p-3" style={{ 
                    fontFamily: "'Hiragino Sans', 'Yu Gothic', sans-serif", 
                    lineHeight: 1.8 
                  }}>
                    {result.correct ? stageData.successReaction : stageData.failureReaction}
                    {!result.correct && result.correct_sql && (
                      <div className="mt-3">
                        <strong>正解例：</strong>
                        <br />
                        <code className="d-block mt-2 p-2 bg-light">{result.correct_sql}</code>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 実行結果テーブル */}
              {result.correct && (
                <div className="card shadow">
                  <div className="card-header bg-secondary text-white">
                    <h5 className="mb-0">📊 実行結果（テーブル形式）</h5>
                  </div>
                  <div className="card-body">
                    {renderResultTable()}
                    <div className="text-center mt-3">
                      <a href="/sqlquiz/" className="btn btn-success btn-lg">
                        次のステージへ →
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .font-monospace {
          font-family: 'Courier New', monospace;
        }

        .story-text {
          background-color: #f8f9fa;
          border-left: 4px solid #007bff;
          font-size: 1.1rem;
        }

        .table-hover tbody tr:hover {
          background-color: rgba(0,123,255,.1);
        }

        .card {
          transition: transform 0.2s ease-in-out;
        }

        .card:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

export default SQLQuizGame;
