const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 200,
    },
    address: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    openingHours: {
      type: String,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    adminApproved: {
      type: Boolean,
      default: false,
    },
    imageUrl: {
      type: String
    },
    photo:{
      type: String,
      default: ''
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    //GeoJSON format for location
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number], //[longitude, latitude]
        required: true
      }
    }
  },
  { timestamps: true }
);


//create geospatial index
RestaurantSchema.index({ location: "2dsphere" });


// Prevent duplicate restaurants per owner
//RestaurantSchema.index({ owner: 1 }, { unique: true });

module.exports = mongoose.model("Restaurant", RestaurantSchema);
