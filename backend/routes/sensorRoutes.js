const express = require("express");

const router = express.Router();

const {
  receiveSensorData,
  getSensorHistory,
  getLatestSensorData,
} = require("../controllers/sensorController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");


// ESP32 sends sensor data
router.post("/data", receiveSensorData);


// Beekeeper reads sensor data
router.get(
  "/:hiveId/history",
  protect,
  authorizeRoles("beekeeper"),
  getSensorHistory
);


router.get(
  "/:hiveId/latest",
  protect,
  authorizeRoles("beekeeper"),
  getLatestSensorData
);


module.exports = router;