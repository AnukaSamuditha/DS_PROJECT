const Product = require("../Models/product.model");



const getAProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }
        res.status(200).json({
            message: "Product fetched successfully",
            data: product,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error in fetching product",
            error: error.message,
        });
    }
}

module.exports = {
    getAProduct
}