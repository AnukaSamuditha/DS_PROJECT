const express = require("express");
const router = express.Router();
const {createCart,getCart,updateCart,deleteCart,deleteItem} = require("../Controllers/cart.controller");
const {authenticate,authorize} = require('../Auth/auth');


router.post("/",authenticate,authorize(['admin','regular']),createCart);
router.get("/",authenticate,getCart);
router.patch("/:id",authenticate,updateCart);
router.put("/item", authenticate, deleteItem);
router.delete("/:id",authenticate,deleteCart);

module.exports = router;