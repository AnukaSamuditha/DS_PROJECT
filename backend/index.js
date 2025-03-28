const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./Routes/userRoutes");
require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use("/users",userRoutes);

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Database connected successfully");
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting with the database", error);
  });
