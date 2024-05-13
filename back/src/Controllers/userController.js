const { pool } = require("../Services/mysql");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { User } = require("../Models/User");
const bcrypt = require("bcrypt");
const { extractToken } = require("../Utils/extractToken");
const { verifyToken } = require("../Utils/verifyToken");
const { transporter } = require("../Services/mailer");

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
      req.body.picture,
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
    console.log(user);
    const sql = `INSERT INTO user (email, password, first_name, last_name, picture, token ) VALUES (?,?,?,?,?,?)`;
    const values = [
      user.email,
      user.password,
      user.first_name,
      user.last_name,
      user.picture,
      user.token,
    ];
    const [rows] = await pool.execute(sql, values);
    console.log(values);
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

module.exports = { register, validateAccount };
