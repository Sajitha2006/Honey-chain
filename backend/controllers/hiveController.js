const Hive = require("../models/Hive");
const Apiary = require("../models/Apiary");


// ================= CREATE HIVE =================

const createHive = async (req, res) => {
  try {
    const {
      apiary,
      hiveId,
      beeType,
      hiveType,
      installationDate,
      status,
      notes,
    } = req.body;

    // Validation
    if (!apiary || !hiveId || !beeType) {
      return res.status(400).json({
        success: false,
        message: "Apiary, Hive ID and Bee Type are required",
      });
    }

    // Check whether apiary belongs to logged-in beekeeper
    const existingApiary = await Apiary.findOne({
      _id: apiary,
      beekeeper: req.user.userId,
    });

    if (!existingApiary) {
      return res.status(404).json({
        success: false,
        message: "Apiary not found or access denied",
      });
    }

    // Check duplicate Hive ID
    const existingHive = await Hive.findOne({ hiveId });

    if (existingHive) {
      return res.status(400).json({
        success: false,
        message: "Hive ID already exists",
      });
    }

    // Create hive
    const hive = await Hive.create({
      beekeeper: req.user.userId,
      apiary,
      hiveId,
      beeType,
      hiveType,
      installationDate,
      status,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Hive created successfully",
      hive,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ================= GET ALL MY HIVES =================

const getMyHives = async (req, res) => {
  try {
    const hives = await Hive.find({
      beekeeper: req.user.userId,
    })
      .populate("apiary", "name location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: hives.length,
      hives,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ================= GET SINGLE HIVE =================

const getHiveById = async (req, res) => {
  try {
    const hive = await Hive.findOne({
      _id: req.params.id,
      beekeeper: req.user.userId,
    }).populate("apiary", "name location");

    if (!hive) {
      return res.status(404).json({
        success: false,
        message: "Hive not found",
      });
    }

    res.status(200).json({
      success: true,
      hive,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ================= GET HIVES BY APIARY =================

const getHivesByApiary = async (req, res) => {
  try {
    const apiary = await Apiary.findOne({
      _id: req.params.apiaryId,
      beekeeper: req.user.userId,
    });

    if (!apiary) {
      return res.status(404).json({
        success: false,
        message: "Apiary not found",
      });
    }

    const hives = await Hive.find({
      apiary: req.params.apiaryId,
      beekeeper: req.user.userId,
    });

    res.status(200).json({
      success: true,
      apiary: apiary.name,
      count: hives.length,
      hives,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ================= UPDATE HIVE =================

const updateHive = async (req, res) => {
  try {
    const hive = await Hive.findOneAndUpdate(
      {
        _id: req.params.id,
        beekeeper: req.user.userId,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!hive) {
      return res.status(404).json({
        success: false,
        message: "Hive not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Hive updated successfully",
      hive,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ================= DELETE HIVE =================

const deleteHive = async (req, res) => {
  try {
    const hive = await Hive.findOneAndDelete({
      _id: req.params.id,
      beekeeper: req.user.userId,
    });

    if (!hive) {
      return res.status(404).json({
        success: false,
        message: "Hive not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Hive deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


module.exports = {
  createHive,
  getMyHives,
  getHiveById,
  getHivesByApiary,
  updateHive,
  deleteHive,
};