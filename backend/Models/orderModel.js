const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  address: String
});

const itemSchema = new mongoose.Schema({
  menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
  name: String,
  quantity: Number,
  price: Number
});

const orderSchema = new mongoose.Schema({
  user: {
    id: { type: String, required: true },
    name: String,
    location: locationSchema
  },
  shop: {
    id: { type: String, required: true },
    name: String,
    location: locationSchema
  },
  items: [itemSchema],
  amount: { type: Number, required: true },
  deliveryFee: { type: Number, required: false },
  totalAmount: { type: Number, required: false },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'delivering', 'delivered', 'cancelled'],
    default: 'pending'
  },
  placedAt: { type: Date, default: Date.now },
  paymentMethod: {
    type: String,
    enum: ['cash_on_delivery', 'card', 'online'],
    required: true
  },
  notes: String
});

module.exports = mongoose.model('Order', orderSchema);
