/* js/dashboard.js */

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    // ログイン状態をチェック
    if (!checkLoginStatus()) {
        return;
    }
    
    // ダッシュボードを初期化
    initializeDashboard();
    
    // ボタンイベントを設定
    setupButtonEvents();
});

// ダッシュボードの初期化
function initializeDashboard() {
    // ユーザー名を表示
    displayUserName();
    
    // 総合成績を表示
    displaySummaryStats();
    
    // ゲーム別成績を表示
    displayGameScores();
    
    // 総合ランキングを表示
    showRanking('total');
}

// ユーザー名を表示
function displayUserName() {
    const currentUser = getCurrentUser();
    const userNameElement = document.getElementById('current-user-name');
    
    if (currentUser && userNameElement) {
        userNameElement.textContent = currentUser;
    }
}

// 総合成績を表示
function displaySummaryStats() {
    const currentUser = getCurrentUser();
    const stats = scoreManager.getScoreStats(currentUser);
    
    if (!stats) return;
    
    // 総合得点
    document.getElementById('total-score').textContent = `${stats.total}点`;
    
    // 平均得点
    document.getElementById('average-score').textContent = `${stats.average}点`;
    
    // 得意分野
    const bestSubject = stats.bestGame ? stats.bestGame.gameName : '未プレイ';
    document.getElementById('best-subject').textContent = bestSubject;
}

// ゲーム別成績を表示
function displayGameScores() {
    const currentUser = getCurrentUser();
    const scores = scoreManager.getUserScores(currentUser);
    
    if (!scores) return;
    
    const games = ['math', 'language', 'science'];
    
    games.forEach(game => {
        const score = scores[game] || 0;
        const scoreElement = document.getElementById(`${game}-score`);
        const progressElement = document.getElementById(`${game}-progress`);
        
        if (scoreElement) {
            scoreElement.textContent = `${score}点`;
        }
        
        if (progressElement) {
            // プログレスバーの幅を設定（100点満点として）
            const progressWidth = Math.min(score, 100);
            progressElement.style.width = `${progressWidth}%`;
        }
    });
}

// ランキングを表示
function showRanking(type) {
    // タブの状態を更新
    updateRankingTabs(type);
    
    // ランキングデータを取得
    let rankingData;
    if (type === 'total') {
        rankingData = scoreManager.getTotalScoreRanking();
    } else {
        rankingData = scoreManager.getGameRanking(type);
    }
    
    // ランキングを表示
    displayRanking(rankingData, type);
}

// ランキングタブの状態を更新
function updateRankingTabs(activeType) {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // アクティブなタブを設定
    const tabTexts = {
        'total': '総合',
        'math': '数学',
        'language': '言語',
        'science': '科学'
    };
    
    tabs.forEach(tab => {
        if (tab.textContent === tabTexts[activeType]) {
            tab.classList.add('active');
        }
    });
}

// ランキングを表示
function displayRanking(rankingData, type) {
    const rankingContent = document.getElementById('ranking-content');
    const currentUser = getCurrentUser();
    
    if (!rankingData || rankingData.length === 0) {
        rankingContent.innerHTML = '<div class="no-data">まだデータがありません</div>';
        return;
    }
    
    let html = '';
    rankingData.forEach((item, index) => {
        const position = index + 1;
        const isCurrentUser = item.username === currentUser;
        const score = type === 'total' ? item.totalScore : item.score;
        
        html += `
            <div class="ranking-item ${isCurrentUser ? 'current-user-highlight' : ''}">
                <span class="ranking-position">${position}位</span>
                <span class="ranking-username">${item.username}${isCurrentUser ? ' (あなた)' : ''}</span>
                <span class="ranking-score">${score}点</span>
            </div>
        `;
    });
    
    rankingContent.innerHTML = html;
}

// ゲームをプレイ
function playGame(gameType) {
    const gameUrls = {
        'math': 'math-game.html',
        'language': 'language-game.html',
        'science': 'science-quiz.html'
    };
    
    const gameUrl = gameUrls[gameType];
    if (gameUrl) {
        window.location.href = gameUrl;
    }
}

// ボタンイベントを設定
function setupButtonEvents() {
    // ゲーム選択ボタン
    const gameSelectBtn = document.getElementById('game-select-btn');
    if (gameSelectBtn) {
        gameSelectBtn.addEventListener('click', function() {
            window.location.href = 'game-select.html';
        });
    }
    
    // 成績リセットボタン
    const resetScoresBtn = document.getElementById('reset-scores-btn');
    if (resetScoresBtn) {
        resetScoresBtn.addEventListener('click', function() {
            if (confirm('本当に成績をリセットしますか？この操作は取り消せません。')) {
                resetUserScores();
            }
        });
    }
    
    // ログアウトボタン
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('ログアウトしますか？')) {
                logout();
            }
        });
    }
}

// 成績をリセット
function resetUserScores() {
    const currentUser = getCurrentUser();
    const success = scoreManager.resetScores(currentUser);
    
    if (success) {
        showMessage('成績をリセットしました。', 'success');
        // ダッシュボードを再初期化
        setTimeout(() => {
            initializeDashboard();
        }, 1000);
    } else {
        showMessage('成績のリセットに失敗しました。', 'error');
    }
}

// メッセージを表示
function showMessage(text, type = 'info') {
    const messageElement = document.getElementById('message');
    if (messageElement) {
        messageElement.textContent = text;
        messageElement.className = `message ${type}`;
        
        setTimeout(() => {
            messageElement.className = 'message';
            messageElement.textContent = '';
        }, 5000);
    }
}

// ダッシュボードデータを更新
function refreshDashboard() {
    initializeDashboard();
}

// 統計情報を取得
function getDashboardStats() {
    const currentUser = getCurrentUser();
    return scoreManager.getScoreStats(currentUser);
}