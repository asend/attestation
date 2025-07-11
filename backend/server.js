// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

io.on('connection', (socket) => {
  console.log('Un client est connecté');

  socket.on('message', (msg) => {
    console.log('Message reçu : ', msg);
    io.emit('message', msg); // renvoyer à tous
  });

  socket.on('disconnect', () => {
    console.log('Client déconnecté');
  });
});

server.listen(3000, () => {
  console.log('Serveur Socket.io sur http://localhost:3000');
});
