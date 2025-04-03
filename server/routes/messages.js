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

    if (data) {
      return res.json({ 
        msg: "Message added successfully.",
        messageId: data._id // Trả về _id của tin nhắn
      });
    }
    return res.json({ msg: "Failed to add message to the database" });
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
      deletedFor: { $ne: from }
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        _id: msg._id,
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

// Thêm route xóa tin nhắn
router.delete("/delete/:id", async (req, res) => {
  try {
    const messageId = req.params.id;
    console.log("Deleting message with ID:", messageId);
    await Messages.findByIdAndDelete(messageId);
    res.status(200).json({ msg: "Message deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/clear-chat", async (req, res, next) => {
  try {
    const { from, to } = req.body;

    if (!from || !to) {
      return res.status(400).json({ msg: "Thiếu thông tin người gửi hoặc người nhận" });
    }

    // Cập nhật tất cả tin nhắn giữa hai người, thêm userId vào mảng deletedFor
    const result = await Messages.updateMany(
      {
        users: {
          $all: [from, to]
        }
      },
      {
        $addToSet: { deletedFor: from }
      }
    );

    return res.json({ 
      msg: "Đã xóa lịch sử cuộc trò chuyện thành công",
      modifiedCount: result.modifiedCount
    });
  } catch (ex) {
    console.error("Clear chat error:", ex);
    next(ex);
  }
});

module.exports = router;