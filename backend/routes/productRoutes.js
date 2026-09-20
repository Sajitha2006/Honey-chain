const express = require("express");
const router = express.Router();

const {
  addProduct,
  getMyProducts,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const upload = require("../middleware/productUploadMiddleware");

// ================= BEEKEEPER PRODUCT MANAGEMENT =================

// Get beekeeper's own products
router.get(
  "/my-products",
  protect,
  authorizeRoles("beekeeper"),
  getMyProducts
);

// Add product with optional image
router.post(
  "/",
  protect,
  authorizeRoles("beekeeper"),
  upload.single("image"),
  addProduct
);

// Update product with optional new image
router.put(
  "/:id",
  protect,
  authorizeRoles("beekeeper"),
  upload.single("image"),
  updateProduct
);

// Delete product
router.delete(
  "/:id",
  protect,
  authorizeRoles("beekeeper"),
  deleteProduct
);

// ================= PUBLIC / CUSTOMER =================

router.get("/", getAllProducts);

router.get("/:id", getProductById);

module.exports = router;