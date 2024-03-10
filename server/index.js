const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});
const cors = require("cors");

app.use(cors());

const users = {};

io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });

  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });

  socket.on("disconnect", () => {
    if (users[socket.id]) {
      const disconnectedUserName = users[socket.id];
      delete users[socket.id];
      socket.broadcast.emit("leave", disconnectedUserName);
    }
  });
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
