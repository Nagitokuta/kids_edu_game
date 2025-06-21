/* js/math-game.js */

// 数学ゲーム固有の変数
let mathQuestions = [];
let currentAnswer = 0;

// ページ読み込み時の初期化（共通処理の後に実行）
document.addEventListener('DOMContentLoaded', function() {
    // 少し遅延させて共通処理の後に実行
    setTimeout(() => {
        initializeMathGame();
    }, 100);
});

// 数学ゲームの初期化
function initializeMathGame() {
    // ゲームタイプを設定
    gameType = 'math';
    
    // 問題を生成
    generateMathQuestions();
    
    // 最初の問題を表示
    showQuestion();
}

// 数学問題を生成
function generateMathQuestions() {
    mathQuestions = [];
    
    for (let i = 0; i < totalQuestions; i++) {
        const question = generateRandomMathQuestion();
        mathQuestions.push(question);
    }
}

// ランダムな計算問題を生成
function generateRandomMathQuestion() {
    // 演算子をランダムに選択
    const operators = ['+', '-', '×'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    
    let num1, num2, answer, questionText;
    
    switch (operator) {
        case '+':
            num1 = Math.floor(Math.random() * 50) + 1;  // 1-50
            num2 = Math.floor(Math.random() * 50) + 1;  // 1-50
            answer = num1 + num2;
            questionText = `${num1} + ${num2} = ?`;
            break;
            
        case '-':
            // 答えが負にならないように調整
            num1 = Math.floor(Math.random() * 50) + 10; // 10-59
            num2 = Math.floor(Math.random() * num1) + 1; // 1-num1
            answer = num1 - num2;
            questionText = `${num1} - ${num2} = ?`;
            break;
            
        case '×':
            num1 = Math.floor(Math.random() * 12) + 1;  // 1-12
            num2 = Math.floor(Math.random() * 12) + 1;  // 1-12
            answer = num1 * num2;
            questionText = `${num1} × ${num2} = ?`;
            break;
    }
    
    return {
        question: questionText,
        answer: answer,
        operator: operator
    };
}

// 問題を表示（共通関数をオーバーライド）
function showQuestion() {
    if (currentQuestionNumber > totalQuestions) {
        endGame();
        return;
    }
    
    const questionData = mathQuestions[currentQuestionNumber - 1];
    currentAnswer = questionData.answer;
    
    // 問題文を設定
    setQuestionText(questionData.question);
    
    // 入力欄を作成
    createInputAnswer();
    
    // 進行状況を更新
    updateProgress();
}

// 回答処理（共通関数をオーバーライド）
function handleSubmitAnswer() {
    const userAnswer = getSelectedAnswer();
    
    // 入力チェック
    if (userAnswer === null || userAnswer === '') {
        showFeedback(false, '答えを入力してください！');
        return;
    }
    
    const userAnswerNum = parseInt(userAnswer);
    
    // 数値チェック
    if (isNaN(userAnswerNum)) {
        showFeedback(false, '数字を入力してください！');
        return;
    }
    
    // 正誤判定
    const isCorrect = userAnswerNum === currentAnswer;
    
    if (isCorrect) {
        correctAnswers++;
        showFeedback(true, `正解！ ${currentAnswer} です 🎉`);
    } else {
        showFeedback(false, `不正解... 正解は ${currentAnswer} です 😅`);
    }
    
    // スコアを更新
    updateScore();
    
    // 回答ボタンを一時的に無効化
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '次の問題へ...';
    }
    
    // 2秒後に次の問題へ
    setTimeout(() => {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = '回答する';
        }
        nextQuestion();
    }, 2000);
}

// 数学ゲーム専用のスコア計算
function calculateMathScore() {
    return Math.round((correctAnswers / totalQuestions) * 100);
}

// 数学ゲーム専用のヒント機能（発展）
function showHint() {
    const questionData = mathQuestions[currentQuestionNumber - 1];
    let hint = '';
    
    switch (questionData.operator) {
        case '+':
            hint = '足し算です。数を合わせて考えてみましょう！';
            break;
        case '-':
            hint = '引き算です。大きい数から小さい数を取り除きましょう！';
            break;
        case '×':
            hint = 'かけ算です。同じ数を何回か足すのと同じです！';
            break;
    }
    
    showFeedback(false, `ヒント: ${hint}`);
}

// デバッグ用：現在の問題と答えをコンソールに表示
function debugCurrentQuestion() {
    if (mathQuestions.length > 0) {
        const questionData = mathQuestions[currentQuestionNumber - 1];
        console.log('現在の問題:', questionData.question);
        console.log('正解:', questionData.answer);
    }
}