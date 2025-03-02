const router = require("express").Router();
const Messages = require("../models/messageModel");

router.post("/addmsg", async (req, res, next) => {
  try {
    const { from, to, message, type } = req.body;
    
    // Tạo đối tượng dữ liệu tin nhắn dựa trên loại tin nhắn
    const messageData = {
      message: {
        type: type || "text"
      },
      users: [from, to],
      sender: from,
    };
    
    // Gán dữ liệu dựa trên loại tin nhắn
    if (type === "image") {
      messageData.message.image = message;
    } else {
      messageData.message.text = message;
    }
    
    const data = await Messages.create(messageData);

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
});

router.post("/getmsg", async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        type: msg.message.type,
        message: msg.message.type === "image" ? msg.message.image : msg.message.text,
        timestamp: msg.createdAt
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
});

module.exports = router;