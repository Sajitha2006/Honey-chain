const express = require("express");

const router = express.Router();

const {
  createHive,
  getMyHives,
  getHiveById,
  getHivesByApiary,
  updateHive,
  deleteHive,
} = require("../controllers/hiveController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.use(protect);
router.use(authorizeRoles("beekeeper"));

// Create hive
router.post("/", createHive);

// Get all my hives
router.get("/", getMyHives);

// Get hives inside one apiary
router.get("/apiary/:apiaryId", getHivesByApiary);

// Get single hive
router.get("/:id", getHiveById);

// Update hive
router.put("/:id", updateHive);

// Delete hive
router.delete("/:id", deleteHive);

module.exports = router;