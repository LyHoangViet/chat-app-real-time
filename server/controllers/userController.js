const User = require("../models/userModel");
const bcrypt = require("bcrypt");

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

    if (emailcheck) {
      res.json({ emailcheck });
    } else {
      const newuser = await User.create({
        email,
        username,
        password,
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

    // Kiểm tra user có tồn tại không
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
