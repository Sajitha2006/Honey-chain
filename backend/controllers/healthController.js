const Hive = require("../models/Hive");
const SensorData = require("../models/SensorData");
const HealthRecord = require("../models/HealthRecord");
const Alert = require("../models/Alert");
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

// ================= ANALYZE HIVE HEALTH =================

const analyzeHiveHealth = async (req, res) => {
  try {
    const { hiveId } = req.params;

    // Find hive and verify ownership
    const hive = await findHive(hiveId, req.user.userId);

    if (!hive) {
      return res.status(404).json({
        success: false,
        message: "Hive not found",
      });
    }

    // Get latest sensor data
    const latestData = await SensorData.findOne({
      hive: hive._id,
    }).sort({
      recordedAt: -1,
    });

    if (!latestData) {
      return res.status(404).json({
        success: false,
        message: "No sensor data available for this hive to analyze health",
      });
    }

    let status = "healthy";
    let issues = [];
    let recommendation = "Hive conditions appear normal.";

    // Temperature Analysis
    if (latestData.temperature < 25 || latestData.temperature > 38) {
      status = "needs_attention";
      issues.push("Abnormal temperature detected");
      recommendation = "Check hive ventilation and environmental conditions.";
    }

    // High Risk Temperature
    if (latestData.temperature < 20 || latestData.temperature > 42) {
      status = "high_risk";
      issues.push("Critical temperature detected");
      recommendation = "Immediate inspection of the hive is recommended.";
    }

    // Humidity Analysis
    if (latestData.humidity < 40 || latestData.humidity > 75) {
      if (status !== "high_risk") {
        status = "needs_attention";
      }

      issues.push("Abnormal humidity detected");
    }

    // High Risk Humidity
    if (latestData.humidity < 30 || latestData.humidity > 85) {
      status = "high_risk";
      issues.push("Critical humidity level detected");
      recommendation =
        "Immediate inspection and environmental correction recommended.";
    }

    // Get previous reading for weight comparison
    const previousData = await SensorData.find({
      hive: hive._id,
    })
      .sort({ recordedAt: -1 })
      .skip(1)
      .limit(1);

    if (previousData.length > 0) {
      const weightDifference = latestData.weight - previousData[0].weight;

      const percentageChange =
        Math.abs(weightDifference / previousData[0].weight) * 100;

      if (percentageChange > 20) {
        status = "high_risk";

        issues.push(
          `Major weight change detected: ${percentageChange.toFixed(2)}%`,
        );

        recommendation =
          "Immediate hive inspection recommended due to major weight change.";
      } else if (percentageChange > 10 && status === "healthy") {
        status = "needs_attention";

        issues.push(
          `Noticeable weight change detected: ${percentageChange.toFixed(2)}%`,
        );

        recommendation = "Monitor hive weight changes closely.";
      }
    }

    // Create health record
    const healthRecord = await HealthRecord.create({
      hive: hive._id,
      status,
      temperature: latestData.temperature,
      humidity: latestData.humidity,
      weight: latestData.weight,
      issues,
      recommendation,
    });

    // ================= CREATE ALERT FOR HEALTH ISSUES =================

    if (status === "high_risk") {
      await Alert.create({
        beekeeper: req.user.userId,
        hive: hive._id,
        type: "health",
        severity: "critical",
        title: "Critical Hive Health Alert",
        message:
          issues.length > 0
            ? issues.join(", ")
            : "Critical hive health condition detected.",
      });
    }

    if (status === "needs_attention") {
      await Alert.create({
        beekeeper: req.user.userId,
        hive: hive._id,
        type: "health",
        severity: "medium",
        title: "Hive Needs Attention",
        message:
          issues.length > 0
            ? issues.join(", ")
            : "Hive conditions require monitoring.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Hive health analyzed successfully",
      healthRecord,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ================= GET HEALTH HISTORY =================

const getHealthHistory = async (req, res) => {
  try {
    const { hiveId } = req.params;

    const hive = await findHive(hiveId, req.user.userId);

    if (!hive) {
      return res.status(404).json({
        success: false,
        message: "Hive not found",
      });
    }

    const healthRecords = await HealthRecord.find({
      hive: hive._id,
    }).sort({
      analyzedAt: -1,
    });

    res.status(200).json({
      success: true,
      hiveId: hive.hiveId,
      count: healthRecords.length,
      healthRecords,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ================= GET LATEST HEALTH STATUS =================

const getLatestHealthStatus = async (req, res) => {
  try {
    const { hiveId } = req.params;

    const hive = await findHive(hiveId, req.user.userId);

    if (!hive) {
      return res.status(404).json({
        success: false,
        message: "Hive not found",
      });
    }

    const latestHealth = await HealthRecord.findOne({
      hive: hive._id,
    }).sort({
      analyzedAt: -1,
    });

    if (!latestHealth) {
      return res.status(404).json({
        success: false,
        message: "No health analysis available",
      });
    }

    res.status(200).json({
      success: true,
      hiveId: hive.hiveId,
      healthStatus: latestHealth,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ================= GET MY ALERTS =================

const getMyAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({
      beekeeper: req.user.userId,
    })
      .populate("hive", "hiveId beeType")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: alerts.length,
      alerts,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ================= GET UNREAD ALERTS =================

const getUnreadAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({
      beekeeper: req.user.userId,
      isRead: false,
    })
      .populate("hive", "hiveId beeType")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: alerts.length,
      alerts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ================= MARK ALERT AS READ =================

const markAlertAsRead = async (req, res) => {
  try {
    const alert = await Alert.findOneAndUpdate(
      {
        _id: req.params.id,
        beekeeper: req.user.userId,
      },
      {
        isRead: true,
      },
      {
        new: true,
      },
    );

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Alert marked as read",
      alert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ================= RESOLVE ALERT =================

const resolveAlert = async (req, res) => {
  try {
    const alert = await Alert.findOneAndUpdate(
      {
        _id: req.params.id,
        beekeeper: req.user.userId,
      },
      {
        status: "resolved",
        isRead: true,
      },
      {
        new: true,
      },
    );

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Alert resolved successfully",
      alert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getMyAlerts,
  getUnreadAlerts,
  markAlertAsRead,
  resolveAlert,
  analyzeHiveHealth,
  getHealthHistory,
  getLatestHealthStatus,
};
