const express = require('express');
const app = express();

const http = require('http');
const port = 9000;

//Socket.io
const {Server} = require('socket.io');
const server = http.createServer(app);
const io = new Server(server);


app.use(express.static('./public'));

app.get('/',(req,res)=>{
    return res.sendFile('./public/index.html');
});

io.on('connection', (socket) => {
    socket.on('user-message',(message)=>{
        io.emit('message',message);
    })
})

server.listen(port,()=>{
    console.log(`server listing at http://localhost:${port}`)
})