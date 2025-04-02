const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
      role: {
        type: String,
        enum: ["admin", "member"],
        default: "member",
      },
      joinedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  messages: [
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
      content: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
      type: {
        type: String,
        enum: ["text", "image", "video", "file"],
        default: "text",
      },
      fileUrl: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  avatarImage: {
    type: String, // Ảnh đại diện nhóm
  },

  description: String, // Mô tả nhóm
  isPrivate: {
    type: Boolean,
    default: false,
  },
  lastMessage: {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    content: String,
    timestamp: {
      type: Date,
    },
  },
});

module.exports = mongoose.model("Groups", groupSchema);
