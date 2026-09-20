const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    beekeeper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    hive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hive",
      required: true,
    },

    type: {
      type: String,
      enum: [
        "temperature",
        "humidity",
        "weight",
        "health",
        "disease"
      ],
      required: true,
    },

    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["active", "resolved"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Alert", alertSchema);