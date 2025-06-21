/* js/game-common.js */

// ゲーム共通の変数
let currentQuestionNumber = 1;
let totalQuestions = 5;
let correctAnswers = 0;
let gameType = '';

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    // ログイン状態をチェック
    if (!checkLoginStatus()) {
        return;
    }
    
    // 共通イベントを設定
    setupCommonEvents();
    
    // URLパラメータからゲームタイプを取得
    gameType = getGameTypeFromURL();
    
    // ゲーム初期化
    initializeGame();
});

// 共通イベントの設定
function setupCommonEvents() {
    // 回答ボタン
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', handleSubmitAnswer);
    }
    
    // ゲーム終了ボタン
    const endBtn = document.getElementById('end-btn');
    if (endBtn) {
        endBtn.addEventListener('click', function() {
            if (confirm('ゲームを終了しますか？')) {
                endGame();
            }
        });
    }
    
    // 戻るボタン
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.href = 'game-select.html';
        });
    }
}

// URLからゲームタイプを取得
function getGameTypeFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('type') || 'math';
}

// ゲーム初期化
function initializeGame() {
    // ゲームタイトルを設定
    setGameTitle(gameType);
    
    // 進行状況を更新
    updateProgress();
    
    // スコアを初期化
    updateScore();
    
    // 最初の問題を表示（各ゲーム固有の関数で実装）
    if (typeof showQuestion === 'function') {
        showQuestion();
    }
}

// ゲームタイトルを設定
function setGameTitle(type) {
    const titleElement = document.getElementById('game-title');
    const titles = {
        'math': '数学ゲーム',
        'language': '言語ゲーム',
        'science': '科学クイズ'
    };
    
    if (titleElement) {
        titleElement.textContent = titles[type] || 'ゲーム';
    }
}

// 進行状況を更新
function updateProgress() {
    const currentElement = document.getElementById('current-question');
    const totalElement = document.getElementById('total-questions');
    
    if (currentElement) {
        currentElement.textContent = currentQuestionNumber;
    }
    if (totalElement) {
        totalElement.textContent = totalQuestions;
    }
}

// スコアを更新
function updateScore() {
    const scoreElement = document.getElementById('score-text');
    if (scoreElement) {
        scoreElement.textContent = `スコア: ${totalQuestions}問中${correctAnswers}問正解`;
    }
}

// 問題文を設定
function setQuestionText(text) {
    const questionElement = document.getElementById('question-text');
    if (questionElement) {
        questionElement.textContent = text;
    }
}

// 入力欄を作成（数学ゲーム用）
function createInputAnswer() {
    const answerArea = document.getElementById('answer-area');
    if (answerArea) {
        answerArea.innerHTML = `
            <input type="number" id="answer-input" class="answer-input" 
                   placeholder="答えを入力" autocomplete="off">
        `;
        
        // Enterキーで回答
        const input = document.getElementById('answer-input');
        if (input) {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    handleSubmitAnswer();
                }
            });
            input.focus();
        }
    }
}

// 選択肢を作成（言語・科学ゲーム用）
function createChoiceAnswers(choices) {
    const answerArea = document.getElementById('answer-area');
    if (answerArea) {
        let html = '<div class="choice-options">';
        choices.forEach((choice, index) => {
            html += `
                <button class="choice-btn" data-choice="${index}">
                    ${String.fromCharCode(65 + index)}. ${choice}
                </button>
            `;
        });
        html += '</div>';
        
        answerArea.innerHTML = html;
        
        // 選択肢のクリックイベント
        const choiceBtns = answerArea.querySelectorAll('.choice-btn');
        choiceBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // 他の選択肢の選択を解除
                choiceBtns.forEach(b => b.classList.remove('selected'));
                // 選択した選択肢をハイライト
                this.classList.add('selected');
            });
        });
    }
}

// 回答処理（各ゲームで上書きする）
function handleSubmitAnswer() {
    console.log('回答処理（各ゲームで実装してください）');
}

// フィードバックを表示
function showFeedback(isCorrect, message = '') {
    const feedbackElement = document.getElementById('feedback');
    if (feedbackElement) {
        feedbackElement.className = `feedback ${isCorrect ? 'correct' : 'incorrect'} show`;
        feedbackElement.textContent = message || (isCorrect ? '正解！' : '不正解...');
        
        // 3秒後にフィードバックを非表示
        setTimeout(() => {
            feedbackElement.className = 'feedback';
            feedbackElement.textContent = '';
        }, 3000);
    }
}

// 次の問題へ進む
function nextQuestion() {
    currentQuestionNumber++;
    
    if (currentQuestionNumber > totalQuestions) {
        // ゲーム終了
        endGame();
    } else {
        // 進行状況とスコアを更新
        updateProgress();
        updateScore();
        
        // 次の問題を表示（各ゲーム固有の関数）
        if (typeof showQuestion === 'function') {
            showQuestion();
        }
    }
}

// ゲーム終了
function endGame() {
    // スコアを保存
    saveGameScore();
    
    // 結果画面に遷移
    const finalScore = Math.round((correctAnswers / totalQuestions) * 100);
    window.location.href = `game-result.html?type=${gameType}&score=${finalScore}&correct=${correctAnswers}&total=${totalQuestions}`;
}

// スコアを保存
function saveGameScore() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        const userInfo = getUserInfo(currentUser);
        if (userInfo) {
            const currentScore = userInfo.scores[gameType] || 0;
            const newScore = Math.round((correctAnswers / totalQuestions) * 100);
            
            // 最高得点を更新
            if (newScore > currentScore) {
                userInfo.scores[gameType] = newScore;
                updateUserInfo(currentUser, userInfo);
            }
        }
    }
}

// ユーティリティ関数：選択された回答を取得
function getSelectedAnswer() {
    // 入力欄の場合
    const input = document.getElementById('answer-input');
    if (input) {
        return input.value.trim();
    }
    
    // 選択肢の場合
    const selected = document.querySelector('.choice-btn.selected');
    if (selected) {
        return parseInt(selected.getAttribute('data-choice'));
    }
    
    return null;
}