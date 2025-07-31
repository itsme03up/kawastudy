import React, { useState, useEffect, useCallback } from 'react';

const TypingGame = ({ questions = [], initialQuestion = null }) => {
  // ゲーム状態
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [typedRomaji, setTypedRomaji] = useState('');
  const [totalTypedCount, setTotalTypedCount] = useState(0);
  const [totalMissCount, setTotalMissCount] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60.0);
  const [gameMessage, setGameMessage] = useState('');
  const [shake, setShake] = useState(false);

  const GAME_TIME_LIMIT = 60;

  // 現在の問題
  const currentQuestion = questions[currentQuestionIndex] || initialQuestion;

  // 統計計算
  const calculateWPM = useCallback((typed, timeInSeconds) => {
    if (timeInSeconds === 0) return 0;
    return Math.round((typed / timeInSeconds) * 60);
  }, []);

  const calculateAccuracy = useCallback((typed, missed) => {
    const total = typed + missed;
    if (total === 0) return 0.00;
    return (typed / total) * 100;
  }, []);

  // タイマー処理
  useEffect(() => {
    let timerId;
    if (isPlaying && startTime) {
      timerId = setInterval(() => {
        const elapsedTime = (Date.now() - startTime) / 1000;
        const remaining = GAME_TIME_LIMIT - elapsedTime;

        if (remaining <= 0) {
          setTimeRemaining(0);
          endGame();
        } else {
          setTimeRemaining(remaining);
        }
      }, 100);
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isPlaying, startTime]);

  // ゲーム開始
  const startGame = () => {
    setIsPlaying(true);
    setStartTime(Date.now());
    setGameMessage('');
  };

  // ゲーム終了
  const endGame = () => {
    if (!isPlaying) return;
    
    setIsPlaying(false);
    const elapsedTime = (Date.now() - startTime) / 1000;
    const finalWpm = calculateWPM(totalTypedCount, elapsedTime);
    const finalAccuracy = calculateAccuracy(totalTypedCount, totalMissCount);

    setGameMessage(
      `終了！ WPM: ${finalWpm}, 正解率: ${finalAccuracy.toFixed(2)}% - スペースキーでリトライ`
    );
  };

  // ゲームリセット
  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setTypedRomaji('');
    setTotalTypedCount(0);
    setTotalMissCount(0);
    setStartTime(null);
    setIsPlaying(false);
    setTimeRemaining(GAME_TIME_LIMIT);
    setGameMessage('');
  };

  // 次の問題へ
  const nextQuestion = () => {
    setCurrentQuestionIndex(prev => {
      const next = prev + 1;
      if (next >= questions.length) {
        endGame();
        return prev;
      }
      return next;
    });
    setTypedRomaji('');
  };

  // 入力処理
  const handleKeyPress = useCallback((e) => {
    if (e.isComposing) return;

    // すべてのキー入力をログに出力
    console.log('=== Key Event Debug ===');
    console.log('Raw event:', e);
    console.log('Key pressed:', {
      key: e.key,
      code: e.code,
      keyCode: e.keyCode,
      which: e.which,
      charCode: e.charCode,
      length: e.key.length,
      charCodeAt0: e.key.charCodeAt(0),
      unicode: 'U+' + e.key.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0'),
      type: e.type
    });

    // ハイフンキーの特別チェック
    if (e.key === '-' || e.code === 'Minus' || e.keyCode === 189 || e.keyCode === 173) {
      console.log('🔥 HYPHEN DETECTED! Event details:', {
        key: e.key,
        code: e.code,
        keyCode: e.keyCode,
        isHyphen: true
      });
    }

    // ゲーム開始 (スペースキー)
    if (!isPlaying && e.code === 'Space') {
      e.preventDefault();
      if (gameMessage.includes('リトライ')) {
        resetGame();
      } else {
        startGame();
      }
      return;
    }

    if (!isPlaying || !currentQuestion) return;

    // シンプルな文字判定テスト
    console.log('Simple character tests:');
    console.log('- Is letter:', /[a-zA-Z]/.test(e.key));
    console.log('- Is digit:', /[0-9]/.test(e.key));
    console.log('- Is hyphen (-):', e.key === '-');
    console.log('- Is space:', e.key === ' ');
    console.log('- Length is 1:', e.key.length === 1);

    // より広範囲の文字を受け付ける（ハイフンの問題を解決するため）
    const isValidInput = (key) => {
      // 1文字で、以下のいずれかに該当
      if (key.length !== 1) return false;
      
      // アルファベット
      if (/[a-zA-Z]/.test(key)) return true;
      
      // 数字
      if (/[0-9]/.test(key)) return true;
      
      // 特別な記号（個別にチェック）
      const allowedSymbols = ['-', '−', '－', '.', ',', '!', '?', ' '];
      if (allowedSymbols.includes(key)) return true;
      
      return false;
    };
    
    const validInput = isValidInput(e.key);
    console.log('Valid input result:', validInput);
    
    if (validInput) {
      e.preventDefault();
      console.log('✅ Input accepted:', {
        key: e.key,
        code: e.code,
        keyCode: e.keyCode
      });
      checkInput(e.key);
    } else {
      console.log('❌ Input rejected:', {
        key: e.key,
        length: e.key.length,
        reason: 'Not in allowed character set'
      });
    }
  }, [isPlaying, currentQuestion, typedRomaji, gameMessage]);

  // キーボードイベントリスナー
  useEffect(() => {
    // 複数のイベントタイプをテスト
    const handleKeyDown = (e) => {
      console.log('📥 keydown event:', { key: e.key, code: e.code, type: 'keydown' });
      handleKeyPress(e);
    };

    const handleKeyPressEvent = (e) => {
      console.log('📥 keypress event:', { key: e.key, code: e.code, type: 'keypress' });
      // keypress は非推奨だが、ハイフンの検出に使えるかテスト
    };

    const handleInput = (e) => {
      console.log('📥 input event:', { data: e.data, inputType: e.inputType, type: 'input' });
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keypress', handleKeyPressEvent);
    document.addEventListener('input', handleInput);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keypress', handleKeyPressEvent);
      document.removeEventListener('input', handleInput);
    };
  }, [handleKeyPress]);

  // 入力チェック
  const checkInput = (key) => {
    if (!currentQuestion) return;

    const targetRomaji = currentQuestion.romaji;
    const expectedChar = targetRomaji[typedRomaji.length];

    // デバッグ用ログ
    console.log('Input check:', {
      inputKey: key,
      inputKeyCode: key.charCodeAt(0),
      inputKeyUnicode: 'U+' + key.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0'),
      expectedChar: expectedChar,
      expectedCharCode: expectedChar.charCodeAt(0),
      expectedCharUnicode: 'U+' + expectedChar.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0'),
      targetRomaji: targetRomaji,
      typedRomaji: typedRomaji,
      position: typedRomaji.length,
      exactMatch: key === expectedChar,
      hyphenMatch: (key === '-' || key === '−' || key === '－') && (expectedChar === '-' || expectedChar === '−' || expectedChar === '－')
    });

    // ハイフン系の文字は互換性を持たせる
    const isHyphenInput = ['-', '−', '－'].includes(key);
    const isHyphenExpected = ['-', '−', '－'].includes(expectedChar);
    
    if (key === expectedChar || (isHyphenInput && isHyphenExpected)) {
      // 正解
      const newTypedRomaji = typedRomaji + expectedChar; // 期待される文字を使用
      setTypedRomaji(newTypedRomaji);
      setTotalTypedCount(prev => prev + 1);

      // 問題をクリアした場合
      if (newTypedRomaji === targetRomaji) {
        nextQuestion();
      }
    } else {
      // 不正解
      setTotalMissCount(prev => prev + 1);
      setShake(true);
      setTimeout(() => setShake(false), 100);
    }
  };

  // 表示用の統計値
  const currentStats = {
    wpm: startTime ? calculateWPM(totalTypedCount, (Date.now() - startTime) / 1000) : 0,
    accuracy: calculateAccuracy(totalTypedCount, totalMissCount)
  };

  // ローマ字表示の生成
  const renderRomajiDisplay = () => {
    if (!currentQuestion) return '';
    
    const targetRomaji = currentQuestion.romaji;
    const typedPart = targetRomaji.substring(0, typedRomaji.length);
    const remainingPart = targetRomaji.substring(typedRomaji.length);

    return (
      <>
        <span style={{ color: '#28a745' }}>{typedPart}</span>
        <span>{remainingPart}</span>
      </>
    );
  };

  // 日本語表示の生成
  const renderJapaneseDisplay = () => {
    if (!currentQuestion) return '';
    
    const progress = typedRomaji.length / currentQuestion.romaji.length;
    const jpLen = currentQuestion.japanese.length;
    const jpDoneLen = Math.floor(jpLen * progress);
    
    const donePart = currentQuestion.japanese.substring(0, jpDoneLen);
    const remainingPart = currentQuestion.japanese.substring(jpDoneLen);

    return (
      <>
        <span style={{ color: '#28a745' }}>{donePart}</span>
        <span>{remainingPart}</span>
      </>
    );
  };

  if (!currentQuestion) {
    return (
      <div className="alert alert-warning">
        問題データが読み込まれていません。
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className={`inner ${shake ? 'shake' : ''}`}>
        {/* ヘッダー統計 */}
        <div className="mb-4">
          <div className="row text-center">
            <div className="col-6 col-md-3">
              <div className="card">
                <div className="card-body py-2">
                  <small>問題</small>
                  <div className="fw-bold">
                    {currentQuestionIndex + 1}/{questions.length}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card">
                <div className="card-body py-2">
                  <small>残り時間</small>
                  <div className="fw-bold text-danger">
                    {timeRemaining.toFixed(1)}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card">
                <div className="card-body py-2">
                  <small>WPM</small>
                  <div className="fw-bold text-primary">
                    {currentStats.wpm}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card">
                <div className="card-body py-2">
                  <small>正解率</small>
                  <div className="fw-bold text-success">
                    {currentStats.accuracy.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 問題表示エリア */}
        <div className="card mb-4">
          <div className="card-body text-center py-5">
            <div className="mb-3">
              <div className="fs-2 fw-bold" style={{ fontFamily: 'serif' }}>
                {renderJapaneseDisplay()}
              </div>
            </div>
            <div className="fs-4 text-muted" style={{ fontFamily: 'monospace' }}>
              {renderRomajiDisplay()}
            </div>
          </div>
        </div>

        {/* オーバーレイメッセージ */}
        {(!isPlaying || gameMessage) && (
          <div className="card border-primary">
            <div className="card-body text-center py-4">
              <div className="fs-4 mb-3">
                {gameMessage || 'スペースキーで開始'}
              </div>
              {!gameMessage && (
                <div className="text-muted">
                  （日本語入力モードはオフにしてください）
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .shake {
          animation: shake 0.1s ease-in-out;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .inner {
          transition: transform 0.1s ease;
        }
      `}</style>
    </div>
  );
};

export default TypingGame;
