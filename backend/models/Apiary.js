const mongoose = require("mongoose");

const apiarySchema = new mongoose.Schema(
  {
    beekeeper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: [true, "Apiary name is required"],
      trim: true,
    },

    location: {
      address: {
        type: String,
        trim: true,
      },

      district: {
        type: String,
        required: true,
      },

      state: {
        type: String,
        required: true,
      },

      pincode: {
        type: String,
      },
    },

    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Apiary", apiarySchema);