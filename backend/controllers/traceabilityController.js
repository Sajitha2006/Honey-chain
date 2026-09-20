const HoneyBatch = require("../models/HoneyBatch");
const Apiary = require("../models/Apiary");
const Hive = require("../models/Hive");
const Product = require("../models/Product");
const SensorData = require("../models/SensorData");
const HealthRecord = require("../models/HealthRecord");
const QRCode = require("qrcode");


// ================= CREATE HONEY BATCH =================

const createHoneyBatch = async (req, res) => {
  try {
    const {
      apiaryId,
      hiveId,
      productId,
      honeyType,
      harvestDate,
      quantity,
      unit,
      processingDetails,
    } = req.body;

    // Validate required fields
    if (
      !apiaryId ||
      !hiveId ||
      !honeyType ||
      !harvestDate ||
      !quantity
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Verify apiary ownership
    const apiary = await Apiary.findOne({
      _id: apiaryId,
      beekeeper: req.user.userId,
    });

    if (!apiary) {
      return res.status(404).json({
        success: false,
        message: "Apiary not found",
      });
    }

    // Verify hive ownership and apiary
    const hive = await Hive.findOne({
      _id: hiveId,
      beekeeper: req.user.userId,
      apiary: apiaryId,
    });

    if (!hive) {
      return res.status(404).json({
        success: false,
        message: "Hive not found in selected apiary",
      });
    }

    // Verify product ownership if provided
    let product = null;

    if (productId) {
      product = await Product.findOne({
        _id: productId,
        beekeeper: req.user.userId,
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
    }

    // Generate unique batch ID
    const batchId = `HC-${Date.now()}-${Math.floor(
      Math.random() * 1000
    )}`;

    // Create honey batch
    const batch = await HoneyBatch.create({
      batchId,
      beekeeper: req.user.userId,
      apiary: apiaryId,
      hive: hiveId,
      product: productId || null,
      honeyType,
      harvestDate,
      quantity,
      unit: unit || "kg",
      processingDetails,
    });

    // If product exists, link product to batch
    if (product) {
      product.honeyBatch = batch._id;
      await product.save();
    }

    // Generate verification URL
    const verificationUrl = `http://localhost:5000/api/traceability/verify/${batch.batchId}`;

    // Generate QR Code
    const qrCode = await QRCode.toDataURL(verificationUrl);

    batch.qrCode = qrCode;

    await batch.save();

    res.status(201).json({
      success: true,
      message: "Honey batch created successfully",
      batch,
      verificationUrl,
    });

  } catch (error) {
    console.error("Create Batch Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create honey batch",
    });
  }
};


// ================= VERIFY HONEY BATCH (PUBLIC) =================

const verifyHoneyBatch = async (req, res) => {
  try {
    const batch = await HoneyBatch.findOne({
      batchId: req.params.batchId,
    })
      .populate("beekeeper", "name")
      .populate("apiary", "name location")
      .populate("hive", "hiveId beeType hiveType");

    if (!batch) {
      return res.status(404).json({
        success: false,
        verified: false,
        message: "Invalid or unknown honey batch",
      });
    }

    // Get latest sensor data
    const latestSensorData = await SensorData.findOne({
      hive: batch.hive._id,
    }).sort({
      recordedAt: -1,
    });

    // Get latest health record
    const latestHealth = await HealthRecord.findOne({
      hive: batch.hive._id,
    }).sort({
      analyzedAt: -1,
    });

    res.status(200).json({
      success: true,
      verified: true,
      message: "Authentic Honey Batch Verified",

      batch: {
        batchId: batch.batchId,
        honeyType: batch.honeyType,
        harvestDate: batch.harvestDate,
        quantity: batch.quantity,
        unit: batch.unit,
        processingDetails: batch.processingDetails,
        verificationStatus: batch.verificationStatus,
      },

      source: {
        beekeeper: batch.beekeeper,
        apiary: batch.apiary,
        hive: batch.hive,
      },

      hiveConditions: {
        latestSensorData,
        latestHealth,
      },
    });

  } catch (error) {
    console.error("Verification Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to verify honey batch",
    });
  }
};


// ================= GET MY HONEY BATCHES =================

const getMyHoneyBatches = async (req, res) => {
  try {
    const batches = await HoneyBatch.find({
      beekeeper: req.user.userId,
    })
      .populate("apiary", "name")
      .populate("hive", "hiveId beeType")
      .populate("product", "name price")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: batches.length,
      batches,
    });

  } catch (error) {
    console.error("Get Batches Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch honey batches",
    });
  }
};


// ================= GET HONEY JOURNEY TIMELINE =================

const getHoneyJourney = async (req, res) => {
  try {
    const batch = await HoneyBatch.findOne({
      batchId: req.params.batchId,
    })
      .populate("beekeeper", "name")
      .populate("apiary", "name location")
      .populate(
        "hive",
        "hiveId beeType hiveType installationDate"
      )
      .populate("product", "name honeyType price");

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Honey batch not found",
      });
    }

    // Get sensor records
    const sensorRecords = await SensorData.find({
      hive: batch.hive._id,
    })
      .sort({
        recordedAt: 1,
      })
      .limit(10);

    // Get health records
    const healthRecords = await HealthRecord.find({
      hive: batch.hive._id,
    })
      .sort({
        analyzedAt: 1,
      })
      .limit(10);

    const timeline = [];

    // STEP 1 - HIVE ESTABLISHED
    timeline.push({
      step: 1,
      event: "Hive Established",
      icon: "🐝",
      date:
        batch.hive.installationDate ||
        batch.createdAt,
      description: `Hive ${batch.hive.hiveId} was established for bee colony management.`,
      status: "completed",
    });

    // STEP 2 - IOT MONITORING
    if (sensorRecords.length > 0) {
      timeline.push({
        step: 2,
        event: "IoT Environmental Monitoring",
        icon: "🌡️",
        date: sensorRecords[0].recordedAt,
        description: `${sensorRecords.length} sensor records captured for temperature, humidity and hive weight monitoring.`,
        status: "completed",
      });
    }

    // STEP 3 - HEALTH ANALYSIS
    if (healthRecords.length > 0) {
      const latestHealth =
        healthRecords[healthRecords.length - 1];

      timeline.push({
        step: 3,
        event: "Hive Health Analysis",
        icon: "❤️",
        date: latestHealth.analyzedAt,
        description: `Latest hive health status: ${latestHealth.status}. ${latestHealth.recommendation}`,
        status: latestHealth.status,
      });
    }

    // STEP 4 - HONEY HARVEST
    timeline.push({
      step: 4,
      event: "Honey Harvested",
      icon: "🍯",
      date: batch.harvestDate,
      description: `${batch.quantity} ${batch.unit} of ${batch.honeyType} was harvested from the monitored hive.`,
      status: "completed",
    });

    // STEP 5 - HONEY PROCESSING
    timeline.push({
      step: 5,
      event: "Honey Processing",
      icon: "⚙️",
      date: batch.createdAt,
      description:
        batch.processingDetails ||
        "Honey processed and prepared.",
      status: "completed",
    });

    // STEP 6 - PRODUCT CREATED
    if (batch.product) {
      timeline.push({
        step: 6,
        event: "Product Created",
        icon: "📦",
        date: batch.createdAt,
        description: `${batch.product.name} was linked with this traceable honey batch.`,
        status: "completed",
      });
    }

    // STEP 7 - QR TRACEABILITY
    timeline.push({
      step: 7,
      event: "QR Traceability Enabled",
      icon: "📱",
      date: batch.updatedAt,
      description:
        "Unique QR code generated for public authenticity verification and honey traceability.",
      status: "verified",
    });

    res.status(200).json({
      success: true,
      message: "Honey journey retrieved successfully",

      batch: {
        batchId: batch.batchId,
        honeyType: batch.honeyType,
        harvestDate: batch.harvestDate,
        verificationStatus:
          batch.verificationStatus,
      },

      source: {
        beekeeper: batch.beekeeper,
        apiary: batch.apiary,
        hive: batch.hive,
      },

      timeline,
    });

  } catch (error) {
    console.error(
      "Honey Journey Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to retrieve honey journey",
    });
  }
};


// ================= LINK PRODUCT TO HONEY BATCH =================

const linkProductToBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    const { productId } = req.body;

    // Find batch
    const batch = await HoneyBatch.findOne({
      batchId,
      beekeeper: req.user.userId,
    });

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Honey batch not found",
      });
    }

    // Find product
    const product = await Product.findOne({
      _id: productId,
      beekeeper: req.user.userId,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Link batch to product
    batch.product = product._id;

    // Link product to batch
    product.honeyBatch = batch._id;

    await batch.save();
    await product.save();

    res.status(200).json({
      success: true,
      message:
        "Product successfully linked to honey batch",
      batchId: batch.batchId,
      product: product.name,
    });

  } catch (error) {
    console.error(
      "Link Product Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to link product with honey batch",
    });
  }
};


// ================= EXPORTS =================

module.exports = {
  createHoneyBatch,
  verifyHoneyBatch,
  getMyHoneyBatches,
  getHoneyJourney,
  linkProductToBatch,
};