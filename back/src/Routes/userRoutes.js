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
} = require("../Controllers/userController");
const { verifUserUpdate } = require("../Utils/middlewares");
const router = express.Router();

router.post("/register", register);
router.patch("/activate/:token", validateAccount);
router.post("/login", login);
router.get("/all", getAllUsers);
router.patch("/update/:id", verifUserUpdate, updateUser);
router.delete("/delete", deleteUser);
router.get("/one", getOneUser);
router.patch("/ban", banUser);
router.get("/search", searchUser);
module.exports = router;
