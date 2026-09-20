const express = require("express");

const router = express.Router();

const {
  createApiary,
  getMyApiaries,
  getApiaryById,
  updateApiary,
  deleteApiary,
} = require("../controllers/apiaryController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");



router.use(protect);


router.use(authorizeRoles("beekeeper"));


router.post("/", createApiary);

router.get("/", getMyApiaries);

router.get("/:id", getApiaryById);

router.put("/:id", updateApiary);

router.delete("/:id", deleteApiary);


module.exports = router;