const Apiary = require("../models/Apiary");
const Hive = require("../models/Hive");
const SensorData = require("../models/SensorData");
const HealthRecord = require("../models/HealthRecord");
const DiseaseDetection = require("../models/DiseaseDetection");
const Alert = require("../models/Alert");


// ================= GET DASHBOARD SUMMARY =================

const getDashboardSummary = async (req, res) => {
  try {
    const beekeeperId = req.user.userId;

    // ================= TOTAL APIARIES =================

    const totalApiaries = await Apiary.countDocuments({
      beekeeper: beekeeperId,
    });


    // ================= TOTAL HIVES =================

    const totalHives = await Hive.countDocuments({
      beekeeper: beekeeperId,
    });


    // ================= GET ALL HIVES =================

    const hives = await Hive.find({
      beekeeper: beekeeperId,
    }).select("_id hiveId beeType status");


    const hiveIds = hives.map((hive) => hive._id);


    // ================= HEALTH STATUS COUNTS =================

    const healthRecords = await HealthRecord.find({
      hive: { $in: hiveIds },
    }).sort({
      analyzedAt: -1,
    });


    // Get latest health record for each hive
    const latestHealthMap = {};

    healthRecords.forEach((record) => {
      const hiveId = record.hive.toString();

      if (!latestHealthMap[hiveId]) {
        latestHealthMap[hiveId] = record;
      }
    });


    let healthyHives = 0;
    let needsAttention = 0;
    let highRiskHives = 0;


    Object.values(latestHealthMap).forEach((record) => {
      if (record.status === "healthy") {
        healthyHives++;
      } else if (record.status === "needs_attention") {
        needsAttention++;
      } else if (record.status === "high_risk") {
        highRiskHives++;
      }
    });


    // ================= LATEST SENSOR DATA =================

    const latestSensorData = await SensorData.find({
      hive: { $in: hiveIds },
    })
      .populate("hive", "hiveId")
      .sort({
        recordedAt: -1,
      })
      .limit(5);


    // ================= RECENT DISEASE DETECTIONS =================

    const recentDiseaseDetections =
      await DiseaseDetection.find({
        beekeeper: beekeeperId,
        status: "analyzed",
      })
        .populate("hive", "hiveId beeType")
        .sort({
          createdAt: -1,
        })
        .limit(5);


    // ================= UNREAD ALERTS =================

    const unreadAlerts = await Alert.find({
      beekeeper: beekeeperId,
      isRead: false,
    })
      .populate("hive", "hiveId beeType")
      .sort({
        createdAt: -1,
      })
      .limit(5);


    // ================= RESPONSE =================

    res.status(200).json({
      success: true,

      summary: {
        totalApiaries,
        totalHives,

        hiveHealth: {
          healthy: healthyHives,
          needsAttention,
          highRisk: highRiskHives,
        },

        unreadAlertCount: await Alert.countDocuments({
          beekeeper: beekeeperId,
          isRead: false,
        }),
      },

      latestSensorData,

      recentDiseaseDetections,

      unreadAlerts,
    });

  } catch (error) {
    console.error("Dashboard Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard data",
    });
  }
};


module.exports = {
  getDashboardSummary,
};