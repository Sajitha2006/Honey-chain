const mongoose = require("mongoose");

const sensorDataSchema = new mongoose.Schema(
  {
    hive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hive",
      required: true,
    },

    deviceId: {
      type: String,
      required: true,
      trim: true,
    },

    temperature: {
      type: Number,
      required: true,
    },

    humidity: {
      type: Number,
      required: true,
    },

    weight: {
      type: Number,
      required: true,
    },

    recordedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SensorData", sensorDataSchema);