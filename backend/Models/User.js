const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
  customerId:{
    type:String,
      required:true
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
      enum: ["regular", "admin", "driver"],
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
