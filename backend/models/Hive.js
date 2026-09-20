const mongoose = require("mongoose");

const hiveSchema = new mongoose.Schema(
  {
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

    hiveId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    beeType: {
      type: String,
      required: true,
      trim: true,
    },

    hiveType: {
      type: String,
      default: "Langstroth",
      trim: true,
    },

    installationDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "maintenance"],
      default: "active",
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Hive", hiveSchema);