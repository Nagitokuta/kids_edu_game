/* js/score-manager.js */

// 成績管理クラス
class ScoreManager {
    constructor() {
        this.STORAGE_KEY = 'users';
        this.CURRENT_USER_KEY = 'currentUser';
    }

    // 現在のユーザーの成績データを取得
    getUserScores(username = null) {
        const currentUser = username || this.getCurrentUser();
        if (!currentUser) return null;

        const users = this.getUsers();
        const user = users.find(u => u.username === currentUser);
        
        return user ? user.scores : {
            math: 0,
            language: 0,
            science: 0
        };
    }

    // スコアを更新
    updateScore(gameType, newScore, username = null) {
        const currentUser = username || this.getCurrentUser();
        if (!currentUser) return false;

        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.username === currentUser);
        
        if (userIndex === -1) return false;

        // 現在の最高得点と比較
        const currentHighScore = users[userIndex].scores[gameType] || 0;
        
        if (newScore > currentHighScore) {
            users[userIndex].scores[gameType] = newScore;
            this.saveUsers(users);
            return true; // 新記録
        }
        
        return false; // 記録更新なし
    }

    // 総合得点を計算
    getTotalScore(username = null) {
        const scores = this.getUserScores(username);
        if (!scores) return 0;

        return (scores.math || 0) + (scores.language || 0) + (scores.science || 0);
    }

    // 平均得点を計算
    getAverageScore(username = null) {
        const scores = this.getUserScores(username);
        if (!scores) return 0;

        const total = this.getTotalScore(username);
        return Math.round(total / 3);
    }

    // 最も得意なゲームを取得
    getBestGame(username = null) {
        const scores = this.getUserScores(username);
        if (!scores) return null;

        const gameNames = {
            math: '数学ゲーム',
            language: '言語ゲーム',
            science: '科学クイズ'
        };

        let bestGame = 'math';
        let bestScore = scores.math || 0;

        Object.keys(scores).forEach(game => {
            if ((scores[game] || 0) > bestScore) {
                bestGame = game;
                bestScore = scores[game];
            }
        });

        return {
            game: bestGame,
            gameName: gameNames[bestGame],
            score: bestScore
        };
    }

    // 成績統計を取得
    getScoreStats(username = null) {
        const scores = this.getUserScores(username);
        if (!scores) return null;

        const total = this.getTotalScore(username);
        const average = this.getAverageScore(username);
        const bestGame = this.getBestGame(username);

        return {
            scores: scores,
            total: total,
            average: average,
            bestGame: bestGame,
            gamesPlayed: this.getGamesPlayedCount(scores)
        };
    }

    // プレイしたゲーム数を取得
    getGamesPlayedCount(scores) {
        let count = 0;
        Object.values(scores).forEach(score => {
            if (score > 0) count++;
        });
        return count;
    }

    // 成績をリセット
    resetScores(username = null) {
        const currentUser = username || this.getCurrentUser();
        if (!currentUser) return false;

        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.username === currentUser);
        
        if (userIndex === -1) return false;

        users[userIndex].scores = {
            math: 0,
            language: 0,
            science: 0
        };

        this.saveUsers(users);
        return true;
    }

    // ランキング機能（全ユーザーの総合得点順）
    getTotalScoreRanking() {
        const users = this.getUsers();
        const ranking = users.map(user => ({
            username: user.username,
            totalScore: this.getTotalScore(user.username),
            scores: user.scores
        }));

        // 総合得点順でソート
        ranking.sort((a, b) => b.totalScore - a.totalScore);
        return ranking;
    }

    // ゲーム別ランキング
    getGameRanking(gameType) {
        const users = this.getUsers();
        const ranking = users.map(user => ({
            username: user.username,
            score: user.scores[gameType] || 0
        }));

        // スコア順でソート
        ranking.sort((a, b) => b.score - a.score);
        return ranking.filter(user => user.score > 0);
    }

    // プライベートメソッド
    getCurrentUser() {
        return localStorage.getItem(this.CURRENT_USER_KEY);
    }

    getUsers() {
        const usersData = localStorage.getItem(this.STORAGE_KEY);
        return usersData ? JSON.parse(usersData) : [];
    }

    saveUsers(users) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    }
}

// グローバルインスタンスを作成
const scoreManager = new ScoreManager();

// 既存の関数との互換性を保つためのラッパー関数
function getUserScores(username) {
    return scoreManager.getUserScores(username);
}

function updateUserScore(gameType, newScore, username) {
    return scoreManager.updateScore(gameType, newScore, username);
}

function getTotalScore(username) {
    return scoreManager.getTotalScore(username);
}