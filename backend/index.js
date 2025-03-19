const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(cors());

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
