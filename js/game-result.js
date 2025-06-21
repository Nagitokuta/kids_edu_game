/* js/game-result.js */

// 結果データを格納する変数
let resultData = {
    gameType: '',
    correct: 0,
    total: 0,
    score: 0,
    accuracy: 0
};

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    // ログイン状態をチェック
    if (!checkLoginStatus()) {
        return;
    }
    
    // URLパラメータから結果データを取得
    parseResultData();
    
    // 結果を表示
    displayResults();
    
    // ボタンイベントを設定
    setupButtonEvents();
    
    // スコアを保存
    saveScore();
});

// URLパラメータから結果データを解析
function parseResultData() {
    const urlParams = new URLSearchParams(window.location.search);
    
    resultData.gameType = urlParams.get('type') || 'math';
    resultData.correct = parseInt(urlParams.get('correct')) || 0;
    resultData.total = parseInt(urlParams.get('total')) || 5;
    resultData.score = parseInt(urlParams.get('score')) || 0;
    resultData.accuracy = Math.round((resultData.correct / resultData.total) * 100);
}

// 結果を表示
function displayResults() {
    // ゲーム種別を表示
    const gameTypeNames = {
        'math': '数学ゲーム',
        'language': '言語ゲーム',
        'science': '科学クイズ'
    };
    
    document.getElementById('game-type-text').textContent = 
        gameTypeNames[resultData.gameType] || 'ゲーム';
    
    // スコア情報を表示
    document.getElementById('correct-answers').textContent = 
        `${resultData.correct}問/${resultData.total}問`;
    
    document.getElementById('final-score').textContent = 
        `${resultData.score}点`;
    
    document.getElementById('accuracy-rate').textContent = 
        `${resultData.accuracy}%`;
    
    // 評価メッセージを表示
    displayEvaluationMessage();
    
    // スコアに応じてスタイルを変更
    applyScoreStyle();
}

// 評価メッセージを表示
function displayEvaluationMessage() {
    const accuracy = resultData.accuracy;
    let message = '';
    
    if (accuracy >= 90) {
        message = '🌟 素晴らしい！完璧に近い成績です！';
    } else if (accuracy >= 80) {
        message = '🎉 とても良くできました！';
    } else if (accuracy >= 70) {
        message = '👍 よくできました！';
    } else if (accuracy >= 60) {
        message = '😊 がんばりました！';
    } else if (accuracy >= 40) {
        message = '💪 もう少しがんばりましょう！';
    } else {
        message = '📚 復習してもう一度チャレンジしてみましょう！';
    }
    
    document.getElementById('evaluation-text').textContent = message;
}

// スコアに応じてスタイルを適用
function applyScoreStyle() {
    const scoreDisplay = document.querySelector('.score-display');
    const accuracy = resultData.accuracy;
    
    // 既存のスコアクラスを削除
    scoreDisplay.classList.remove('score-excellent', 'score-good', 'score-normal');
    
    // 成績に応じてクラスを追加
    if (accuracy >= 80) {
        scoreDisplay.classList.add('score-excellent');
    } else if (accuracy >= 60) {
        scoreDisplay.classList.add('score-good');
    } else {
        scoreDisplay.classList.add('score-normal');
    }
}

// ボタンイベントを設定
function setupButtonEvents() {
    // ダッシュボードボタン
    const dashboardBtn = document.getElementById('dashboard-btn');
    if (dashboardBtn) {
        dashboardBtn.addEventListener('click', function() {
            window.location.href = 'dashboard.html';
        });
    }
    
    // 続けてプレイボタン
    const playAgainBtn = document.getElementById('play-again-btn');
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', function() {
            const gameUrls = {
                'math': 'math-game.html',
                'language': 'language-game.html',
                'science': 'science-quiz.html'
            };
            
            const gameUrl = gameUrls[resultData.gameType] || 'game-select.html';
            window.location.href = gameUrl;
        });
    }
    
    // ゲーム選択ボタン
    const gameSelectBtn = document.getElementById('game-select-btn');
    if (gameSelectBtn) {
        gameSelectBtn.addEventListener('click', function() {
            window.location.href = 'game-select.html';
        });
    }
}

// スコアを保存
function saveScore() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const userInfo = getUserInfo(currentUser);
    if (!userInfo) return;
    
    // 現在の最高得点と比較
    const currentHighScore = userInfo.scores[resultData.gameType] || 0;
    
    if (resultData.score > currentHighScore) {
        // 最高得点を更新
        userInfo.scores[resultData.gameType] = resultData.score;
        updateUserInfo(currentUser, userInfo);
        
        // 新記録メッセージを表示
        showMessage('🎊 新記録達成！おめでとうございます！', 'success');
    }
}

// メッセージを表示
function showMessage(text, type = 'info') {
    const messageElement = document.getElementById('message');
    if (messageElement) {
        messageElement.textContent = text;
        messageElement.className = `message ${type}`;
        
        // 5秒後にメッセージを非表示
        setTimeout(() => {
            messageElement.className = 'message';
            messageElement.textContent = '';
        }, 5000);
    }
}

// 結果データの統計情報を取得
function getResultStats() {
    return {
        gameType: resultData.gameType,
        performance: resultData.accuracy >= 80 ? 'excellent' : 
                    resultData.accuracy >= 60 ? 'good' : 'needs_improvement',
        totalQuestions: resultData.total,
        correctAnswers: resultData.correct,
        finalScore: resultData.score
    };
}

// デバッグ用：結果データをコンソールに表示
function debugResultData() {
    console.log('結果データ:', resultData);
    console.log('統計情報:', getResultStats());
}