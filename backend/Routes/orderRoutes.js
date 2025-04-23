const express = require('express');
const router = express.Router();
const {authenticate,authorize} = require('../Auth/auth');
const {createOrder,updateOrder,getOrder,getOrderStatus} = require('../Controllers/orderController');

router.get("/order/:id",authenticate,authorize(["regular","driver"]),getOrder);
router.get("/status/:id",authenticate,authorize(["regular","driver"]),getOrderStatus);
router.post("/",authenticate,authorize(["regular"]),createOrder);
router.patch("/:id",authenticate,authorize(["regular","driver"]),updateOrder);

module.exports = router;