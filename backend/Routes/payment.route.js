const express = require("express");
const router = express.Router();
const {createPayment,getPayment,cancelPayment} = require("../Controllers/payment.controller");
const {authenticate,authorize} = require('../Auth/auth');


router.post("/create",createPayment);
router.get("/",getPayment);
router.delete("/:id",cancelPayment);



module.exports = router;