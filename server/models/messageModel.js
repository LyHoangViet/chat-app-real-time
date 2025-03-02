const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    message: {
      text: { type: String, required: false },
      image: { type: String, required: false }, // Thêm trường lưu trữ hình ảnh dạng base64
      type: { type: String, default: "text" } // 'text' hoặc 'image'
    },
    users: Array,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Messages", MessageSchema);