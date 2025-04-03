const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    message: {
      type: {
        type: String,
        enum: ["text", "image"],
        default: "text"
      },
      text: {
        type: String,
      },
      image: {
        type: String,
      }
    },
    users: Array,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    deletedFor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
      }
    ]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Messages", MessageSchema);