const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const app = express();
const socket = require("socket.io");
require("dotenv").config();

app.use(cors());
// Tăng giới hạn kích thước dữ liệu JSON để xử lý hình ảnh Base64
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection Successful");
  })
  .catch((err) => {
    console.log("DB Connection Error:", err.message);
  });

app.get("/ping", (_req, res) => {
  return res.json({ msg: "Ping Successful" });
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on \${process.env.PORT}`)
);
const io = socket(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });

  // Xử lý sự kiện gửi hình ảnh
  socket.on("send-image", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("image-receive", {
        image: data.image,
        from: data.from
      });
    }
  });

  // Trong phần xử lý socket
  socket.on("delete-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      // Gửi sự kiện xóa tới người nhận
      io.to(sendUserSocket).emit("msg-deleted", data.messageId);
    }
  });
});