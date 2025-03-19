const {
  login,
  register,
  getAllUsers,
  setAvatar,
  logOut,
  LoginGG,
} = require("../controllers/userController");

const router = require("express").Router();

router.post("/login", login);
router.post("/register", register);
router.get("/allusers/:id", getAllUsers);
router.post("/setavatar/:id", setAvatar);
router.post("/setuser", LoginGG);
router.get("/logout/:id", logOut);

module.exports = router;
