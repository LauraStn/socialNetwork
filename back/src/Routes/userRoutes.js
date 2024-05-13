const express = require("express");
const { register, validateAccount } = require("../Controllers/userController");
const router = express.Router();

router.post("/register", register);
router.patch("/activate/:token", validateAccount);

module.exports = router;
