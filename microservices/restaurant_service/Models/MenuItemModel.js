const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        maxlength: 200
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true
    },
    isAvailable: {
        type: Boolean, 
        default: true
    },
    preparationTime: {
        type: Number,
        default: 15 //in minutes
    },
    ImageUrl: {
        type: String,
        
    },
    photo: {
        type: String,
        default: ''
    },
    restaurant:{
        type: mongoose.Schema.ObjectId,
        ref: "Restaurant",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{ timestamps: true });

module.exports = mongoose.model('MenuItem', MenuItemSchema);