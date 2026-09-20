const express = require("express");
const multer = require("multer");

const router = express.Router();

const {
  uploadDiseaseImage,
  getMyDetections,
  getDetectionsByHive,
} = require("../controllers/diseaseController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");


// All disease routes require beekeeper login
router.use(protect);
router.use(authorizeRoles("beekeeper"));


// Middleware wrapper to handle MulterError gracefully
const handleUpload = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            message: "Image size must be less than 5 MB.",
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message || "File upload error",
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message || "Invalid file format",
      });
    }
    next();
  });
};

// Upload image
router.post(
  "/upload",
  handleUpload,
  uploadDiseaseImage
);


// Get all detections
router.get("/", getMyDetections);


// Get detections for a hive
router.get("/hive/:hiveId", getDetectionsByHive);


module.exports = router;