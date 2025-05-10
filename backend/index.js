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
const orderRoutes = require("./Routes/orderRoutes")
const cartRoutes = require("./Routes/cart.route");
const productRoutes = require("./Routes/product.route")
const cookieParser = require('cookie-parser');
require("dotenv").config();

app.use(cors({
  origin:process.env.FRONTEND_PREFIX,
  credentials:true
}));
app.use(cookieParser());
app.use(express.json());
app.use("/users",userRoutes);
app.use("/orders", orderRoutes);
app.use("/cart",cartRoutes);
app.use("/product",productRoutes);


app.use('/api', orderRoutes); // or just '/', if you want no prefix

//app.use("/delivers",deliveryRoutes);

const io = new Server(server,{
  cors:{
    origin:process.env.FRONTEND_PREFIX,
    methods:["GET","POST"],
    credentials:true
  }
})

socketHandler(io);

mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => {
    console.log("Database connected successfully");
    //connectRedis();

    server.listen(process.env.PORT, () => {
      console.log(`Server is running on ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting with the database", error);
  });
