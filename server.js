const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname));

let waiting = null;

io.on('connection', socket => {
  console.log('User connected');

  socket.on('findPartner', ({ gender }) => {
    socket.gender = gender;

    if (waiting && waiting !== socket) {
      socket.partner = waiting;
      waiting.partner = socket;

      waiting = null;
    } else {
      waiting = socket;
    }
  });

  socket.on('message', msg => {
    if (socket.partner) {
      socket.partner.emit('message', msg);
    }
  });

  socket.on('disconnect', () => {
    if (socket.partner) {
      socket.partner.partner = null;
      socket.partner.emit('message', 'Stranger disconnected.');
    }
    if (waiting === socket) {
      waiting = null;
    }
  });
});

http.listen(3000, () => {
  console.log('Server running on port 3000');
});
