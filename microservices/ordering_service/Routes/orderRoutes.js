const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET);

const router = express.Router();
const {
  placeOrder,
  getOrdersByUser,
  updateOrderStatus,
  updateOrderDetails,
  deleteOrder, createOrder
} = require('../Controllers/orderController');
const { authenticate, authorize } = require('../Auth/auth');

router.post('/', authenticate, placeOrder);

router.get("/my-orders", authenticate, authorize(["regular", "rider"]), getOrdersByUser);
router.patch("/:id/status", authenticate, authorize(["admin", "rider","regular"]), updateOrderStatus);
router.patch("/:id", authenticate, authorize(["regular"]), updateOrderDetails);
router.delete("/:id", authenticate, authorize(["regular", "admin"]), deleteOrder);
router.post('/:cartId/:resId', authenticate,authorize(["regular"]), createOrder);

router.post("/refund", async (req, res) => {
    const { paymentIntentId, amount } = req.body;

    try {
        const refund = await stripe.refunds.create({
            payment_intent: paymentIntentId,
            amount: amount ? Math.round(amount * 100) : undefined,
        });

        res.status(200).json({ success: true, refund });
    } catch (err) {
        console.error("Refund error:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
