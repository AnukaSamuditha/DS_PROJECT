const Product = require("../Models/product.model");

const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(200).json({
            message: "Product created successfully",
            data: product,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error in creating product",
            error: error.message,
        });
    }
};

const getAllProducts = async (req, res) => {
    try{
        const product = await Product.find({});
        if(!product){
            return res.status(404).json({
                message:"No Products found"
            })
        }
        res.status(200).json({
            message:"Products fetched successfully",
            data:product
        })
    }catch(error){
        res.status(500).json({
            message:"Error in fetching products",
            error:error.message
        })
    }
}
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
    createProduct,
    getAllProducts,
    getAProduct
}