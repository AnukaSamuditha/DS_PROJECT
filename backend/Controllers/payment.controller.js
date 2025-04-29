const Payment = require("../Models/payment.model");

const createPayment = async (req, res) => {
    try {
        const payment = await Payment.create(req.body);
        console.log(payment);
        res.status(200).json({
            message: "Payment created successfully",
            data: payment,
        });
    } catch (error) {
        console.log("not working")
        console.error("Payment creation failed:", error); // helpful for debug
        res.status(500).json({
            message: "Error in creating payment",
            error: error.message,
        });
    }
};

const getPayment = async (req,res)=>{
    try{
        const payment = await Payment.find({userId: req.user.id});
        if(!payment){
            return res.status(404).json({
                message:"Payment not found"
            })
        }
        res.status(200).json({
            message:"Payment fetched successfully",
            data:payment
        })
    }catch(error){
        res.status(500).json({
            message:"Error in fetching payment",
            error:error.message
        })
    }
}

const cancelPayment = async (req,res)=>{
    try{
        const payment = await Payment.findByIdAndDelete(req.params.id);
        if(!payment){
            return res.status(404).json({
                message:"Payment not found"
            })
        }
        res.status(200).json({
            message:"Payment deleted successfully",
            data:payment
        })
    }catch(error){
        res.status(500).json({
            message:"Error in deleting payment",
            error:error.message
        })
    }
}

module.exports = {
    createPayment,
    getPayment,
    cancelPayment
}
