const express = require("express");
const {
  register,
  validateAccount,
  login,
  getAllUsers,
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
} = require("../Controllers/userController");
const { verifUserUpdate } = require("../Utils/middlewares");
const { upload } = require("../Utils/multer");
const router = express.Router();

router.post("/register", upload.single("image"), register);
router.patch("/activate/:token", validateAccount);
router.post("/login", login);
router.get("/all", getAllUsers);
router.patch("/update/:id", verifUserUpdate, updateUser);
router.delete("/delete", deleteUser);
router.get("/one", getOneUser);
router.patch("/ban", banUser);
router.get("/search", searchUser);
router.post("/reset", resetPassword);
router.patch("/changepassword/:user_id", updatePassword);
router.post("/follow", follow);
router.delete("/unfollow", unfollow);
router.get("/allfollower", getAllUserFollower);
router.get("/allfollowing", getAllUserFollowing);

module.exports = router;
