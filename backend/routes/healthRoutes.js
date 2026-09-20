const express = require("express");

const router = express.Router();

console.log("[Health Router] healthRoutes loaded");

// Debug ping route (unprotected test endpoint)
router.get("/ping", (req, res) => {
  res.json({
    success: true,
    message: "Health router mounted and operational",
  });
});

const {
  analyzeHiveHealth,
  getHealthHistory,
  getLatestHealthStatus,
} = require("../controllers/healthController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.use(protect);
router.use(authorizeRoles("beekeeper"));

// Analyze current hive health
router.post("/:hiveId/analyze", analyzeHiveHealth);

// Get latest health status
router.get("/:hiveId/latest", getLatestHealthStatus);

// Get health history
router.get("/:hiveId/history", getHealthHistory);

module.exports = router;