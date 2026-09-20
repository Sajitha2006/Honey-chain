const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    beekeeper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    honeyType: {
      type: String,
      enum: [
        "Wild Honey",
        "Multiflora Honey",
        "Forest Honey",
        "Organic Honey",
        "Acacia Honey",
        "Other",
      ],
      default: "Other",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    unit: {
      type: String,
      enum: ["g", "kg", "ml", "l"],
      default: "g",
    },

    imageUrl: {
      type: String,
      default: null,
    },
    
    honeyBatch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HoneyBatch",
      default: null,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Product", productSchema);
