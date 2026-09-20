const Cart = require("../models/Cart");
const Product = require("../models/Product");


// ================= ADD TO CART =================

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await Product.findOne({
      _id: productId,
      isAvailable: true,
      quantity: { $gt: 0 },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not available",
      });
    }

    const requestedQuantity = quantity || 1;

    if (requestedQuantity > product.quantity) {
      return res.status(400).json({
        success: false,
        message: "Requested quantity exceeds available stock",
      });
    }

    let cart = await Cart.findOne({
      customer: req.user.userId,
    });

    if (!cart) {
      cart = await Cart.create({
        customer: req.user.userId,
        items: [
          {
            product: productId,
            quantity: requestedQuantity,
          },
        ],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );

      if (existingItem) {
        const newQuantity =
          existingItem.quantity + requestedQuantity;

        if (newQuantity > product.quantity) {
          return res.status(400).json({
            success: false,
            message: "Total quantity exceeds available stock",
          });
        }

        existingItem.quantity = newQuantity;
      } else {
        cart.items.push({
          product: productId,
          quantity: requestedQuantity,
        });
      }

      await cart.save();
    }

    await cart.populate(
      "items.product",
      "name price quantity honeyType imageUrl"
    );

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to add product to cart",
    });
  }
};


// ================= GET MY CART =================

const getMyCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      customer: req.user.userId,
    }).populate(
      "items.product",
      "name price quantity honeyType imageUrl"
    );

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        items: [],
      });
    }

    const cartItems = cart.items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      subtotal:
        item.product.price * item.quantity,
    }));

    const totalAmount = cartItems.reduce(
      (total, item) => total + item.subtotal,
      0
    );

    res.status(200).json({
      success: true,
      count: cartItems.length,
      items: cartItems,
      totalAmount,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
    });
  }
};


// ================= UPDATE CART ITEM =================

const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Valid quantity is required",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (quantity > product.quantity) {
      return res.status(400).json({
        success: false,
        message: "Quantity exceeds available stock",
      });
    }

    const cart = await Cart.findOne({
      customer: req.user.userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const cartItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    cartItem.quantity = quantity;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update cart",
    });
  }
};


// ================= REMOVE FROM CART =================

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({
      customer: req.user.userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const initialLength = cart.items.length;

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    if (cart.items.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to remove product from cart",
    });
  }
};


// ================= CLEAR CART =================

const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      customer: req.user.userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = [];

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
    });
  }
};


module.exports = {
  addToCart,
  getMyCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};