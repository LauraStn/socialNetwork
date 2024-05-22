const { pool } = require("../Services/mysql");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { User } = require("../Models/User");
const bcrypt = require("bcrypt");
const { extractToken } = require("../Utils/extractToken");
const { verifyToken } = require("../Utils/verifyToken");
const { transporter } = require("../Services/mailer");
const { upload } = require("../Utils/multer");

const register = async (req, res) => {
  try {
    if (
      !req.body.first_name ||
      !req.body.last_name ||
      !req.body.email ||
      !req.body.password
    ) {
      res.status(400).json({ error: "Missing fields" });
      console.log("missing fields");
      return;
    }
    const hashedPassword = await bcrypt.hash(req.body.password + "", 10);
    let activationToken = await bcrypt.hash(req.body.email, 10);
    activationToken = activationToken.replaceAll("/", "");

    const user = new User(
      req.body.email,
      hashedPassword,
      2,
      req.body.first_name,
      req.body.last_name,
      req.file.filename,
      new Date(),
      new Date(),
      new Date(),
      0,
      activationToken
    );

    const email = [user.email];
    const sqlverif = `SELECT email FROM user WHERE email=?`;
    const [verifEMail] = await pool.execute(sqlverif, email);
    if (verifEMail.length > 0) {
      res.status(400).json({ message: "email already used" });
      return;
    }
    const sql = `INSERT INTO user (email, password, first_name, last_name, image, token ) VALUES (?,?,?,?,?,?)`;
    const values = [
      user.email,
      user.password,
      user.first_name,
      user.last_name,
      user.image,
      user.token,
    ];
    const [rows] = await pool.execute(sql, values);
    const info = await transporter.sendMail({
      from: `${process.env.SMTP_EMAIL}`,
      to: user.email,
      subject: "Account activation",
      text: "Activate your email",
      html: `<p>You need to activate your email, to access our services, please click on this link: <a href="http://localhost:2200/user/activate/${activationToken}">Activate your email</a></p>`,
    });

    console.log("Message sent: %s", info.messageId);

    res.status(201).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.stack });
    console.log(err.stack);
  }
};

const validateAccount = async (req, res) => {
  try {
    const token = req.params.token;
    const sql = `SELECT * FROM user WHERE token=?`;
    const value = [token];
    const [result] = await pool.execute(sql, value);
    if (!result) {
      res.status(204).json("no content");
      return;
    }
    await pool.query(
      `UPDATE user SET is_active=1, token = NULL WHERE token=?`,
      [value]
    );
    res.status(200).json({ result: "good" });
  } catch (error) {
    res.status(500).json({ error: error.stack });
    return;
  }
};

const login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
      res.status(400).json({ error: "Missing fields" });
      return;
    }
    const values = [email];
    const sql = `SELECT * FROM user WHERE email=?`;
    const [user] = await pool.execute(sql, values);
    if (!user.length) {
      res.status(401).json({ error: "Email not found" });
      return;
    }
    const isValidPassword = await bcrypt.compare(password, user[0].password);
    if (!isValidPassword) {
      res.status(401).json({ error: "Wrong credentials" });
      return;
    } else {
      console.log(user);
      const token = jwt.sign(
        {
          user_id: user[0].user_id,
          first_name: user[0].first_name,
          last_name: user[0].last_name,
          email: user[0].email,
          image: user[0].image,
          role_id: user[0].role_id,
        },
        process.env.SECRET_KEY,
        { expiresIn: "24h" }
      );
      res.status(200).json({
        jwt: token,
        role_id: user[0].role_id,
        firstName: user[0].first_name,
        image: user[0].image,
      });
      return;
    }
  } catch (error) {
    res.status(500).json({ error: error.stack });
    return;
  }
};

const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM user");
    console.log(rows);
    res.json(rows);
  } catch (err) {
    console.log(err.stack);
  }
};

const updateUser = async (req, res) => {
  try {
    const data = req.data;
    const values = req.values;
    const sql = `UPDATE user SET ${data} WHERE user_id=?`;
    const [result] = await pool.execute(sql, values);
    res.status(200).json(result);
  } catch (error) {
    console.log(error.stack);
    res.status(500).json({ message: "erreur serveur" });
  }
};

const deleteUser = async (req, res) => {
  const data = await verifyToken(req);
  if (data.role_id !== 1) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const values = [req.body.user_id];
    const sql = `DELETE FROM user WHERE user_id = ?`;

    const [result] = await pool.execute(sql, values);
    res.status(200).json(result);
  } catch (error) {
    console.log(error.stack);
    res.status(500).json({ message: "erreur serveur" });
  }
};

const getOneUser = async (req, res) => {
  const data = await verifyToken(req);
  if (!data) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  console.log(data);
  try {
    const id = data.user_id;
    const values = [id];
    const sql = `SELECT * FROM user WHERE user_id=?`;

    const [result] = await pool.execute(sql, values);
    res.status(200).json(result);
  } catch (error) {
    console.log(error.stack);
    res.status(500).json({ message: "erreur serveur" });
  }
};

const banUser = async (req, res) => {
  const data = await verifyToken(req);
  if (data.role_id !== 1) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const values = [req.body.user_id];
    const sql = `UPDATE user SET is_active = 0 WHERE user_id = ?`;
    const [result] = await pool.execute(sql, values);
    res.status(200).json(result);
  } catch (error) {
    console.log(error.stack);
    res.status(500).json({ message: "erreur serveur" });
  }
};

const searchUser = async (req, res) => {
  const data = await verifyToken(req);
  if (data.role_id !== 1) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const search = req.body.search;
    const [rows] = await pool.query(
      `SELECT * FROM user WHERE first_name LIKE "%${search}%" OR last_name LIKE "%${search}%" OR email LIKE "%${search}%"`
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.stack });
    return;
  }
};

const resetPassword = async (req, res) => {
  try {
    const email = req.body.email;
    if (!email) {
      res.status(400).json({ error: "Enter your email" });
      console.log("enter your email");
      return;
    }
    const value = [email];
    const sql = `SELECT * FROM user WHERE email = ?`;
    const [result] = await pool.execute(sql, value);
    if (!result) {
      res.status(400).json({ message: "email not found" });
      return;
    }
    const info = await transporter.sendMail({
      from: `${process.env.SMTP_EMAIL}`,
      to: result[0].email,
      subject: "Reset password",
      text: "Reset your password",
      html: `<p>Someone (probably you) requested to reset the password to your account. If you didn\'t submit this request, ignore this email, and your password will not be changed. Please click on this link: <a href="http://localhost:2200/user/changepassword/${result[0].user_id}">Reset your password</a></p>`,
    });
    console.log(result[0].user_id);
    res.status(201).json({ success: true, msg: "email send" });
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

const updatePassword = async (req, res) => {
  try {
    const id = req.params.user_id;
    const hashedPassword = await bcrypt.hash(req.body.password + "", 10);

    const values = [hashedPassword, id];
    const sql = `UPDATE user SET password=? WHERE user_id=?`;
    const [result] = await pool.execute(sql, values);
    console.log(result);
    res.status(200).json({ success: true, msg: "password changed" });
  } catch (error) {
    res.status(500).json({ message: "erreur serveur" });
    return;
  }
};

const follow = async (req, res) => {
  const data = await verifyToken(req);
  if (!data) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const following_id = req.body.user_id;
    const follower_id = data.user_id;
    const values = [following_id, follower_id];
    const sql = `INSERT INTO follow (following_user_id, follower_user_id) VALUES (?,?)`;
    const [result] = await pool.execute(sql, values);
    res.status(201).json({ success: true, msg: "follow" });
  } catch (error) {
    res.status(500).json({ message: "erreur serveur" });
    return;
  }
};

const unfollow = async (req, res) => {
  const data = await verifyToken(req);
  if (!data) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const following_id = req.body.user_id;
    const follower_id = data.user_id;
    const values = [following_id, follower_id];
    const sql = `DELETE FROM follow WHERE following_user_id = ? AND follower_user_id = ?`;
    const [result] = await pool.execute(sql, values);
    res.status(200).json({ success: true, msg: "unfollow" });
  } catch (error) {
    console.log(error.stack);
    res.status(500).json({ message: "erreur serveur" });
  }
};

const getAllUserFollower = async (req, res) => {
  const data = await verifyToken(req);
  if (!data) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const following_id = data.user_id;
    const values = [following_id];
    const sql = `SELECT * FROM follow INNER JOIN user ON user.user_id = follow.follower_user_id WHERE following_user_id = ?`;
    const [result] = await pool.execute(sql, values);
    res.status(200).json(result);
  } catch (error) {
    console.log(error.stack);
    res.status(500).json({ message: "erreur serveur" });
  }
};

const getAllUserFollowing = async (req, res) => {
  const data = await verifyToken(req);
  if (!data) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const follower_id = data.user_id;
    const values = [follower_id];
    const sql = `SELECT * FROM follow INNER JOIN user ON user.user_id = follow.following_user_id WHERE follower_user_id = ?`;
    const [result] = await pool.execute(sql, values);
    res.status(200).json(result);
  } catch (error) {
    console.log(error.stack);
    res.status(500).json({ message: "erreur serveur" });
  }
};

module.exports = {
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
};
