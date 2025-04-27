const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const express = require("express");
const userRoutes = require("../Routes/userRoutes");
const paymentRoutes = require("../Routes/payment.route");
const cartRoutes = require("../Routes/cart.route");
const productRoutes = require("../Routes/product.route");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
const stripe = require('stripe')(process.env.STRIPE_SECRET);


// exports.createUser = async (req, res) => {
//   try {
//     const { username, email, password, role } = req.body;
//
//       try {
//         const customer = await stripe.customers.create({
//           name:username,
//           email:username,
//
//         });
//
//         res.status(200).json({ customerId: customer.id });
//       } catch (error) {
//         console.error("Error creating Stripe customer:", error);
//         res.status(500).json({ error: error.message });
//       }
//
//     const emailCheck = await User.findOne({ email });
//     if (emailCheck) {
//       return res.status(409).json({
//         message: "Email already exists!",
//       });
//     }
//     let newUser;
//
//     if(role){
//       newUser = new User({
//         username,
//         customerId:,
//         email,
//         password,
//         role
//       });
//
//     }else{
//       newUser = new User({
//         username,
//         email,
//         password,
//       });
//     }
//
//     const salt = await bcrypt.genSalt(10);
//     newUser.password = await bcrypt.hash(password, salt);
//     console.log("working")
//
//     try {
//       await newUser.save();
//       const payLoad = {
//         user: {
//           id: newUser._id,
//           email: newUser.email,
//           role: newUser.role,
//         },
//       };
//
//       const { password, ...userWithoutPassword } = newUser._doc;
//
//       jwt.sign(payLoad, JWT_SECRET, { expiresIn: "3650d" }, (err, token) => {
//         if (err) {
//           res.status(500).json({
//             message: "Error creating jwt token",
//             error: err.message,
//           });
//         }
//         res.cookie('token', token, {
//           httpOnly: true,
//           secure: process.env.NODE_ENV === 'production',
//           sameSite: 'strict',
//           maxAge: 86400000 // 24 hours
//         });
//         res.status(201).json({
//           message: "user registered successfully",
//           user: userWithoutPassword,
//           token,
//         });
//       });
//     } catch (error) {
//       res.status(500).json({
//         message: "Error creating the user",
//         error: error.message,
//       });
//     }
//   } catch (err) {
//     res.status(500).json({
//       message: "Error creating the user",
//       error: err,
//     });
//   }
// };
exports.createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res.status(409).json({
        message: "Email already exists!",
      });
    }


    let customerId;
    try {
      const customer = await stripe.customers.create({
        name: username,
        email: email,
      });
      customerId = customer.id;
    } catch (error) {
      console.error("Error creating Stripe customer:", error);
      return res.status(500).json({ error: error.message });
    }

    let newUser;
    if (role) {
      newUser = new User({
        username,
        customerId,
        email,
        password,
        role
      });
    } else {
      newUser = new User({
        username,
        email,
        password,
        customerId
      });
    }


    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    try {

      await newUser.save();


      const payLoad = {
        user: {
          id: newUser._id,
          email: newUser.email,
          role: newUser.role,
        },
      };

      const { password, ...userWithoutPassword } = newUser._doc;

      jwt.sign(payLoad, JWT_SECRET, { expiresIn: "3650d" }, (err, token) => {
        if (err) {
          res.status(500).json({
            message: "Error creating jwt token",
            error: err.message,
          });
        } else {
          res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 86400000 // 24 hours
          });
          res.status(201).json({
            message: "User registered successfully",
            user: userWithoutPassword,
            token,
          });
        }
      });
    } catch (error) {
      res.status(500).json({
        message: "Error creating the user",
        error: error.message,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Error creating the user",
      error: err.message,
    });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "Email or password was incorrect",
      });
    }

    const isPWMatching = await bcrypt.compare(password, user.password);
    if (!isPWMatching) {
      return res.status(400).json({
        message: "Email or password was incorrect",
      });
    }

    const payLoad = {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    };

    jwt.sign(payLoad, JWT_SECRET, { expiresIn: "3650d" }, (error, token) => {
      if (error) {
        return res.status(500).json({
          message: "Error creating jwt token",
          error: error.message,
        });
      }
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400000 // 24 hours
      });
      res.status(201).json({
        message: "User logged in successfully",
        token,
      });
    });
  } catch (error) {
    res.status(500).json({
      message: "Error logged in the user",
      error: err.message,
    });
  }
};

// exports.logoutUser = async (req, res) => {
//   try {
//     const token = req.header("Authorization")?.split(" ")[1];
//     if (!token) {
//       return res.status(401).json({
//         message: "No token available, authorization denied",
//       });
//     }

//     const decodedToken = jwt.verify(token, JWT_SECRET);
//     const remainingExpiry = decodedToken.exp - Math.floor(Date.now() / 1000);

//     await redisClient.set(token, "blacklisted", { EX: remainingExpiry });

//     res.status(200).json({
//       message: "User logged out successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error in log out handling",
//       error: error.message,
//     });
//   }
// };

exports.userInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        message: "Invalid user id",
      });
    }
    user.password = null;
    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error getting user info",
      error: error.message,
    });
  }
};

exports.getAllUsers = async(req,res)=>{
    try{
      const allUsers = await User.find({});

      if(allUsers.length===0){
        res.status(400).json({
          message:"No users to fetch"
        })
      }

      res.status(200).json({
        message:"Fetched all the users",
        data:allUsers
      })

    }catch(error){
      res.status(500).json({
        message:"Error in fetching all users",
        error:error.message
      })
    }
}

exports.deleteUsers = async(req,res)=>{
  
  const { id } = req.params;
  
    try {
      const deletedUser = await User.findByIdAndDelete(id);
  
      if (!deletedUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }
  
      res.status(200).json({
        message: "User was deleted successfully.",
        deletedUser,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error deleting the user.",
        error: error.message,
      });
    }
}

