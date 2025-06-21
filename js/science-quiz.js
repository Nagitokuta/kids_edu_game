/* js/science-quiz.js */

// 科学クイズ固有の変数
let scienceQuestions = [];
let currentCorrectAnswer = 0;

// 科学知識データベース
const scienceDatabase = [
    {
        question: '水の化学式は？',
        choices: ['H2O', 'CO2', 'O2'],
        correct: 0,
        explanation: 'H2Oは水素原子2個と酸素原子1個からできています。',
        category: 'chemistry'
    },
    {
        question: '地球に一番近い星は？',
        choices: ['太陽', '月', '火星'],
        correct: 0,
        explanation: '太陽は地球から約1億5000万km離れた一番近い恒星です。',
        category: 'astronomy'
    },
    {
        question: '人間の体で一番大きな臓器は？',
        choices: ['心臓', '肝臓', '皮膚'],
        correct: 2,
        explanation: '皮膚は体重の約16%を占める最大の臓器です。',
        category: 'biology'
    },
    {
        question: '光の速度は秒速何km？',
        choices: ['約30万km', '約3万km', '約300万km'],
        correct: 0,
        explanation: '光の速度は秒速約30万km（正確には299,792,458m/s）です。',
        category: 'physics'
    },
    {
        question: '植物が光合成で作り出すのは？',
        choices: ['二酸化炭素', '酸素', '窒素'],
        correct: 1,
        explanation: '植物は光合成で二酸化炭素と水から酸素と糖を作ります。',
        category: 'biology'
    },
    {
        question: '恐竜が生きていた時代は？',
        choices: ['中生代', '古生代', '新生代'],
        correct: 0,
        explanation: '恐竜は中生代（約2億5000万年前〜6600万年前）に栄えました。',
        category: 'geology'
    },
    {
        question: '雲はどうやってできる？',
        choices: ['水蒸気が冷えて', '風が強くなって', '気圧が下がって'],
        correct: 0,
        explanation: '水蒸気が上空で冷やされて小さな水滴になり、雲ができます。',
        category: 'meteorology'
    },
    {
        question: '磁石のN極とS極では？',
        choices: ['同じ極同士がくっつく', '違う極同士がくっつく', 'どちらも同じ'],
        correct: 1,
        explanation: '磁石は異なる極（N極とS極）同士が引き合います。',
        category: 'physics'
    },
    {
        question: '血液を全身に送るポンプの役割をするのは？',
        choices: ['肺', '心臓', '腎臓'],
        correct: 1,
        explanation: '心臓は血液を全身に送り出すポンプの働きをしています。',
        category: 'biology'
    },
    {
        question: '地球の表面の約何％が海？',
        choices: ['約50％', '約70％', '約90％'],
        correct: 1,
        explanation: '地球の表面の約70％が海で覆われています。',
        category: 'geography'
    },
    {
        question: '音が伝わる速度が一番速いのは？',
        choices: ['空気中', '水中', '鉄の中'],
        correct: 2,
        explanation: '音は固体（鉄など）の中を一番速く伝わります。',
        category: 'physics'
    },
    {
        question: '虹は何色に見える？',
        choices: ['5色', '7色', '10色'],
        correct: 1,
        explanation: '虹は赤・橙・黄・緑・青・藍・紫の7色に見えます。',
        category: 'physics'
    },
    {
        question: '蝶と蛾の違いは？',
        choices: ['触角の形', '羽の色', '大きさ'],
        correct: 0,
        explanation: '蝶の触角は棒状、蛾の触角は羽毛状や糸状です。',
        category: 'biology'
    },
    {
        question: '月の満ち欠けの周期は？',
        choices: ['約28日', '約30日', '約35日'],
        correct: 0,
        explanation: '月の満ち欠けは約28日（正確には29.5日）の周期です。',
        category: 'astronomy'
    },
    {
        question: '電気を通しやすいのは？',
        choices: ['プラスチック', '銅', 'ゴム'],
        correct: 1,
        explanation: '銅は電気をよく通す金属です。',
        category: 'physics'
    }
];

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initializeScienceQuiz();
    }, 100);
});

// 科学クイズの初期化
function initializeScienceQuiz() {
    gameType = 'science';
    generateScienceQuestions();
    showQuestion();
}

// 科学問題を生成
function generateScienceQuestions() {
    scienceQuestions = [];
    
    // 使用済み問題を追跡
    const usedQuestions = [];
    
    for (let i = 0; i < totalQuestions; i++) {
        const question = generateRandomScienceQuestion(usedQuestions);
        scienceQuestions.push(question);
        usedQuestions.push(question);
    }
}

// ランダムな科学問題を生成
function generateRandomScienceQuestion(usedQuestions) {
    // 使用可能な問題をフィルタリング
    const availableQuestions = scienceDatabase.filter(q => !usedQuestions.includes(q));
    
    // ランダムに問題を選択
    const selectedQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    
    // 選択肢をシャッフル
    const shuffledChoices = shuffleArray([...selectedQuestion.choices]);
    
    // 正解のインデックスを取得
    const originalCorrectAnswer = selectedQuestion.choices[selectedQuestion.correct];
    const correctIndex = shuffledChoices.indexOf(originalCorrectAnswer);
    
    return {
        question: selectedQuestion.question,
        choices: shuffledChoices,
        correctIndex: correctIndex,
        correctAnswer: originalCorrectAnswer,
        explanation: selectedQuestion.explanation,
        category: selectedQuestion.category,
        originalData: selectedQuestion
    };
}

// 配列をシャッフル
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// 問題を表示（共通関数をオーバーライド）
function showQuestion() {
    if (currentQuestionNumber > totalQuestions) {
        endGame();
        return;
    }
    
    const questionData = scienceQuestions[currentQuestionNumber - 1];
    currentCorrectAnswer = questionData.correctIndex;
    
    // 問題文を設定
    setQuestionText(questionData.question);
    
    // 選択肢を作成
    createChoiceAnswers(questionData.choices);
    
    // 進行状況を更新
    updateProgress();
}

// 回答処理（共通関数をオーバーライド）
function handleSubmitAnswer() {
    const selectedChoice = getSelectedAnswer();
    
    // 選択チェック
    if (selectedChoice === null) {
        showFeedback(false, '選択肢を選んでください！');
        return;
    }
    
    const questionData = scienceQuestions[currentQuestionNumber - 1];
    const isCorrect = selectedChoice === currentCorrectAnswer;
    
    if (isCorrect) {
        correctAnswers++;
        showFeedback(true, `正解！ ${questionData.explanation} 🎉`);
    } else {
        const selectedText = questionData.choices[selectedChoice];
        showFeedback(false, `不正解... 正解は「${questionData.correctAnswer}」です。${questionData.explanation} 😅`);
    }
    
    // スコアを更新
    updateScore();
    
    // 回答ボタンを一時的に無効化
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '次の問題へ...';
    }
    
    // 選択肢を無効化
    disableChoices();
    
    // 正解の選択肢をハイライト
    highlightCorrectAnswer();
    
    // 4秒後に次の問題へ（解説を読む時間を確保）
    setTimeout(() => {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = '回答する';
        }
        nextQuestion();
    }, 4000);
}

// 選択肢を無効化
function disableChoices() {
    const choiceBtns = document.querySelectorAll('.choice-btn');
    choiceBtns.forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.6';
    });
}

// 正解の選択肢をハイライト
function highlightCorrectAnswer() {
    const choiceBtns = document.querySelectorAll('.choice-btn');
    choiceBtns.forEach((btn, index) => {
        if (index === currentCorrectAnswer) {
            btn.style.backgroundColor = '#28a745';
            btn.style.color = 'white';
            btn.style.opacity = '1';
        }
    });
}

// 科学クイズ専用のスコア計算
function calculateScienceScore() {
    return Math.round((correctAnswers / totalQuestions) * 100);
}

// 科学クイズ専用のヒント機能
function showHint() {
    const questionData = scienceQuestions[currentQuestionNumber - 1];
    const category = questionData.category;
    
    const categoryHints = {
        'chemistry': '化学に関する問題です。原子や分子について考えてみましょう。',
        'biology': '生物学に関する問題です。生き物の体や働きについて考えてみましょう。',
        'physics': '物理学に関する問題です。物の動きや性質について考えてみましょう。',
        'astronomy': '天文学に関する問題です。宇宙や星について考えてみましょう。',
        'geology': '地学に関する問題です。地球の歴史や構造について考えてみましょう。',
        'meteorology': '気象学に関する問題です。天気や気候について考えてみましょう。',
        'geography': '地理学に関する問題です。地球の表面について考えてみましょう。'
    };
    
    const hint = categoryHints[category] || '科学の基礎知識について考えてみましょう。';
    showFeedback(false, `ヒント: ${hint}`);
}

// カテゴリ別統計
function getCategoryStats() {
    const categories = {};
    scienceDatabase.forEach(q => {
        if (!categories[q.category]) {
            categories[q.category] = 0;
        }
        categories[q.category]++;
    });
    return categories;
}

// 難易度別問題フィルタ
function getQuestionsByDifficulty(difficulty) {
    // 簡易的な難易度判定（問題文の長さで判定）
    switch(difficulty) {
        case 'easy':
            return scienceDatabase.filter(q => q.question.length <= 15);
        case 'normal':
            return scienceDatabase.filter(q => q.question.length > 15 && q.question.length <= 25);
        case 'hard':
            return scienceDatabase.filter(q => q.question.length > 25);
        default:
            return scienceDatabase;
    }
}

// デバッグ用：現在の問題と答えをコンソールに表示
function debugCurrentQuestion() {
    if (scienceQuestions.length > 0) {
        const questionData = scienceQuestions[currentQuestionNumber - 1];
        console.log('現在の問題:', questionData.question);
        console.log('正解:', questionData.correctAnswer);
        console.log('選択肢:', questionData.choices);
        console.log('正解インデックス:', questionData.correctIndex);
        console.log('解説:', questionData.explanation);
        console.log('カテゴリ:', questionData.category);
    }
}

// 学習進捗の記録
function recordScienceProgress(questionData, isCorrect) {
    const progress = JSON.parse(localStorage.getItem('scienceProgress') || '{}');
    const category = questionData.category;
    
    if (!progress[category]) {
        progress[category] = { correct: 0, total: 0 };
    }
    
    progress[category].total++;
    if (isCorrect) {
        progress[category].correct++;
    }
    
    localStorage.setItem('scienceProgress', JSON.stringify(progress));
}

// 科学知識データベースの統計情報
function getScienceStats() {
    const categories = getCategoryStats();
    return {
        totalQuestions: scienceDatabase.length,
        categories: categories,
        averageChoices: scienceDatabase.reduce((sum, q) => sum + q.choices.length, 0) / scienceDatabase.length
    };
}