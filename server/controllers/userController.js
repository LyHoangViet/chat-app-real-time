const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const Group = require("../models/groupModels");
// const express = require("express"); // Import model Group
// const app = express();
let ioInstance;
let onlineUsers;
module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      return res.json({ msg: "Username cannot be empty", status: false });
    }

    const user = await User.findOne({
      $or: [{ username: trimmedUsername }, { email: trimmedUsername }],
    });

    if (!user) {
      return res.json({
        msg: "Incorrect Username/Email or Password",
        status: false,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.json({
        msg: "Incorrect Username/Email or Password",
        status: false,
      });
    }

    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};
module.exports.LoginGG = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const emailcheck = await User.findOne({ $or: [{ email }, { username }] });
    const hashedPassword = await bcrypt.hash(password, 10);
    if (emailcheck) {
      res.json({ emailcheck });
    } else {
      const newuser = await User.create({
        email,
        username,
        password: hashedPassword,
      });
      return res.status(201).json({ user: newuser });
    }
  } catch (ex) {
    next(ex);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;

    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(404).json({
        msg: "User not found",
        status: false,
      });
    }

    userData.isAvatarImageSet = true;
    userData.avatarImage = avatarImage;
    await userData.save();

    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
      status: true,
    });
  } catch (ex) {
    return res.status(500).json({
      msg: "Error updating avatar",
      status: false,
    });
  }
};

module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};

module.exports.createdGroup = async (req, res, next) => {
  try {
    const { name, createdBy, members, avatarImage, description, isPrivate } =
      req.body;

    const group = await Group.create({
      name,
      createdBy,
      members,
      avatarImage,
      description,
      isPrivate,
    });

    // 🔥 Emit về cho người tạo nhóm
    const socketId = onlineUsers?.get(createdBy);
    if (socketId && ioInstance) {
      ioInstance.to(socketId).emit("group-added", group);
      console.log("🔥 Gửi group-added tới", socketId);
    }

    return res.status(201).json({ status: true, group });
  } catch (ex) {
    next(ex);
  }
};

module.exports.setSocketInstance = (io, usersMap) => {
  ioInstance = io;
  onlineUsers = usersMap;
};

module.exports.getGroup = async (req, res, next) => {
  try {
    const groups = await Group.find({ "members.user": req.params.id });

    if (!groups) {
      return res.json({
        success: false,
        message: "Group not found",
      });
    }

    return res.json({ groups });
  } catch (ex) {
    next(ex);
  }
};

module.exports.checkrole = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.params.userId;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.json({ message: "Nhóm không tồn tại" });
    }

    const member = group.members.find(
      (member) => member.user.toString() === userId
    );

    if (member) {
      return res.json({ role: member.role });
    } else {
      return res.json({
        message: "Người dùng không phải là thành viên của nhóm",
      });
    }
  } catch (error) {
    console.error("Lỗi khi lấy vai trò người dùng:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports.addMember = async (req, res) => {
  try {
    const { email, groupId } = req.body;

    if (!email || !groupId) {
      return res.json({ message: "Email and groupId are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "User with this email does not exist." });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.json({ message: "Group not found." });
    }

    const alreadyInGroup = group.members.find(
      (m) => m.user.toString() === user._id.toString()
    );
    if (alreadyInGroup) {
      return res
        .status(400)
        .json({ message: "User is already a member of this group." });
    }

    group.members.push({ user: user._id });
    await group.save();

    const socketId = onlineUsers?.get(user._id.toString());
    if (socketId && ioInstance) {
      ioInstance.to(socketId).emit("group-added", group);
    }

    return res
      .status(200)
      .json({ message: "Member added to group successfully.", status: true });
  } catch (error) {
    console.error("Error adding member:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports.getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;

    const group = await Group.findById(groupId).populate(
      "messages.sender",
      "username"
    );

    const formatted = group.messages.map((msg) => ({
      fromSelf: msg.sender._id.toString() === userId,
      message: msg.content,
      type: msg.type,
      _id: msg._id,
      senderName: msg.sender.username,
      timestamp: msg.timestamp,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Get group messages error:", error);
    res.status(500).json({ status: false, msg: "Failed to get messages" });
  }
};

module.exports.sendGroupMessage = async (req, res) => {
  try {
    const { from, to, message, type, fileUrl } = req.body;

    const newMessage = {
      sender: from,
      content: message,
      type: type || "text",
      fileUrl: fileUrl || "",
      timestamp: new Date(),
    };

    const updatedGroup = await Group.findByIdAndUpdate(
      to,
      {
        $push: { messages: newMessage },
        $set: {
          lastMessage: {
            sender: from,
            content: message,
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );

    const createdMessage =
      updatedGroup.messages[updatedGroup.messages.length - 1];

    res.json({
      status: true,
      messageId: createdMessage._id, // trả về để client hiển thị
    });
  } catch (error) {
    console.error("Send group message error:", error);
    res.status(500).json({ status: false, msg: "Failed to send message" });
  }
};
// userController.js (hoặc groupController.js)
module.exports.getMembers = async (req, res) => {
  try {
    const groupId = req.params.groupId;

    const group = await Group.findById(groupId).populate(
      "members.user",
      "username avatarImage _id"
    );
    console.log("Get: ", group.members);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json({ members: group.members });
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({ message: "Server error" });
  }
};
