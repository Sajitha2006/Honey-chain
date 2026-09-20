const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");


// ================= PLACE ORDER =================

const placeOrder = async (req, res) => {
  try {
    const {
      shippingAddress,
      paymentMethod,
    } = req.body;

    // Validate address
    if (
      !shippingAddress ||
      !shippingAddress.name ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete shipping address is required",
      });
    }

    // Get customer cart
    const cart = await Cart.findOne({
      customer: req.user.userId,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const orderItems = [];
    let totalAmount = 0;

    // Validate each product
    for (const item of cart.items) {
      const product = await Product.findById(
        item.product._id
      );

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product.name}`,
        });
      }

      if (!product.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is currently unavailable`,
        });
      }

      if (item.quantity > product.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
        });
      }

      const subtotal =
        product.price * item.quantity;

      orderItems.push({
        product: product._id,
        beekeeper: product.beekeeper,
        productName: product.name,
        price: product.price,
        quantity: item.quantity,
        subtotal,
      });

      totalAmount += subtotal;
    }

    // Create order
    const order = await Order.create({
      customer: req.user.userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || "COD",
    });

    // Reduce stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        {
          $inc: {
            quantity: -item.quantity,
          },
        }
      );
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });

  } catch (error) {
    console.error("Place Order Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to place order",
    });
  }
};


// ================= GET CUSTOMER ORDERS =================

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      customer: req.user.userId,
    })
      .populate(
        "items.product",
        "name honeyType imageUrl"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};


// ================= GET SINGLE ORDER =================

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      customer: req.user.userId,
    }).populate(
      "items.product",
      "name honeyType imageUrl"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Invalid order ID",
    });
  }
};


// ================= CANCEL ORDER =================

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      customer: req.user.userId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      order.orderStatus !== "placed" &&
      order.orderStatus !== "confirmed"
    ) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled at this stage",
      });
    }

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            quantity: item.quantity,
          },
        }
      );
    }

    order.orderStatus = "cancelled";

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
    });
  }
};


// ================= GET BEEKEEPER ORDERS =================

const getBeekeeperOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      "items.beekeeper": req.user.userId,
    })
      .populate("customer", "name email")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch beekeeper orders",
    });
  }
};


// ================= UPDATE ORDER STATUS =================

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatus = [
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      "items.beekeeper": req.user.userId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = status;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};


module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getBeekeeperOrders,
  updateOrderStatus,
};