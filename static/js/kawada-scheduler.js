/**
 * 川田スケジューラー - 学習セッション記録
 * 各学習アプリで使用される共通の学習セッション記録機能
 */

class KawadaScheduler {
    constructor() {
        this.sessionStartTime = null;
        this.currentApp = null;
        this.currentLesson = null;
        this.isRecording = false;
    }

    /**
     * 学習セッションを開始
     * @param {string} appName - アプリ名 ('cstudy', 'sqlquiz', etc.)
     * @param {string} lessonName - レッスン名（任意）
     */
    startSession(appName, lessonName = '') {
        this.sessionStartTime = new Date();
        this.currentApp = appName;
        this.currentLesson = lessonName;
        this.isRecording = true;
        
        console.log(`📚 学習セッション開始: ${appName} - ${lessonName}`);
        
        // 川田からの応援メッセージを表示
        this.showKawadaEncouragement();
    }

    /**
     * 学習セッションを終了
     * @param {boolean} completed - 完了したかどうか
     */
    endSession(completed = true) {
        if (!this.isRecording) {
            return;
        }

        const endTime = new Date();
        const durationMinutes = Math.round((endTime - this.sessionStartTime) / (1000 * 60));
        
        // セッションデータを記録
        this.recordSession({
            app_name: this.currentApp,
            lesson_name: this.currentLesson,
            duration_minutes: Math.max(1, durationMinutes), // 最低1分
            completed: completed
        });

        this.isRecording = false;
        
        console.log(`✅ 学習セッション終了: ${durationMinutes}分`);
    }

    /**
     * セッションデータをサーバーに送信
     * @param {Object} sessionData - セッションデータ
     */
    async recordSession(sessionData) {
        try {
            const response = await fetch('/schedule/api/study-session/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.getCSRFToken(),
                },
                body: JSON.stringify(sessionData)
            });

            const data = await response.json();
            
            if (data.status === 'success') {
                console.log('📊 学習記録が保存されました');
                
                // 統計情報を更新
                this.updateStats();
                
                // 川田からのメッセージをチェック
                this.checkKawadaMessages();
            }
        } catch (error) {
            console.error('学習記録の保存に失敗しました:', error);
        }
    }

    /**
     * ユーザー統計を更新
     */
    async updateStats() {
        try {
            const response = await fetch('/schedule/api/stats/');
            const stats = await response.json();
            
            // 統計情報をページに反映
            this.displayStats(stats);
        } catch (error) {
            console.error('統計の取得に失敗しました:', error);
        }
    }

    /**
     * 川田からのメッセージをチェック
     */
    async checkKawadaMessages() {
        try {
            const response = await fetch('/schedule/api/messages/unread/');
            const data = await response.json();
            
            if (data.messages && data.messages.length > 0) {
                // 新しいメッセージがある場合、通知を表示
                this.showMessageNotification(data.messages.length);
            }
        } catch (error) {
            console.error('メッセージの取得に失敗しました:', error);
        }
    }

    /**
     * 川田からの応援メッセージを表示
     */
    showKawadaEncouragement() {
        const encouragements = [
            "一緒に頑張りましょう！💪",
            "今日も素敵な学習時間ですね✨",
            "川田も応援しています📚",
            "きっと成長できますよ💕",
            "楽しく学習しましょうね😊"
        ];
        
        const message = encouragements[Math.floor(Math.random() * encouragements.length)];
        this.showKawadaMessage("学習開始", message, 'cheerful');
    }

    /**
     * 川田からのメッセージを表示
     */
    showKawadaMessage(title, content, expression = 'normal') {
        const expressions = {
            'cheerful': '🥰',
            'smile': '😊',
            'normal': '😊',
            'thinking': '🤔',
            'gentle': '😌'
        };

        const notification = document.createElement('div');
        notification.className = 'kawada-notification';
        notification.innerHTML = `
            <div class="kawada-avatar">${expressions[expression]}</div>
            <div class="kawada-content">
                <div class="kawada-title">${title}</div>
                <div class="kawada-text">${content}</div>
            </div>
            <button class="kawada-close" onclick="this.parentElement.remove()">×</button>
        `;

        // スタイルを追加（まだ追加されていない場合）
        this.addNotificationStyles();

        document.body.appendChild(notification);

        // 5秒後に自動削除
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    /**
     * メッセージ通知を表示
     */
    showMessageNotification(count) {
        const notification = document.createElement('div');
        notification.className = 'message-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">💌</span>
                <span class="notification-text">川田から${count}件の新しいメッセージ</span>
            </div>
            <a href="/schedule/messages/" class="notification-link">確認する</a>
        `;

        this.addNotificationStyles();
        document.body.appendChild(notification);

        // 8秒後に自動削除
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 8000);
    }

    /**
     * 統計情報を表示
     */
    displayStats(stats) {
        // 連続学習日数の表示
        const streakElement = document.querySelector('.study-streak');
        if (streakElement) {
            streakElement.textContent = `${stats.current_streak}日連続`;
        }

        // 総学習時間の表示
        const totalTimeElement = document.querySelector('.total-study-time');
        if (totalTimeElement) {
            const hours = Math.floor(stats.total_minutes / 60);
            const minutes = stats.total_minutes % 60;
            totalTimeElement.textContent = `${hours}時間${minutes}分`;
        }

        // セッション数の表示
        const sessionsElement = document.querySelector('.total-sessions');
        if (sessionsElement) {
            sessionsElement.textContent = `${stats.total_sessions}回`;
        }
    }

    /**
     * 通知スタイルを追加
     */
    addNotificationStyles() {
        if (document.querySelector('#kawada-notification-styles')) {
            return; // 既に追加済み
        }

        const style = document.createElement('style');
        style.id = 'kawada-notification-styles';
        style.textContent = `
            .kawada-notification {
                position: fixed;
                top: 80px;
                right: 20px;
                background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
                color: white;
                padding: 1rem;
                border-radius: 15px;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 1rem;
                max-width: 300px;
                animation: slideInRight 0.3s ease;
            }

            .message-notification {
                position: fixed;
                top: 80px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 1rem;
                border-radius: 15px;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
                max-width: 350px;
                animation: slideInRight 0.3s ease;
            }

            .kawada-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                flex-shrink: 0;
            }

            .kawada-content {
                flex: 1;
            }

            .kawada-title {
                font-weight: bold;
                font-size: 0.9rem;
                margin-bottom: 0.3rem;
            }

            .kawada-text {
                font-size: 0.8rem;
                opacity: 0.9;
            }

            .kawada-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background-color 0.3s;
            }

            .kawada-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .notification-icon {
                font-size: 1.2rem;
            }

            .notification-text {
                font-size: 0.9rem;
            }

            .notification-link {
                background: rgba(255, 255, 255, 0.2);
                color: white;
                padding: 0.3rem 0.8rem;
                border-radius: 15px;
                text-decoration: none;
                font-size: 0.8rem;
                transition: background-color 0.3s;
            }

            .notification-link:hover {
                background: rgba(255, 255, 255, 0.3);
                color: white;
                text-decoration: none;
            }

            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @media (max-width: 768px) {
                .kawada-notification,
                .message-notification {
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }
            }
        `;

        document.head.appendChild(style);
    }

    /**
     * CSRFトークンを取得
     */
    getCSRFToken() {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'csrftoken') {
                return value;
            }
        }
        
        // metaタグからも試行
        const metaToken = document.querySelector('meta[name="csrf-token"]');
        if (metaToken) {
            return metaToken.getAttribute('content');
        }
        
        return '';
    }

    /**
     * ページ離脱時に自動でセッションを終了
     */
    setupAutoEndSession() {
        window.addEventListener('beforeunload', () => {
            if (this.isRecording) {
                this.endSession(false); // 未完了として記録
            }
        });

        // 非アクティブ時間の監視
        let lastActivity = Date.now();
        let inactivityTimer;

        const resetTimer = () => {
            lastActivity = Date.now();
            clearTimeout(inactivityTimer);
            
            // 30分非アクティブでセッション終了
            inactivityTimer = setTimeout(() => {
                if (this.isRecording) {
                    this.endSession(false);
                    this.showKawadaMessage(
                        "お疲れさまでした", 
                        "30分お疲れさまでした。また今度一緒に学習しましょうね💕", 
                        'gentle'
                    );
                }
            }, 30 * 60 * 1000); // 30分
        };

        // ユーザーアクティビティを監視
        document.addEventListener('mousedown', resetTimer);
        document.addEventListener('mousemove', resetTimer);
        document.addEventListener('keypress', resetTimer);
        document.addEventListener('scroll', resetTimer);

        resetTimer(); // 初期化
    }
}

// グローバルインスタンスを作成
window.kawadaScheduler = new KawadaScheduler();

// ページ読み込み完了時に自動終了セットアップ
document.addEventListener('DOMContentLoaded', () => {
    window.kawadaScheduler.setupAutoEndSession();
});
