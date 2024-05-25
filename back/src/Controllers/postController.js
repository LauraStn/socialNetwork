const { pool } = require("../Services/mysql");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { extractToken } = require("../Utils/extractToken");
const { verifyToken } = require("../Utils/verifyToken");
const { transporter } = require("../Services/mailer");
const { upload } = require("../Utils/multer");
const { Post } = require("../Models/Post");
const { ObjectId } = require("mongodb");
const client = require("../Services/mongo");
const { Comment } = require("../Models/Comment");

const addPost = async (req, res) => {
  const data = await verifyToken(req, res);
  if (!data) {
    res.status(401).json({ success: false, msg: "Unauthorized" });
    return;
  }
  try {
    const user_id = data.user_id;
    if (!req.body.content) {
      res.status(400).json({ success: false, msg: "Missing fields" });
      return;
    }
    const values = [user_id];
    const sql = `SELECT * FROM user WHERE user_id = ?`;
    const [user] = await pool.execute(sql, values);

    const newPost = new Post(
      user_id,
      user[0].first_name,
      user[0].last_name,
      user[0].image,
      req.body.content,
      req.file.filename,
      [],
      [],
      new Date(),
      new Date()
    );
    const result = await client
      .db("socialNetwork")
      .collection("post")
      .insertOne(newPost);

    res.status(201).json({ success: true, msg: "Post added" });
    console.log(result);
    return;
  } catch (error) {
    res.status(500).json({ success: false, msg: "Error server" });
    return;
  }
};

const updatePost = async (req, res) => {
  const data = await verifyToken(req, res);
  if (!data) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    if (!req.body.content) {
      res.status(400).json({ error: "Missing fields" });
      return;
    }
    const content = req.body.content;
    const image = req.file.filename;

    const post = await client
      .db("socialNetwork")
      .collection("post")
      .findOne({ _id: new ObjectId(req.params.id) });

    if (post.user_id !== data.user_id) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const result = await client
      .db("socialNetwork")
      .collection("post")
      .updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { content: content, image: image } }
      );

    res.status(201).json(result);
    return;
  } catch (error) {
    res.status(500).json({ error: error.stack });
  }
};

const getAllMyPost = async (req, res) => {
  const data = await verifyToken(req, res);
  if (!data) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const allPosts = await client
      .db("socialNetwork")
      .collection("post")
      .find({ user_id: data.user_id });
    const result = await allPosts.toArray();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.stack });
    return;
  }
};

const getAllFollowingUserPost = async (req, res) => {
  const data = await verifyToken(req, res);
  if (!data) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const following_id = req.body.user_id;
    const values = [data.user_id, following_id];
    const sql = `SELECT * FROM follow WHERE follower_user_id = ? AND following_user_id = ?`;
    const [result] = await pool.execute(sql, values);
    if (result.length < 1) {
      res.status(401).json("not follow");
      return;
    } else {
      const allPosts = await client
        .db("socialNetwork")
        .collection("post")
        .find({ user_id: following_id });
      const resultPosts = await allPosts.toArray();
      res.status(200).json(resultPosts);
      return;
    }
  } catch (error) {
    res.status(500).json({ error: error.stack });
    return;
  }
};
const getOnePost = async (req, res) => {
  try {
    const getPost = await client
      .db("socialNetwork")
      .collection("post")
      .findOne({ _id: new ObjectId(req.params._id) });

    res.status(200).json(getPost);
    return;
  } catch (error) {
    res.status(500).json("error");
    return;
  }
};
const getAllPost = async (req, res) => {
  const data = await verifyToken(req, res);
  if (!data) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const values = [data.user_id];
    const sql = `SELECT * FROM follow WHERE follower_user_id = ?`;
    const [result] = await pool.execute(sql, values);
    if (result.length < 1) {
      res.status(401).json("not follow");
      return;
    }
    let array = [];
    for (let i = 0; i < result.length; i++) {
      const element = result[i].following_user_id;
      array.push({ user_id: element });
    }
    console.log(array);
    const allPosts = await client
      .db("socialNetwork")
      .collection("post")
      .find({ $or: array });
    const resultPosts = await allPosts.toArray();
    console.log(resultPosts);
    res.status(200).json(resultPosts);
    return;
  } catch (error) {
    res.status(500).json({ error: error.stack });
    return;
  }
};

const deletePost = async (req, res) => {
  const data = await verifyToken(req, res);
  if (!data) {
    res.status(401).json({ error: "Not connected" });
    return;
  }
  try {
    const post = await client
      .db("socialNetwork")
      .collection("post")
      .findOne({ _id: new ObjectId(req.params.id) });

    if (post.user_id === data.user_id || data.role_id === 1) {
      await client
        .db("socialNetwork")
        .collection("post")
        .deleteOne({ _id: new ObjectId(req.params.id) });

      res.status(200).json({ success: true, msg: "Deleted" });
      return;
    }

    res.status(401).json({ error: "Unauthorized" });
    return;
  } catch (error) {
    res.status(500).json("error");
    return;
  }
};
const likeDislike = async (req, res) => {
  const data = await verifyToken(req, res);
  if (!data) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const selectPost = await client
      .db("socialNetwork")
      .collection("post")
      .find();
  } catch (error) {
    res.status(500).json("error");
    return;
  }
};
const like = async (req, res) => {
  const data = await verifyToken(req, res);
  if (!data) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const likePost = await client
      .db("socialNetwork")
      .collection("post")
      .updateOne(
        { _id: new ObjectId(req.params._id) },
        { $addToSet: { like: data.user_id } }
      );
    console.log(req.params._id);
    res.status(200).json({ success: true, msg: "Liked !" });
    return;
  } catch (error) {
    res.status(500).json("error");
    return;
  }
};

const dislike = async (req, res) => {
  const data = await verifyToken(req, res);
  if (!data) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const dislikePost = await client
      .db("socialNetwork")
      .collection("post")
      .updateOne(
        { _id: new ObjectId(req.params.id) },
        { $pull: { like: data.user_id } }
      );
    res.status(200).json({ success: true, msg: "Disliked !" });
    return;
  } catch (error) {
    res.status(400).json("don't work");
    return;
  }
};

const addComment = async (req, res) => {
  const data = await verifyToken(req, res);
  if (!data) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const newComment = new Comment(
      data.user_id,
      new ObjectId(),
      data.first_name,
      data.last_name,
      data.image,
      req.body.content,
      new Date(),
      new Date()
    );
    const commentPost = await client
      .db("socialNetwork")
      .collection("post")
      .updateOne(
        { _id: new ObjectId(req.params.id) },
        { $addToSet: { comments: newComment } }
      );
    res.status(200).json({ success: true, msg: "AddComment" });
    return;
  } catch (error) {
    res.status(500).json("error");
    return;
  }
};

const deleteComment = async (req, res) => {
  const data = await verifyToken(req, res);
  if (!data) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const selectPost = await client
      .db("socialNetwork")
      .collection("post")
      .findOne({ _id: new ObjectId(req.params._id) });
    if (!selectPost) {
      res.status(404).send("Post not found");
      return;
    }
    const commentId = new ObjectId(req.body.comment_id);
    const selectComment = selectPost.comments.find((comment) => {
      return comment.comment_id.equals(commentId);
    });
    if (!selectComment) {
      res.status(404).json("Comment not found");
      return;
    }
    if (selectComment.user_id !== data.user_id) {
      res.status(404).json("Not your comment");
      return;
    }
    const deleteComment = await client
      .db("socialNetwork")
      .collection("post")
      .updateOne(
        { _id: new ObjectId(req.params._id) },
        {
          $pull: {
            comments: { comment_id: new ObjectId(selectComment.comment_id) },
          },
        }
      );
    res.status(200).json(deleteComment);
    return;
  } catch (error) {
    res.status(500).json("error");
    return;
  }
};

module.exports = {
  addPost,
  getAllMyPost,
  getAllFollowingUserPost,
  getAllPost,
  getOnePost,
  like,
  dislike,
  updatePost,
  addComment,
  deletePost,
  deleteComment,
};
