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

    // デバッグ用ログ
    console.log('Key pressed:', {
      key: e.key,
      code: e.code,
      keyCode: e.keyCode,
      length: e.key.length,
      charCode: e.key.charCodeAt(0),
      unicode: 'U+' + e.key.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0'),
      matches: e.key.match(/[a-z0-9\-'.,!?ー]/i),
      rawMatch: !!e.key.match(/[a-z0-9\-'.,!?ー]/i)
    });

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

    // アルファベット、数字、記号を処理
    // ハイフンを明示的にエスケープして対応
    const allowedChars = /^[a-zA-Z0-9\-'.,!?ー]$/;
    
    if (e.key.length === 1 && allowedChars.test(e.key)) {
      e.preventDefault();
      console.log('Input accepted:', e.key);
      checkInput(e.key);
    } else {
      console.log('Input rejected:', e.key, 'Length:', e.key.length, 'Test result:', allowedChars.test(e.key));
    }
  }, [isPlaying, currentQuestion, typedRomaji, gameMessage]);

  // キーボードイベントリスナー
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // 長音記号を適切な母音に変換する関数
  const convertChoonToVowel = (text) => {
    let result = '';
    const vowels = 'aiueo';
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === 'ー') {
        // 前の文字から母音を探す
        for (let j = i - 1; j >= 0; j--) {
          if (vowels.includes(text[j])) {
            result += text[j]; // 前の母音を繰り返す
            break;
          }
        }
      } else {
        result += char;
      }
    }
    return result;
  };

  // 入力チェック
  const checkInput = (key) => {
    if (!currentQuestion) return;

    let targetRomaji = currentQuestion.romaji;
    
    // 長音記号があれば適切な母音に変換
    if (targetRomaji.includes('ー')) {
      targetRomaji = convertChoonToVowel(targetRomaji);
    }
    
    let expectedChar = targetRomaji[typedRomaji.length];

    // ハイフンの代替入力を許可
    const hyphenAlternatives = ['-', '−', '－', 'ー'];
    let inputKey = key;
    
    // 入力された文字がハイフンの代替文字の場合、標準ハイフンに統一
    if (hyphenAlternatives.includes(key)) {
      inputKey = '-';
    }
    
    // 期待される文字もハイフン系の場合、標準ハイフンとして比較
    if (hyphenAlternatives.includes(expectedChar)) {
      expectedChar = '-';
    }

    // デバッグ用ログ
    console.log('Input check:', {
      originalRomaji: currentQuestion.romaji,
      convertedRomaji: targetRomaji,
      originalInputKey: key,
      normalizedInputKey: inputKey,
      originalExpectedChar: currentQuestion.romaji[typedRomaji.length],
      normalizedExpectedChar: expectedChar,
      typedRomaji: typedRomaji,
      position: typedRomaji.length,
      match: inputKey === expectedChar
    });

    if (inputKey === expectedChar) {
      // 正解
      const newTypedRomaji = typedRomaji + targetRomaji[typedRomaji.length]; // 変換後の文字を使用
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
    
    let targetRomaji = currentQuestion.romaji;
    
    // 長音記号があれば適切な母音に変換
    if (targetRomaji.includes('ー')) {
      targetRomaji = convertChoonToVowel(targetRomaji);
    }
    
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
