const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    socket.on('joinChat', (username) => {
        socket.username = username;
        socket.broadcast.emit('systemMessage', `${username} has joined the chat`);
    });

    socket.on('chatMessage', (data) => {
        const time = new Date().toLocaleTimeString();
        io.emit('chatMessage', { username: data.username, message: data.message, time });
    });

    socket.on('disconnect', () => {
        io.emit('systemMessage', `${socket.username} has left the chat`);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
