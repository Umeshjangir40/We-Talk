const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use(express.static(__dirname));

let waitingUsers = [];

io.on('connection', (socket) => {
  socket.on('findPartner', ({ gender }) => {
    socket.gender = gender;
    let partner = waitingUsers.find(user => user.gender === 'any' || gender === 'any' || user.gender === gender);
    if (partner) {
      waitingUsers = waitingUsers.filter(u => u !== partner);
      socket.partnerId = partner.id;
      partner.partnerId = socket.id;
      io.to(partner.id).emit('message', 'Stranger connected.');
      io.to(socket.id).emit('message', 'Stranger connected.');
    } else {
      waitingUsers.push({ id: socket.id, gender });
    }
  });

  socket.on('message', (msg) => {
    if (socket.partnerId) {
      io.to(socket.partnerId).emit('message', msg);
    }
  });

  socket.on('disconnectPartner', () => {
    if (socket.partnerId) {
      io.to(socket.partnerId).emit('partnerDisconnected');
      const partner = io.sockets.sockets.get(socket.partnerId);
      if (partner) partner.partnerId = null;
    }
    socket.partnerId = null;
  });

  socket.on('disconnect', () => {
    waitingUsers = waitingUsers.filter(user => user.id !== socket.id);
    if (socket.partnerId) {
      io.to(socket.partnerId).emit('partnerDisconnected');
      const partner = io.sockets.sockets.get(socket.partnerId);
      if (partner) partner.partnerId = null;
    }
  });
});

http.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
