const Cart = require("../Models/cart.model");



const getCart = async (req, res) => {
    try {
        const userId = req.user.id;  // Authenticated user ID
        console.log("Authenticated userId:", userId);

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        res.status(200).json({
            message: "Cart fetched successfully",
            data: cart
        });
    } catch (error) {
        console.error("Error in getCart:", error);
        res.status(500).json({
            message: "Error in fetching cart",
            error: error.message
        });
    }
};


const getProduct = async (req, res) => {
    try {
        const userId = req.user.id;  // Authenticated user ID
        console.log("Authenticated userId:", userId);

        const cart = await Cart.findOne({ userId }).populate('cartItems.productId');

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        res.status(200).json({
            message: "Cart fetched successfully",
            data: cart
        });
    } catch (error) {
        console.error("Error in getCart:", error);
        res.status(500).json({
            message: "Error in fetching cart",
            error: error.message
        });
    }
};




module.exports = {

    getCart,
    getProduct

}