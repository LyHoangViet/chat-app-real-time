const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const socket = require("socket.io");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const groupController = require("./controllers/userController");

const app = express();
const server = app.listen(process.env.PORT, () =>
  console.log(`🚀 Server started on port ${process.env.PORT}`)
);

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ DB Connection Successful"))
  .catch((err) => console.log("❌ DB Connection Error:", err.message));

// Routes
app.get("/ping", (_req, res) => res.json({ msg: "Ping Successful" }));
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Socket setup
const io = socket(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

const onlineUsers = new Map();
groupController.setSocketInstance(io, onlineUsers);

io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log("✅ Mapped user", userId, "->", socket.id);
  });

  socket.on("send-msg", ({ to, from, msg, type, isGroup }) => {
    if (isGroup) {
      socket.broadcast.emit("msg-recieve", { to, from, msg, type, isGroup });
    } else {
      const sendUserSocket = onlineUsers.get(to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve", {
          from,
          msg,
          type,
          isGroup: false,
        });
      }
    }
  });

  socket.on("send-image", ({ to, image, from }) => {
    const sendUserSocket = onlineUsers.get(to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("image-receive", { image, from });
    }
  });

  socket.on("delete-msg", ({ to, messageId }) => {
    const sendUserSocket = onlineUsers.get(to);
    if (sendUserSocket) {
      io.to(sendUserSocket).emit("msg-deleted", messageId);
    }
  });

  socket.on("update-msg", ({ to, messageId, newContent }) => {
    const sendUserSocket = onlineUsers.get(to);
    if (sendUserSocket) {
      io.to(sendUserSocket).emit("msg-updated", { messageId, newContent });
    }
  });
});
