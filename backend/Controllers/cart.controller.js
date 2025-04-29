const Cart = require("../Models/cart.model");

const createCart = async (req, res) => {
    try {
        const userId = req.user.user.id;
        console.log(userId)

        if (!userId) {
            return res.status(400).json({ message: "User ID not found in token" });
        }

        const cart = await Cart.create({
            ...req.body,
            userId,
        });

        res.status(200).json({
            message: "Cart created successfully",
            data: cart,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error in creating cart",
            error: error.message,
        });
    }
};

const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(userId)

        const cart = await Cart.findOne({ userId }).populate('cartItems.productId');

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        res.status(200).json({
            message: "Cart fetched successfully",
            data: cart
        });
    } catch (error) {
        res.status(500).json({
            message: "Error in fetching cart",
            error: error.message
        });
    }
    console.log("getCart req.user:", req.user);
};



const updateCart = async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        const updatedCart = await Cart.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: userId,
                "cartItems.productId": productId,
            },
            {
                $set: {
                    "cartItems.$.quantity": quantity,
                },
            },
            { new: true }
        );

        if (!updatedCart) {
            return res.status(404).json({
                message: "Cart or product not found",
            });
        }

        res.status(200).json({
            message: "Cart item quantity updated successfully",
            data: updatedCart,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating cart item quantity",
            error: error.message,
        });
    }
};
const deleteCart = async(req,res)=>{
    try {
        const cart = await Cart.findByIdAndDelete(req.params.id);
        if(!cart){
            return res.status(404).json({
                message:"Cart not found"
            })
        }
        res.status(200).json({
            message:"Cart deleted successfully",
            data:cart
        })
    } catch (error) {
        res.status(500).json({
            message:"Error in deleting cart",
            error:error.message
        })
    }
}

const deleteItem = async (req, res) => {
    try {
        const { cartId, productId } = req.body;
        console.log(cartId,productId)

        const updatedCart = await Cart.findByIdAndUpdate(
            cartId,
            { $pull: { cartItems: { productId } } },
            { new: true }
        );

        if (!updatedCart) {
            return res.status(404).json({ message: "Cart not found or item not in cart" });
        }

        res.status(200).json({
            message: "Item removed from cart",
            cart: updatedCart,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error removing item from cart",
            error: error.message,
        });
    }
};


module.exports = {
    createCart,
    getCart,
    updateCart,
    deleteCart,
    deleteItem

}