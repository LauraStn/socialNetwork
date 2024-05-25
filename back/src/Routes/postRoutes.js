const express = require("express");
const { upload } = require("../Utils/multer");

const {
  addPost,
  like,
  dislike,
  deletePost,
  deleteComment,
  addComment,
  updatePost,
  getAllMyPost,
  getAllFollowingUserPost,
  getAllPost,
  getOnePost,
} = require("../Controllers/postController");

const router = express.Router();

router.post("/add", upload.single("image"), addPost);
router.patch("/like/:_id", like);
router.patch("/dislike/:id", dislike);
router.get("/getone/:_id", getOnePost);
router.patch("/update/:id", upload.single("image"), updatePost);
router.patch("/addcomment/:id", addComment);
router.delete("/delete/:id", deletePost);
router.patch("/deletecomment/:_id", deleteComment);
router.get("/mine", getAllMyPost);
router.get("/getalluserpost", getAllFollowingUserPost);
router.get("/getall", getAllPost);

module.exports = router;
