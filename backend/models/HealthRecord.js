const mongoose = require("mongoose");

const healthRecordSchema = new mongoose.Schema(
  {
    hive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hive",
      required: true,
    },

    status: {
      type: String,
      enum: ["healthy", "needs_attention", "high_risk"],
      required: true,
    },

    temperature: {
      type: Number,
    },

    humidity: {
      type: Number,
    },

    weight: {
      type: Number,
    },

    issues: [
      {
        type: String,
      },
    ],

    recommendation: {
      type: String,
    },

    analyzedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("HealthRecord", healthRecordSchema);