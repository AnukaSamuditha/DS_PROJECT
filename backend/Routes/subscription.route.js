const express = require("express");
const router = express.Router();
const Subscription = require("../Models/subscription.model");

router.post("/subscribe", async (req, res) => {
    const { userId } = req.query;
    const subscription = req.body;

    try {
        const existing = await Subscription.findOne({ userId });

        if (existing) {
            existing.subscription = subscription;
            await existing.save();
            console.log(`Updated subscription for user ${userId}`);
        } else {
            await Subscription.create({ userId, subscription });
            console.log(`Created new subscription for user ${userId}`);
        }

        res.status(201).json({ message: "Subscription saved" });
    } catch (err) {
        console.error("Failed to save subscription:", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
});




module.exports = router;