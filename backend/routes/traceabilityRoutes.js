const express = require("express");

const router = express.Router();

const {
  createHoneyBatch,
  verifyHoneyBatch,
  getMyHoneyBatches,
  getHoneyJourney,
  linkProductToBatch,
} = require("../controllers/traceabilityController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// PUBLIC ROUTES
router.get("/verify/:batchId", verifyHoneyBatch);

router.get("/journey/:batchId", getHoneyJourney);

// BEEKEEPER ROUTES
router.post("/batch", protect, authorizeRoles("beekeeper"), createHoneyBatch);

router.get(
  "/my-batches",
  protect,
  authorizeRoles("beekeeper"),
  getMyHoneyBatches,
);

router.post(
  "/link-product/:batchId",
  protect,
  authorizeRoles("beekeeper"),
  linkProductToBatch,
);
router.put(
  "/batch/:batchId/link-product",
  protect,
  authorizeRoles("beekeeper"),
  linkProductToBatch,
);
module.exports = router;
