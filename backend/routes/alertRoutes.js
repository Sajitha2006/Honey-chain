const express = require("express");

const router = express.Router();

const {
  getMyAlerts,
  getUnreadAlerts,
  markAlertAsRead,
  resolveAlert,
} = require("../controllers/alertController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.use(protect);
router.use(authorizeRoles("beekeeper"));

router.get("/", getMyAlerts);

router.get("/unread", getUnreadAlerts);

router.put("/:id/read", markAlertAsRead);

router.put("/:id/resolve", resolveAlert);

module.exports = router;