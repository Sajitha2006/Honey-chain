const SensorData = require("../models/SensorData");
const Hive = require("../models/Hive");
const mongoose = require("mongoose");

// Helper to query hive by MongoDB _id OR custom hiveId string
const findHive = (hiveId, beekeeperId) => {
  return Hive.findOne({
    $or: [
      { _id: mongoose.Types.ObjectId.isValid(hiveId) ? hiveId : null },
      { hiveId: hiveId },
    ],
    beekeeper: beekeeperId,
  });
};

// ================= RECEIVE SENSOR DATA =================

const receiveSensorData = async (req, res) => {
  try {
    const {
      hiveId,
      deviceId,
      temperature,
      humidity,
      weight,
    } = req.body;

    // Validation
    if (
      !hiveId ||
      !deviceId ||
      temperature === undefined ||
      humidity === undefined ||
      weight === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All sensor fields are required",
      });
    }

    // Find hive using custom Hive ID or _id
    const hive = await Hive.findOne({
      $or: [
        { _id: mongoose.Types.ObjectId.isValid(hiveId) ? hiveId : null },
        { hiveId: hiveId },
      ],
    });

    if (!hive) {
      return res.status(404).json({
        success: false,
        message: "Hive not found",
      });
    }

    // Create sensor reading
    const sensorData = await SensorData.create({
      hive: hive._id,
      deviceId,
      temperature,
      humidity,
      weight,
    });

    res.status(201).json({
      success: true,
      message: "Sensor data received successfully",
      sensorData,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ================= GET SENSOR HISTORY =================

const getSensorHistory = async (req, res) => {
  try {
    const { hiveId } = req.params;

    // Find Hive by Mongo _id OR custom hiveId
    const hive = await findHive(hiveId, req.user.userId);

    if (!hive) {
      return res.status(404).json({
        success: false,
        message: "Hive not found",
      });
    }

    // Get sensor data
    const sensorData = await SensorData.find({
      hive: hive._id,
    }).sort({
      recordedAt: -1,
    });

    res.status(200).json({
      success: true,
      hiveId: hive.hiveId,
      count: sensorData.length,
      sensorData,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ================= GET LATEST SENSOR DATA =================

const getLatestSensorData = async (req, res) => {
  try {
    const { hiveId } = req.params;

    const hive = await findHive(hiveId, req.user.userId);

    if (!hive) {
      return res.status(404).json({
        success: false,
        message: "Hive not found",
      });
    }

    const latestData = await SensorData.findOne({
      hive: hive._id,
    }).sort({
      recordedAt: -1,
    });

    if (!latestData) {
      return res.status(404).json({
        success: false,
        message: "No sensor data available for this hive",
      });
    }

    res.status(200).json({
      success: true,
      hiveId: hive.hiveId,
      sensorData: latestData,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


module.exports = {
  receiveSensorData,
  getSensorHistory,
  getLatestSensorData,
};