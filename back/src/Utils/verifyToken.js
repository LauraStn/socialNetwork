const jwt = require("jsonwebtoken");
const { extractToken } = require("./extractToken");
require("dotenv").config();

const verifyToken = async (req, res) => {
  const token = await extractToken(req);
  if (token === undefined || !token) {
    res.status(400).json({ error: "Bad request" });
    console.log(token);
    return;
  } else {
    return jwt.verify(token, process.env.SECRET_KEY, async (error, data) => {
      if (error) {
        return;
      }
      return data;
    });
  }
};
module.exports = { verifyToken };
