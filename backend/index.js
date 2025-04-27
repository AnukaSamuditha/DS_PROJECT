require("dotenv").config();
const cookieParser = require("cookie-parser")
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const orderRoutes = require('./Routes/orderRoutes');
const userRoutes = require("./Routes/userRoutes");


app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))
app.use(cookieParser())

app.use(express.json());
//app.use(cors());
app.use("/users",userRoutes);
app.use('/orders', orderRoutes);

mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => {
    console.log("Database connected successfully");
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting with the database", error);
  });

