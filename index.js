const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const usersFile = 'users.json';

app.use(express.static('public'));

// ইউজার তথ্য লোড করা
function loadUsers() {
    if (!fs.existsSync(usersFile)) return []; // ফাইল না থাকলে খালি অ্যারে রিটার্ন করবে
    const data = fs.readFileSync(usersFile);
    return JSON.parse(data);
}

// ইউজার তথ্য সংরক্ষণ করা
function saveUsers(users) {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

io.on('connection', (socket) => {
    // রেজিস্ট্রেশন ইভেন্ট
    socket.on('register', (data) => {
        const users = loadUsers();
        const userExists = users.some(user => user.username === data.username);

        if (userExists) {
            socket.emit('loginError', 'Username already exists.');
        } else {
            users.push(data); // ইউজার সংযোজন
            saveUsers(users); // JSON ফাইলে সংরক্ষণ
            socket.emit('loginSuccess', { username: data.username });
        }
    });

    // লগইন ইভেন্ট
    socket.on('login', (data) => {
        const users = loadUsers();
        const user = users.find(user => user.username === data.username && user.password === data.password);

        if (user) {
            socket.emit('loginSuccess', { username: user.username });
            socket.username = user.username;
            io.emit('systemMessage', `${user.username} has joined the chat`);
        } else {
            socket.emit('loginError', 'Incorrect username or password.');
        }
    });

    // মেসেজ পাঠানো ইভেন্ট
    socket.on('chatMessage', (data) => {
        io.emit('chatMessage', { username: data.username, message: data.message });
    });

    // ডিসকানেক্ট ইভেন্ট
    socket.on('disconnect', () => {
        if (socket.username) {
            io.emit('systemMessage', `${socket.username} has left the chat`);
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));