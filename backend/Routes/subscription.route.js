const express = require("express");
const router = express.Router();
const Subscription = require("../Models/subscription.model");

router.post("/subscribe", async (req, res) => {
    const { userId } = req.query;
    const subscription = req.body;

    try {
        const existing = await Subscription.findOne({ userId, subscription });
        if (!existing) {
            await Subscription.create({ userId, subscription });
        }
        res.status(201).json({ message: "Subscribed successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;