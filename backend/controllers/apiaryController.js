const Apiary = require("../models/Apiary");


// ================= CREATE APIARY =================

const createApiary = async (req, res) => {
  try {
    const { name, location, description } = req.body;

    if (!name || !location?.district || !location?.state) {
      return res.status(400).json({
        success: false,
        message: "Name, district and state are required",
      });
    }

    const apiary = await Apiary.create({
      beekeeper: req.user.userId,
      name,
      location,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Apiary created successfully",
      apiary,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ================= GET MY APIARIES =================

const getMyApiaries = async (req, res) => {
  try {
    const apiaries = await Apiary.find({
      beekeeper: req.user.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: apiaries.length,
      apiaries,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ================= GET SINGLE APIARY =================

const getApiaryById = async (req, res) => {
  try {
    const apiary = await Apiary.findOne({
      _id: req.params.id,
      beekeeper: req.user.userId,
    });

    if (!apiary) {
      return res.status(404).json({
        success: false,
        message: "Apiary not found",
      });
    }

    res.status(200).json({
      success: true,
      apiary,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ================= UPDATE APIARY =================

const updateApiary = async (req, res) => {
  try {
    const apiary = await Apiary.findOneAndUpdate(
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

    if (!apiary) {
      return res.status(404).json({
        success: false,
        message: "Apiary not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Apiary updated successfully",
      apiary,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ================= DELETE APIARY =================

const deleteApiary = async (req, res) => {
  try {
    const apiary = await Apiary.findOneAndDelete({
      _id: req.params.id,
      beekeeper: req.user.userId,
    });

    if (!apiary) {
      return res.status(404).json({
        success: false,
        message: "Apiary not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Apiary deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


module.exports = {
  createApiary,
  getMyApiaries,
  getApiaryById,
  updateApiary,
  deleteApiary,
};