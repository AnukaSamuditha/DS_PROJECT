const express = require("express")
const router = express.Router()
const {getAProduct} = require("../Controllers/product.controller");


router.get("/:id",getAProduct);

module.exports = router;