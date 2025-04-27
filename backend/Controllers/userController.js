





const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

// ✅ REGISTER
exports.createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res.status(409).json({
        message: "Email already exists!",
      });
    }

    const newUser = new User({
      username,
      email,
      password,
      role: role || "regular",
    });

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    await newUser.save();

    const payLoad = {
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
    };

    jwt.sign(payLoad, JWT_SECRET, { expiresIn: "1d" }, (err, token) => {
      if (err) {
        return res.status(500).json({
          message: "Error creating jwt token",
          error: err.message,
        });
      }

      // ✅ Set cookie instead of returning token
      res
        .cookie("token", token, {
          httpOnly: true,
          sameSite: "Lax",
          secure: false,
          maxAge: 24 * 60 * 60 * 1000,
        })
        .status(201)
        .json({
          message: "User registered successfully",
        });
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating the user",
      error: error.message,
    });
  }
};

// ✅ LOGIN
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

    jwt.sign(payLoad, JWT_SECRET, { expiresIn: "1d" }, (error, token) => {
      if (error) {
        return res.status(500).json({
          message: "Error creating jwt token",
          error: error.message,
        });
      }

      res
        .cookie("token", token, {
          httpOnly: true,
          sameSite: "Lax",
          secure: false,
          maxAge: 24 * 60 * 60 * 1000,
        })
        .status(201)
        .json({
          message: "User logged in successfully",
        });
    });
  } catch (error) {
    res.status(500).json({
      message: "Error logging in the user",
      error: error.message,
    });
  }
};

// ✅ GET LOGGED-IN USER INFO
exports.userInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "Invalid user id",
      });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({
      message: "Error getting user info",
      error: error.message,
    });
  }
};

// ✅ ADMIN: GET ALL USERS
exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({});
    if (allUsers.length === 0) {
      return res.status(400).json({
        message: "No users to fetch",
      });
    }

    res.status(200).json({
      message: "Fetched all the users",
      data: allUsers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in fetching all users",
      error: error.message,
    });
  }
};

// ✅ ADMIN: DELETE USER
exports.deleteUsers = async (req, res) => {
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
};











