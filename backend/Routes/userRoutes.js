const express = require("express");
const router = express.Router();
const { createUser, loginUser, logoutUser, userInfo, getAllUsers, deleteUsers } = require("../Controllers/userController");
const { authenticate, authorize } = require('../Auth/auth');

router.post("/create-user", createUser);
router.post("/login", loginUser);
router.post("/logout", authenticate, logoutUser);
router.get("/get-user", authenticate, userInfo);
router.get("/get-all", authenticate, authorize(['admin']), getAllUsers);
router.delete('/:id', authenticate, authorize(['admin', 'regular']), deleteUsers);

module.exports = router;







// const express = require("express");
// const router = express.Router();
// const { createUser,loginUser,userInfo,getAllUsers, deleteUsers } = require("../Controllers/userController");
// const {authenticate,authorize} = require('../Auth/auth');

// router.post("/create-user", createUser);
// router.get("/get-user",authenticate,userInfo)
// router.post("/login",loginUser);
// // router.post("/logout",authenticate,logoutUser);
// router.get("/get-all",authenticate,authorize(['admin']),getAllUsers);
// router.delete('/:id',authenticate,authorize(['admin','regular']),deleteUsers);

// module.exports = router;