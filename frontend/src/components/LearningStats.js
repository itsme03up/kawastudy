import React, { useState, useEffect } from 'react';

const LearningStats = () => {
  const [stats, setStats] = useState({
    todayGoals: [],
    streakDays: 0,
    totalLessons: 0,
    lastActivity: ''
  });

  const [checkedGoals, setCheckedGoals] = useState(new Set());

  useEffect(() => {
    // 学習統計データを取得
    const fetchStats = async () => {
      try {
        // ダミーデータ（実際の実装では API からデータを取得）
        const data = {
          todayGoals: [
            { id: 1, text: 'タイピング速度向上（目標: 60WPM）', completed: true },
            { id: 2, text: 'SQL基礎問題 5問完了', completed: false },
            { id: 3, text: 'Linuxコマンド 3つ習得', completed: false },
            { id: 4, text: 'AIとの学習セッション 1回', completed: true }
          ],
          streakDays: 7,
          totalLessons: 42,
          lastActivity: '2時間前'
        };
        
        setStats(data);
        
        // 完了済みの目標をセットに追加
        const completed = new Set(
          data.todayGoals.filter(goal => goal.completed).map(goal => goal.id)
        );
        setCheckedGoals(completed);
        
      } catch (error) {
        console.error('統計データの取得に失敗:', error);
      }
    };

    fetchStats();
  }, []);

  const toggleGoal = (goalId) => {
    const newCheckedGoals = new Set(checkedGoals);
    if (newCheckedGoals.has(goalId)) {
      newCheckedGoals.delete(goalId);
    } else {
      newCheckedGoals.add(goalId);
    }
    setCheckedGoals(newCheckedGoals);
    
    // ここで API を呼び出して状態を保存
    // saveGoalProgress(goalId, newCheckedGoals.has(goalId));
  };

  const completedGoalsCount = checkedGoals.size;
  const totalGoalsCount = stats.todayGoals.length;
  const completionRate = totalGoalsCount > 0 ? (completedGoalsCount / totalGoalsCount) * 100 : 0;

  return (
    <div className="card h-100">
      <div className="card-header bg-success text-white">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">🎯 今日の目標</h5>
          <span className="badge bg-light text-dark">
            {completedGoalsCount}/{totalGoalsCount}
          </span>
        </div>
      </div>
      <div className="card-body">
        {/* 進捗サマリー */}
        <div className="row mb-3">
          <div className="col-4 text-center">
            <div className="text-primary fw-bold fs-4">{stats.streakDays}</div>
            <small className="text-muted">連続日数</small>
          </div>
          <div className="col-4 text-center">
            <div className="text-success fw-bold fs-4">{stats.totalLessons}</div>
            <small className="text-muted">総レッスン数</small>
          </div>
          <div className="col-4 text-center">
            <div className="text-info fw-bold fs-4">{Math.round(completionRate)}%</div>
            <small className="text-muted">今日の達成率</small>
          </div>
        </div>
        
        {/* 目標リスト */}
        <ul className="list-group list-group-flush mb-3">
          {stats.todayGoals.map((goal) => (
            <li key={goal.id} className="list-group-item px-0 py-2">
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id={`goal-${goal.id}`}
                  checked={checkedGoals.has(goal.id)}
                  onChange={() => toggleGoal(goal.id)}
                />
                <label 
                  className={`form-check-label ${checkedGoals.has(goal.id) ? 'text-decoration-line-through text-muted' : ''}`} 
                  htmlFor={`goal-${goal.id}`}
                >
                  {goal.text}
                </label>
              </div>
            </li>
          ))}
        </ul>
        
        {/* 最後の活動 */}
        <div className="small text-muted text-center">
          最後の活動: {stats.lastActivity}
        </div>
        
        {/* 達成率プログレスバー */}
        <div className="mt-3">
          <div className="progress" style={{ height: '6px' }}>
            <div 
              className="progress-bar bg-success"
              style={{ 
                width: `${completionRate}%`,
                transition: 'width 0.5s ease'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningStats;
