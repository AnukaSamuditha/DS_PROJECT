const express = require("express");
const router = express.Router();
const { createUser,loginUser,userInfo,getAllUsers, deleteUsers,getUser } = require("../Controllers/userController");
const {authenticate,authorize} = require('../Auth/auth');

router.post("/", createUser);
router.get("/self",authenticate,userInfo)
router.get("/:id",authenticate,authorize(["admin","regular"]),getUser);
router.post("/login",loginUser);
// router.post("/logout",authenticate,logoutUser);
router.get("/get-all",authenticate,authorize(['admin']),getAllUsers);
router.delete('/:id',authenticate,authorize(['admin','regular']),deleteUsers);

module.exports = router;