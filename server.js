const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const messageformat = require("./utils/message");
const {
  userJoin,
  getCurrentUser,
  getRoomUsers,
  userLeave,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname, "Public")));

//Run when a client is connect

const botName = "Chateev-Bot";

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    socket.emit("message", messageformat(botName, "Welcome to Chateev!!!"));

    //BroadCast when a user connects

    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        messageformat(botName, `${user.username} has joined the chat`)
      );

    //Send users and room info

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  //listen for chat-message
  socket.on("chat-message", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", messageformat(user.username, msg));
  });

  //Runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        messageformat(botName, `${user.username} has left the chat`)
      );

      //Send users and room info

      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const PORT = 3000;

server.listen(PORT, () => console.log(`Listening on Port ${PORT}`));
