const express = require("express");

const router = express.Router();

const {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getBeekeeperOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");


// ================= CUSTOMER ROUTES =================

router.post(
  "/",
  protect,
  authorizeRoles("customer"),
  placeOrder
);

router.get(
  "/my-orders",
  protect,
  authorizeRoles("customer"),
  getMyOrders
);

router.get(
  "/my-orders/:id",
  protect,
  authorizeRoles("customer"),
  getOrderById
);

router.put(
  "/my-orders/:id/cancel",
  protect,
  authorizeRoles("customer"),
  cancelOrder
);


// ================= BEEKEEPER ROUTES =================

router.get(
  "/beekeeper",
  protect,
  authorizeRoles("beekeeper"),
  getBeekeeperOrders
);

router.put(
  "/beekeeper/:id/status",
  protect,
  authorizeRoles("beekeeper"),
  updateOrderStatus
);


module.exports = router;