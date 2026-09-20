const express = require("express");

const router = express.Router();

const {
  addToCart,
  getMyCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");


router.use(protect);
router.use(authorizeRoles("customer"));

router.post("/", addToCart);

router.get("/", getMyCart);

router.put("/:productId", updateCartItem);

router.delete("/:productId", removeFromCart);

router.delete("/", clearCart);

module.exports = router;