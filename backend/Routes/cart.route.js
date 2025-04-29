const express = require("express");
const router = express.Router();
const {getCart,getProduct} = require("../Controllers/cart.controller");
const {authenticate,authorize} = require('../Auth/auth');


router.get("/",authenticate,getCart);
router.get("/product",authenticate,getProduct);


module.exports = router;