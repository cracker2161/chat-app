const socket = io();
let username = '';

// রেজিস্ট্রেশন ফাংশন
function register() {
    const regUsername = document.getElementById('reg-username').value.trim();
    const regPassword = document.getElementById('reg-password').value.trim();

    if (regUsername && regPassword) {
        socket.emit('register', { username: regUsername, password: regPassword });
    } else {
        alert('Please enter a username and password');
    }
}

// লগইন ফাংশন
function login() {
    const loginUsername = document.getElementById('login-username').value.trim();
    const loginPassword = document.getElementById('login-password').value.trim();

    if (loginUsername && loginPassword) {
        socket.emit('login', { username: loginUsername, password: loginPassword });
    } else {
        alert('Please enter a username and password');
    }
}

// লগইন সফল হলে
socket.on('loginSuccess', (user) => {
    username = user.username;
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('chat-section').style.display = 'block';
});

// লগইন ব্যর্থ হলে
socket.on('loginError', (msg) => {
    alert(msg);
});

// মেসেজ পাঠানোর জন্য ফাংশন
function sendMessage() {
    const message = document.getElementById('chat-input').value.trim();
    if (message) {
        socket.emit('chatMessage', { username, message });
        document.getElementById('chat-input').value = '';
    }
}

// মেসেজ রিসিভ ও দেখানো
socket.on('chatMessage', (data) => {
    displayMessage(data.username, data.message, data.username === username);
});

// মেসেজ দেখানোর জন্য ফাংশন
function displayMessage(sender, message, isMyMessage) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', isMyMessage ? 'my-message' : 'other-message');
    messageElement.innerHTML = `
        <span class="user-icon"><i class="fas fa-user"></i></span>
        <span class="message-text"><strong>${sender}</strong>: ${message}</span>
    `;
    document.getElementById('chat-box').appendChild(messageElement);
    document.getElementById('chat-box').scrollTop = document.getElementById('chat-box').scrollHeight;
}

// সিস্টেম মেসেজ
socket.on('systemMessage', (msg) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('system-message');
    messageElement.textContent = msg;
    document.getElementById('chat-box').appendChild(messageElement);
});