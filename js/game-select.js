/* js/game-select.js */

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    // ログイン状態をチェック
    if (!checkLoginStatus()) {
        return;
    }
    
    // ユーザー名を表示
    displayWelcomeMessage();
    
    // ボタンイベントを設定
    setupButtonEvents();
});

// ウェルカムメッセージを表示
function displayWelcomeMessage() {
    const currentUser = getCurrentUser();
    const welcomeElement = document.getElementById('welcome-message');
    
    if (currentUser && welcomeElement) {
        welcomeElement.textContent = `ようこそ、${currentUser}さん！`;
    }
}

// ボタンイベントを設定
function setupButtonEvents() {
    // ゲームボタンのイベント
    const gameButtons = document.querySelectorAll('.game-btn');
    gameButtons.forEach(button => {
        button.addEventListener('click', function() {
            const gameType = this.getAttribute('data-game');
            startGame(gameType);
        });
    });
    
    // ダッシュボードボタン
    const dashboardBtn = document.getElementById('dashboard-btn');
    if (dashboardBtn) {
        dashboardBtn.addEventListener('click', function() {
            window.location.href = 'dashboard.html';
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

// ゲームを開始
function startGame(gameType) {
    // ゲームタイプに応じて適切な画面に遷移
    let gameUrl = '';
    
    switch(gameType) {
        case 'math':
            gameUrl = 'math-game.html';
            break;
        case 'language':
            gameUrl = 'language-game.html';
            break;
        case 'science':
            gameUrl = 'science-quiz.html';
            break;
        default:
            alert('このゲームはまだ準備中です！');
            return;
    }
    
    // ゲーム画面に遷移
    window.location.href = gameUrl;
}

// ユーザー情報を表示（デバッグ用）
function showUserInfo() {
    const currentUser = getCurrentUser();
    const userInfo = getUserInfo(currentUser);
    
    if (userInfo) {
        console.log('現在のユーザー:', userInfo);
        console.log('スコア:', userInfo.scores);
    }
}