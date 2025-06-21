/* js/auth.js - 完全版 */

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    // ログイン画面の処理
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // 新規登録画面の処理
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

// ログイン処理
function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!validateLoginInput(username, password)) {
        return;
    }

    const user = authenticateUser(username, password);
    if (user) {
        setCurrentUser(username);
        showMessage('ログイン成功！ゲーム選択画面へ移動します...', 'success');
        
        setTimeout(() => {
            window.location.href = 'game-select.html';
        }, 1500);
    } else {
        showMessage('ユーザー名またはパスワードが間違っています。', 'error');
    }
}

// 新規登録処理
function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value;
    const passwordConfirm = document.getElementById('reg-password-confirm').value;

    if (!validateRegisterInput(username, password, passwordConfirm)) {
        return;
    }

    if (isUserExists(username)) {
        showMessage('そのユーザー名は既に使われています。', 'error');
        return;
    }

    const newUser = {
        username: username,
        password: password,
        scores: {
            math: 0,
            language: 0,
            science: 0
        }
    };

    saveUser(newUser);
    showMessage('登録完了！ログイン画面へ移動します...', 'success');

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// ログイン入力値チェック
function validateLoginInput(username, password) {
    if (username === '' || password === '') {
        showMessage('ユーザー名とパスワードを入力してください。', 'error');
        return false;
    }
    return true;
}

// 新規登録入力値チェック
function validateRegisterInput(username, password, passwordConfirm) {
    if (username === '' || password === '' || passwordConfirm === '') {
        showMessage('すべての項目を入力してください。', 'error');
        return false;
    }

    if (username.length < 3) {
        showMessage('ユーザー名は3文字以上で入力してください。', 'error');
        return false;
    }

    if (password.length < 4) {
        showMessage('パスワードは4文字以上で入力してください。', 'error');
        return false;
    }

    if (password !== passwordConfirm) {
        showMessage('パスワードが一致しません。', 'error');
        return false;
    }

    return true;
}

// ユーザー認証
function authenticateUser(username, password) {
    const users = getUsers();
    return users.find(user => user.username === username && user.password === password);
}

// ユーザー存在チェック
function isUserExists(username) {
    const users = getUsers();
    return users.some(user => user.username === username);
}

// ユーザー保存
function saveUser(newUser) {
    const users = getUsers();
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
}

// 現在のユーザー設定
function setCurrentUser(username) {
    localStorage.setItem('currentUser', username);
}

// 現在のユーザー取得
function getCurrentUser() {
    return localStorage.getItem('currentUser');
}

// ログアウト
function logout() {
    localStorage.removeItem('currentUser');
    showMessage('ログアウトしました。', 'success');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// ログイン状態チェック
function checkLoginStatus() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// ユーザー一覧取得
function getUsers() {
    const usersData = localStorage.getItem('users');
    return usersData ? JSON.parse(usersData) : [];
}

// メッセージ表示
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

// ユーザー情報取得
function getUserInfo(username) {
    const users = getUsers();
    return users.find(user => user.username === username);
}

// ユーザー情報更新
function updateUserInfo(username, updatedInfo) {
    const users = getUsers();
    const userIndex = users.findIndex(user => user.username === username);
    
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedInfo };
        localStorage.setItem('users', JSON.stringify(users));
        return true;
    }
    return false;
}