const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
    console.log('a user connected');

    // Draw
    socket.on("draw", (data) => {
        io.emit("draw", data);
      });

    // Clear
    socket.on("clear", () => {
      io.emit("clear");
    });
    
  });

  server.listen(3000, () => {
    console.log('listening on *:3000');
  });