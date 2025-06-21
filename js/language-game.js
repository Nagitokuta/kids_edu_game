/* js/language-game.js */

// 言語ゲーム固有の変数
let languageQuestions = [];
let currentCorrectAnswer = 0;

// 単語データベース
const wordDatabase = [
    { english: 'apple', japanese: 'りんご' },
    { english: 'book', japanese: '本' },
    { english: 'cat', japanese: 'ねこ' },
    { english: 'dog', japanese: 'いぬ' },
    { english: 'egg', japanese: 'たまご' },
    { english: 'fish', japanese: 'さかな' },
    { english: 'green', japanese: 'みどり' },
    { english: 'house', japanese: 'いえ' },
    { english: 'ice', japanese: 'こおり' },
    { english: 'juice', japanese: 'ジュース' },
    { english: 'key', japanese: 'かぎ' },
    { english: 'lemon', japanese: 'レモン' },
    { english: 'milk', japanese: 'ぎゅうにゅう' },
    { english: 'nose', japanese: 'はな' },
    { english: 'orange', japanese: 'オレンジ' },
    { english: 'pen', japanese: 'ペン' },
    { english: 'queen', japanese: 'じょうおう' },
    { english: 'red', japanese: 'あか' },
    { english: 'sun', japanese: 'たいよう' },
    { english: 'tree', japanese: 'き' },
    { english: 'umbrella', japanese: 'かさ' },
    { english: 'violin', japanese: 'バイオリン' },
    { english: 'water', japanese: 'みず' },
    { english: 'yellow', japanese: 'きいろ' },
    { english: 'zoo', japanese: 'どうぶつえん' }
];

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initializeLanguageGame();
    }, 100);
});

// 言語ゲームの初期化
function initializeLanguageGame() {
    gameType = 'language';
    generateLanguageQuestions();
    showQuestion();
}
// 難易度別単語データベース
const difficultyLevels = {
    easy: wordDatabase.filter(word => word.english.length <= 4),
    normal: wordDatabase.filter(word => word.english.length <= 6),
    hard: wordDatabase
};
// カテゴリ別単語
const categories = {
    animals: ['cat', 'dog', 'fish'],
    food: ['apple', 'egg', 'milk'],
    colors: ['red', 'green', 'yellow'],
    objects: ['book', 'pen', 'key']
};
// 間違えた単語を記録
function recordMistake(word) {
    const mistakes = JSON.parse(localStorage.getItem('languageMistakes') || '[]');
    if (!mistakes.includes(word)) {
        mistakes.push(word);
        localStorage.setItem('languageMistakes', JSON.stringify(mistakes));
    }
}
// 言語問題を生成
function generateLanguageQuestions() {
    languageQuestions = [];
    
    // 使用済み単語を追跡
    const usedWords = [];
    
    for (let i = 0; i < totalQuestions; i++) {
        const question = generateRandomLanguageQuestion(usedWords);
        languageQuestions.push(question);
        usedWords.push(question.correctWord);
    }
}

// ランダムな言語問題を生成
function generateRandomLanguageQuestion(usedWords) {
    // 使用可能な単語をフィルタリング
    const availableWords = wordDatabase.filter(word => !usedWords.includes(word));
    
    // ランダムに正解の単語を選択
    const correctWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    
    // 不正解の選択肢を生成
    const wrongChoices = generateWrongChoices(correctWord, 2);
    
    // 選択肢をシャッフル
    const choices = [correctWord.japanese, ...wrongChoices];
    const shuffledChoices = shuffleArray(choices);
    
    // 正解のインデックスを取得
    const correctIndex = shuffledChoices.indexOf(correctWord.japanese);
    
    return {
        english: correctWord.english,
        japanese: correctWord.japanese,
        choices: shuffledChoices,
        correctIndex: correctIndex,
        correctWord: correctWord
    };
}

// 不正解の選択肢を生成
function generateWrongChoices(correctWord, count) {
    const wrongChoices = [];
    const availableChoices = wordDatabase.filter(word => word.japanese !== correctWord.japanese);
    
    while (wrongChoices.length < count && availableChoices.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableChoices.length);
        const choice = availableChoices.splice(randomIndex, 1)[0];
        wrongChoices.push(choice.japanese);
    }
    
    return wrongChoices;
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
    
    const questionData = languageQuestions[currentQuestionNumber - 1];
    currentCorrectAnswer = questionData.correctIndex;
    
    // 問題文を設定
    setQuestionText(`「${questionData.english}」の日本語は？`);
    
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
    
    const questionData = languageQuestions[currentQuestionNumber - 1];
    const isCorrect = selectedChoice === currentCorrectAnswer;
    
    if (isCorrect) {
        correctAnswers++;
        showFeedback(true, `正解！「${questionData.english}」は「${questionData.japanese}」です 🎉`);
    } else {
        const selectedText = questionData.choices[selectedChoice];
        showFeedback(false, `不正解... 「${questionData.english}」は「${questionData.japanese}」です 😅`);
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
    
    // 3秒後に次の問題へ
    setTimeout(() => {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = '回答する';
        }
        nextQuestion();
    }, 3000);
}

// 選択肢を無効化
function disableChoices() {
    const choiceBtns = document.querySelectorAll('.choice-btn');
    choiceBtns.forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.6';
    });
}

// 言語ゲーム専用のスコア計算
function calculateLanguageScore() {
    return Math.round((correctAnswers / totalQuestions) * 100);
}

// 言語ゲーム専用のヒント機能
function showHint() {
    const questionData = languageQuestions[currentQuestionNumber - 1];
    const englishWord = questionData.english;
    
    // 簡単なヒントを生成
    let hint = '';
    if (englishWord.length <= 3) {
        hint = `短い単語です（${englishWord.length}文字）`;
    } else if (englishWord.length <= 5) {
        hint = `普通の長さの単語です（${englishWord.length}文字）`;
    } else {
        hint = `長い単語です（${englishWord.length}文字）`;
    }
    
    // 最初の文字をヒントとして表示
    hint += `。最初の文字は「${englishWord[0].toUpperCase()}」です。`;
    
    showFeedback(false, `ヒント: ${hint}`);
}

// 単語の発音機能（発展）
function pronounceWord() {
    const questionData = languageQuestions[currentQuestionNumber - 1];
    const englishWord = questionData.english;
    
    // Web Speech API を使用（対応ブラウザのみ）
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(englishWord);
        utterance.lang = 'en-US';
        utterance.rate = 0.8; // ゆっくり発音
        speechSynthesis.speak(utterance);
    } else {
        showFeedback(false, 'このブラウザでは音声機能がサポートされていません。');
    }
}

// デバッグ用：現在の問題と答えをコンソールに表示
function debugCurrentQuestion() {
    if (languageQuestions.length > 0) {
        const questionData = languageQuestions[currentQuestionNumber - 1];
        console.log('現在の問題:', questionData.english);
        console.log('正解:', questionData.japanese);
        console.log('選択肢:', questionData.choices);
        console.log('正解インデックス:', questionData.correctIndex);
    }
}

// 単語データベースの統計情報
function getWordStats() {
    return {
        totalWords: wordDatabase.length,
        averageLength: wordDatabase.reduce((sum, word) => sum + word.english.length, 0) / wordDatabase.length,
        shortestWord: wordDatabase.reduce((shortest, word) => 
            word.english.length < shortest.english.length ? word : shortest),
        longestWord: wordDatabase.reduce((longest, word) => 
            word.english.length > longest.english.length ? word : longest)
    };
}