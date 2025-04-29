const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    customerId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: "regular",
      enum: ["regular", "admin", "driver", "restaurantOwner"],
    },
    isDelivering: {
      type: Boolean,
      default: function () {
        return this.role === "driver" ? false : undefined;
      },
      validate: {
        validator: function (value) {
          if (this.role === "driver") {
            return value === true || value === false;
          }
          return value === undefined;
        },
        message: "isDelivering value must be available",
      },
    },
    ratings: {
      type: [Number],
      required: false,
      default: function () {
        return this.role === "driver" ? [] : undefined;
      },
      validate: {
        validator: function (ratings) {
          return ratings.every((r) => r >= 1 && r <= 5);
        },
        message: "Ratings must be between 1 and 5",
      },
    },
    averageRating: {
      type: Number,
      default: function () {
        return this.role === "driver" ? 0 : undefined;
      },
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

userSchema.methods.addRating = async function (newRating) {
  if (this.role !== "driver") {
    throw new Error("Only drivers can receive ratings");
  }

  if (newRating < 1 || newRating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  this.ratings.push(newRating);

  const total = this.ratings.reduce((sum, rating) => sum + rating, 0);
  this.averageRating = parseFloat((total / this.ratings.length).toFixed(2));

  await this.save();
  return this;
};
module.exports = mongoose.model("User", userSchema);
