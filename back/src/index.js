const express = require("express");
const cors = require("cors");
const app = express();
const userRoutes = require("./Routes/userRoutes");
// const cosplayRoutes = require('./Routes/cosplayRoutes')
// const rentalRoutes = require('./Routes/rentalRoutes')

require("dotenv").config();

app.use(express.json());
app.use(cors());

app.use("/user", userRoutes);
// app.use('/product', cosplayRoutes)
// app.use('/rental', rentalRoutes)

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
