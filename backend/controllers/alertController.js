const Alert = require("../models/Alert");


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
      }
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
      }
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
};