const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname, "Public")));

//Run when a client is connect

io.on("connection", (socket) => {
  console.log("New Connection");
  socket.emit("message", "Welcome to Chateev!!!");

  //BroadCast when a user connects

  socket.broadcast.emit("message", "A user has joined the chat");

  //Runs when client disconnects
  socket.on("disconnect", () => {
    io.emit("message", "A user has left the chat");
  });

  //listen for chat-message
  socket.on("chat-message", (msg) => {
    io.emit("message", msg);
  });
});

const PORT = 3000;

server.listen(PORT, () => console.log(`Listening on Port ${PORT}`));
