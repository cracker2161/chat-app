const socket = io(); // Assuming you're using socket.io
const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send-btn');
const nameInput = document.getElementById('name');

sendButton.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (name && message) {
        socket.emit('chat message', { name, message });
        messageInput.value = '';
    } else {
        alert('Please enter your name and a message');
    }
});

socket.on('chat message', ({ name, message }) => {
    const newMessage = document.createElement('div');
    newMessage.innerHTML = `<i class="fas fa-user"></i> ${name}: ${message}`;
    chatBox.appendChild(newMessage);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
});
