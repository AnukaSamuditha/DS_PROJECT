require("dotenv").config();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "No token available, authorization denied",
    });
  }

  try {
    jwt.verify(token, JWT_SECRET, (error, decoded) => {
      if (error) {
        return res.status(401).json({
          message: "Invalid token!",
          error: error.message,
        });
      }

      
      req.user = decoded.user;
      next();
    });
  } catch (error) {
    console.log("Something is wrong with the auth middleware", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const authorize = (roles = []) => {
  return (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Access Denied, no token provided",
      });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = decoded.user;

      if (!roles.includes(user.role)) {
        return res.status(403).json({
          message: "Access Denied, insufficient permissions",
        });
      }

      // ✅ Store decoded user
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({
        message: "Invalid Token in authorizing",
        error: error.message,
      });
    }
  };
};

module.exports = { authenticate, authorize };








