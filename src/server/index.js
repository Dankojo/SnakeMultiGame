const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use('/dist', express.static(path.join(__dirname, '../../dist')));

app.get('/h', (req, res) => {
    res.send('hello world');
});

http.listen(port, () => {
    console.log('Server started');
});

io.on('connection', function (socket) {

    socket.on('snake moved', function (data) {
        socket.broadcast.emit('snake move', data);
    });

    socket.on('add food', function (data) {
        socket.broadcast.emit('new food', data);
    });

});