const express = require("express");
const {
  register,
  validateAccount,
  login,
  updateUser,
  deleteUser,
  getOneUser,
  banUser,
  searchUser,
  resetPassword,
  updatePassword,
  follow,
  unfollow,
  getAllUserFollower,
  getAllUserFollowing,
  redirectPassword,
  getAllMyFollower,
  getAllMyFollowing,
  verifFollow,
  getUserOnline,
  getAllUsers,
} = require("../Controllers/userController");
const { verifUserUpdate } = require("../Utils/middlewares");
const { upload } = require("../Utils/multer");
const router = express.Router();

router.post("/register", upload.single("image"), register);
router.get("/validateAccount/:token", validateAccount);
router.post("/login", login);
router.get("/all", getAllUsers);
router.patch("/update/:id", verifUserUpdate, updateUser);
router.delete("/delete", deleteUser);
router.get("/useronline", getUserOnline);
router.get("/getone/:user_id", getOneUser);
router.get("/getalluser", getAllUsers);
router.patch("/ban/:user_id", banUser);
router.post("/search", searchUser);
router.post("/reset", resetPassword);
router.get("/redirectPassword/:token", redirectPassword);
router.patch("/changepassword", updatePassword);
router.get("/veriffollow/:user_id", verifFollow);
router.post("/follow/:user_id", follow);
router.delete("/unfollow/:user_id", unfollow);
router.get("/allmyfollower", getAllMyFollower);
router.get("/allmyfollowing", getAllMyFollowing);
router.get("/alluserfollower/:user_id", getAllUserFollower);
router.get("/alluserfollowing/:user_id", getAllUserFollowing);

module.exports = router;
