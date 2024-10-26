const socket = io();

let username = '';

function joinChat() {
    username = document.getElementById('username').value.trim();
    if (username) {
        document.getElementById('user-section').style.display = 'none';
        document.getElementById('chat-section').style.display = 'block';
        socket.emit('joinChat', username);
    } else {
        alert('Please enter a username');
    }
}

function sendMessage() {
    const message = document.getElementById('chat-input').value.trim();
    if (message) {
        socket.emit('chatMessage', { username, message });
        displayMessage(username, message, true);  // নিজের মেসেজ ডান পাশে দেখানো
        document.getElementById('chat-input').value = '';
    }
}

// মেসেজ রিসিভ এবং ডান-বাম অ্যাডজাস্ট
socket.on('chatMessage', (data) => {
    const { username: sender, message, time } = data;
    displayMessage(sender, message, sender === username);
});

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

// সিস্টেম নোটিফিকেশন
socket.on('systemMessage', (msg) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('system-message');
    messageElement.textContent = msg;
    document.getElementById('chat-box').appendChild(messageElement);
});
