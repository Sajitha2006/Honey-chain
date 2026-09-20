const mongoose = require("mongoose");

const honeyBatchSchema = new mongoose.Schema(
  {
    batchId: {
      type: String,
      required: true,
      unique: true,
    },

    beekeeper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    apiary: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Apiary",
      required: true,
    },

    hive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hive",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },

    honeyType: {
      type: String,
      required: true,
    },

    harvestDate: {
      type: Date,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    unit: {
      type: String,
      enum: ["g", "kg"],
      default: "kg",
    },

    processingDetails: {
      type: String,
      default: "Raw honey collected and processed naturally.",
    },

    qrCode: {
      type: String,
      default: null,
    },

    verificationStatus: {
      type: String,
      enum: ["verified", "pending"],
      default: "verified",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("HoneyBatch", honeyBatchSchema);