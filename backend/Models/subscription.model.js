const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    subscription: {
        type: Object,
        required: true,
    },
});

module.exports = mongoose.model("Subscription", subscriptionSchema);