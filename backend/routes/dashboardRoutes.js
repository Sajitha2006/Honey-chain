const express = require("express");

const router = express.Router();

const { getDashboardSummary } = require("../controllers/dashboardController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.get("/", protect, authorizeRoles("beekeeper"), getDashboardSummary);

module.exports = router;
