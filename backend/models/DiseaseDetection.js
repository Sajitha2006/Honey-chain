const mongoose = require("mongoose");

const diseaseDetectionSchema = new mongoose.Schema(
  {
    hive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hive",
      required: true,
    },

    beekeeper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    imageType: {
      type: String,
      enum: ["bee", "hive", "honeycomb"],
      required: true,
    },

    detectedIssue: {
      type: String,
      default: "Pending Analysis",
    },

    confidence: {
      type: Number,
      default: 0,
    },

    riskLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },

    recommendation: {
      type: String,
      default: "Awaiting AI analysis.",
    },

    status: {
      type: String,
      enum: ["pending", "analyzed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "DiseaseDetection",
  diseaseDetectionSchema
);