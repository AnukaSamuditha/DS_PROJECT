const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./Routes/userRoutes");
const {connectRedis} = require('./Auth/redisClient');
const {Server} = require('socket.io')
const http = require('http');
const server = http.createServer(app);
const {socketHandler} = require('./Socket/socketHandler');
const deliveryRoutes = require('./Routes/deliveryRoutes');
require("dotenv").config();


app.use(express.json());
app.use(cors());
app.use("/users",userRoutes);
app.use("/delivers",deliveryRoutes);

const io = new Server(server,{
  cors:{
    origin:process.env.FRONTEND_PREFIX,
    methods:["GET","POST"]
  }
})

socketHandler(io);

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Database connected successfully");
    connectRedis();

    server.listen(process.env.PORT, () => {
      console.log(`Server is running on ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting with the database", error);
  });
