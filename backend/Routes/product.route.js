const express = require("express")
const router = express.Router()
const {createProduct,getAllProducts,getAProduct} = require("../Controllers/product.controller");

router.post("/",createProduct);
router.get("/",getAllProducts);
router.get("/:id",getAProduct);

module.exports = router;