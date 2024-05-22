const express = require("express");
const cors = require("cors");
const app = express();
const userRoutes = require("./Routes/userRoutes");
const postRoutes = require("./Routes/postRoutes");

const { connect } = require("./Services/mongo");
const path = require("path");

require("dotenv").config();

app.use(express.json());
app.use(cors());

connect(process.env.DB_URL, (error) => {
  if (error) {
    console.log("Failed to connect");
    process.exit(-1);
  } else {
    console.log("successfully connected");
  }
});

app.use("/user", userRoutes);
app.use("/post", postRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
