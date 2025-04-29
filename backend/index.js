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
  const cookieParser = require('cookie-parser');
  require("dotenv").config();
 const restaurantRoutes = require("./Routes/RestaurantRoutes");
const menuItemRoutes = require("./Routes/MenuItemRoutes");
 const reviewRoutes = require("./Routes/reviewRoutes");
  
  app.use(cors({
    origin:process.env.FRONTEND_PREFIX,
    credentials:true
  }));
  app.use(cookieParser());
  app.use(express.json());
  app.use("/users",userRoutes);
  app.use("/delivers",deliveryRoutes);
app.use("/restaurants", restaurantRoutes);
app.use("/MenuItems", menuItemRoutes);
app.use('/uploads', express.static('uploads'));
app.use("/reviews", reviewRoutes);

  const io = new Server(server,{
    cors:{
      origin:process.env.FRONTEND_PREFIX,
      methods:["GET","POST"],
      credentials:true
    }
  })
  
  socketHandler(io);
  
  mongoose
    .connect(process.env.DB_URL)
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








// //mine
// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const userRoutes = require("./Routes/userRoutes");
// const restaurantRoutes = require("./Routes/RestaurantRoutes");
// const menuItemRoutes = require("./Routes/MenuItemRoutes");
// const reviewRoutes = require("./Routes/reviewRoutes");

// require("dotenv").config();

// app.use(cookieParser());
// app.use(express.json());

// app.use(cors({
//   origin: process.env.FRONTEND_PREFIX, // adjust to frontend URL
//   credentials: true
// }));

// app.use("/users", userRoutes);
// app.use("/restaurants", restaurantRoutes);
// app.use("/MenuItems", menuItemRoutes);
// app.use('/uploads', express.static('uploads'));
// app.use("/reviews", reviewRoutes);

// mongoose
//   .connect(process.env.DB_URL)
//   .then(() => {
//     console.log("Database connected successfully");
//     app.listen(process.env.PORT, () => {
//       console.log(`Server is running on ${process.env.PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.log("Error connecting with the database", error);
//   });










    // const express = require("express");
    // const app = express();
    // const mongoose = require("mongoose");
    // const cors = require("cors");
    // const cookieParser = require("cookie-parser");
    // const userRoutes = require("./Routes/userRoutes");
    // const restaurantRoutes = require("./Routes/RestaurantRoutes");
    // const menuItemRoutes = require("./Routes/MenuItemRoutes");
    // const reviewRoutes = require("./Routes/reviewRoutes");
    
    // require("dotenv").config();
    
    // app.use(cookieParser());
    // app.use(express.json());
    
    // app.use(cors({
    //   origin: 'http://localhost:5173', // adjust to frontend URL
    //   credentials: true
    // }));
    
    // app.use("/users", userRoutes);
    // app.use("/restaurants", restaurantRoutes);
    // app.use("/MenuItems", menuItemRoutes);
    // app.use('/uploads', express.static('uploads'));
    // app.use("/reviews", reviewRoutes);
    
    // mongoose
    //   .connect(process.env.DB_URL)
    //   .then(() => {
    //     console.log("Database connected successfully");
    //     app.listen(process.env.PORT, () => {
    //       console.log(`Server is running on ${process.env.PORT}`);
    //     });
    //   })
    //   .catch((error) => {
    //     console.log("Error connecting with the database", error);
    //   });
    
