const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

exports.createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res.status(409).json({
        message: "Email already exists!",
      });
    }
    let newUser;

    if (role) {
      newUser = new User({
        username,
        email,
        password,
        role,
      });
    } else {
      newUser = new User({
        username,
        email,
        password,
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

      jwt.sign(payLoad, JWT_SECRET, { expiresIn: "1d" }, (err, token) => {
        if (err) {
          res.status(500).json({
            message: "Error creating jwt token",
            error: err.message,
          });
        }
        res.cookie("token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          maxAge: 1000 * 60 * 60 * 24,
        });
        res.status(201).json({
          message: "user registered successfully",
          user: userWithoutPassword,
          token,
        });
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
      error: err,
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

    jwt.sign(payLoad, JWT_SECRET, { expiresIn: "1h" }, (error, token) => {
      if (error) {
        return res.status(500).json({
          message: "Error creating jwt token",
          error: error.message,
        });
      }

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 3600000,
      });

      res.status(200).json({
        message: "User logged in successfully",
        token,
        data: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      });
    });
  } catch (error) {
    res.status(500).json({
      message: "Error logged in the user",
      error: err.message,
    });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    //const token = req.header("Authorization")?.split(" ")[1];
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "No token available, authorization denied",
      });
    }

    const decodedToken = jwt.verify(token, JWT_SECRET);
    const remainingExpiry = decodedToken.exp - Math.floor(Date.now() / 1000);

    // await redisClient.set(token, "blacklisted", { EX: remainingExpiry });
    res.clearCookie("token");
    res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in log out handling",
      error: error.message,
    });
  }
};

exports.userInfo = async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    const user = await User.findById(decoded.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "Invalid user id",
      });
    }
    
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

exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({});

    if (allUsers.length === 0) {
      res.status(400).json({
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