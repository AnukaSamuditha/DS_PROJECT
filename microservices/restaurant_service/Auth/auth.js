const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = async (req, res, next) => {
  //const token = await req.headers.authorization?.split(" ")[1];
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
      } else {
        req.user = decoded.user;
        next();
      }
    });
  } catch (error) {
    console.log("Something is wrong with the auth middleware", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const authorize = (roles = []) => {
  return (req, res, next) => {
    try {
      //const token = req.headers.authorization?.split(" ")[1];
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({
          message: "Access Denied, no token provided",
        });
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;

      if (!roles.includes(decoded.user?.role)) {
        console.log("role ",decoded.user?.role)
        return res.status(401).json({
          message: "Access Denied, no permission to access the resource",
        });
      }

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





// const jwt = require("jsonwebtoken");
// const JWT_SECRET = process.env.JWT_SECRET;

// const authenticate = async (req, res, next) => {
//   const token = await req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({
//       message: "No token available, authorization denied",
//     });
//   }

//   try {
//     jwt.verify(token, JWT_SECRET, (error, decoded) => {
//       if (error) {
//         return res.status(401).json({
//           message: "Invalid token!",
//           error: error.message,
//         });
//       } else {
//         req.user = decoded.user;
//         next();
//       }
//     });
//   } catch (error) {
//     console.log("Something is wrong with the auth middleware", error.message);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// const authorize = (roles = []) => {
//   return (req, res, next) => {
//     try {
//       const token = req.headers.authorization?.split(" ")[1];
//       if (!token) {
//         return res.status(401).json({
//           message: "Access Denied, no token provided",
//         });
//       }

//       const decoded = jwt.verify(token, JWT_SECRET);
//       req.user = decoded.user;

//       if (!roles.includes(req.user.role)) {
//         return res.status(401).json({
//           message: "Access Denied, no permission to access the resource",
//         });
//       }

//       next();
//     } catch (error) {
//       res.status(401).json({
//         message: "Invalid Token in authorizing",
//         error: error.message,
//       });
//     }
//   };
// };

// module.exports = { authenticate, authorize };




// const jwt = require("jsonwebtoken");
// const JWT_SECRET = process.env.JWT_SECRET;

// const authenticate = async (req, res, next) => {
//   const token = await req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({
//       message: "No token available, authorization denied",
//     });
//   }

//   try {
//     jwt.verify(token, JWT_SECRET, (error, decoded) => {
//       if (error) {
//         return res.status(401).json({
//           message: "Invalid token!",
//           error: error.message,
//         });
//       } else {
//         req.user = decoded.user;
//         next();
//       }
//     });
//   } catch (error) {
//     console.log("Something is wrong with the auth middleware", error.message);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// const authorize = (roles = []) => {
//   return (req, res, next) => {
//     try {
//       const token = req.headers.authorization?.split(" ")[1];
//       if (!token) {
//         return res.status(401).json({
//           message: "Access Denied, no token provided",
//         });
//       }

//       const decoded = jwt.verify(token, JWT_SECRET);
//       req.user = decoded;

//       if (!roles.includes(req.user.user.role)) {
//         return res.status(401).json({
//           message: "Access Denied, no permission to access the resource",
//         });
//       }

//       next();
//     } catch (error) {
//       res.status(401).json({
//         message: "Invalid Token in authorizing",
//         error: error.message,
//       });
//     }
//   };
// };

// module.exports = { authenticate, authorize };
