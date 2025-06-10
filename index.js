const express = require('express');
const app = express();

const http = require('http');
const port = 9000;

//Socket.io
const {Server} = require('socket.io');
const server = http.createServer(app);
const io = new Server(server);

// Store usernames
const users = new Map();

app.use(express.static('./public'));

app.get('/',(req,res)=>{
    return res.sendFile('./public/index.html');
});

io.on('connection', (socket) => {
    // Handle setting username
    socket.on('set-username', (username) => {
        users.set(socket.id, username);
        io.emit('message', {
            username: 'System',
            message: `${username} has joined the chat`
        });
    });

    // Handle messages
    socket.on('user-message', (message) => {
        const username = users.get(socket.id) || 'Anonymous';
        io.emit('message', {
            username: username,
            message: message
        });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        const username = users.get(socket.id);
        if (username) {
            io.emit('message', {
                username: 'System',
                message: `${username} has left the chat`
            });
            users.delete(socket.id);
        }
    });
});

server.listen(port,()=>{
    console.log(`server listing at http://localhost:${port}`)
})