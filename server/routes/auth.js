const {
  login,
  register,
  getAllUsers,
  setAvatar,
  logOut,
  LoginGG,
  createdGroup,
  getGroup,
  checkrole,
  addMember,
  sendGroupMessage,
  getGroupMessages,
  getMembers,
} = require("../controllers/userController");

const router = require("express").Router();

router.post("/login", login);
router.post("/register", register);
router.get("/allusers/:id", getAllUsers);
router.post("/setavatar/:id", setAvatar);
router.post("/setuser", LoginGG);
router.get("/logout/:id", logOut);
router.post("/creategr", createdGroup);
router.get("/getgroup/:id", getGroup);
router.get("/groups/:groupId/:userId", checkrole);
router.post("/member", addMember);
router.post("/group", sendGroupMessage);
router.post("/group/:groupId", getGroupMessages);
router.get("/removemember/:groupId", getMembers);
module.exports = router;
