

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();

const allowedOrigin = "https://pgde-sn.mfprsp.com"; 

app.use(cors({
  origin: allowedOrigin,
  methods: ["GET", "POST"],
  credentials: true
}));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log(`✅ Client connecté : ${socket.id}`);

  socket.on('message', (data) => {
    console.log('📩 Message reçu :', data);
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client déconnecté : ${socket.id}`);
  });
});

const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur Socket.io lancé sur http://0.0.0.0:${PORT}`);
});

