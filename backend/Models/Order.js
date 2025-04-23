const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: { type: String, required: true },
    },
  },
  shop: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: { type: String, required: true },
    },
  },
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  amount: { type: Number, required: true }, // item total
  deliveryFee: { type: Number, required: true },
  distanceFromShopToUser: { type: Number, default: null },
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: [
      "pending",
      "order_accepted",
      "reached",
      "picked",
      "onTheWay",
      "delivered",
    ],
    default: "pending",
  },
  placedAt: { type: Date, default: Date.now },
  estimatedDeliveryTime: { type: Date },
  paymentMethod: {
    type: String,
    enum: ["cash_on_delivery", "card", "online"],
    default: "cash_on_delivery",
  },
  driverId: {
    type:String,
    required:false
  },
  notes: { type: String },
});

orderSchema.index({status:1});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
