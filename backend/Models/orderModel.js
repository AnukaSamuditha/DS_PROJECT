const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  cartId:{
    type:String,
    required:true
  },
  resId:{
    type:String,
    required:true
  },
  total:{
    type:Number,
    required:true
  },
  status:{
    type:String,
    enum:["refunded","accepted"],
    required:true
  }


});

module.exports = mongoose.model('Order', orderSchema);
