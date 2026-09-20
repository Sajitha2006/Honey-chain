const Product = require("../models/Product");

// ================= ADD PRODUCT =================

const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      honeyType,
      price,
      quantity,
      unit,
    } = req.body;

    if (
      !name ||
      !description ||
      !price ||
      quantity === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Save uploaded image path if image exists
    const imageUrl = req.file
      ? `/uploads/products/${req.file.filename}`
      : null;

    const product = await Product.create({
      beekeeper: req.user.userId,
      name,
      description,
      honeyType,
      price,
      quantity,
      unit,
      imageUrl,
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to add product",
    });
  }
};

// ================= GET MY PRODUCTS =================

const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({
      beekeeper: req.user.userId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

// ================= GET ALL PRODUCTS =================

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isAvailable: true,
      quantity: { $gt: 0 },
    })
      .populate("beekeeper", "name email")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

// ================= GET SINGLE PRODUCT =================

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    ).populate("beekeeper", "name email");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Invalid product ID",
    });
  }
};

// ================= UPDATE PRODUCT =================

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      beekeeper: req.user.userId,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or access denied",
      });
    }

    const allowedFields = [
      "name",
      "description",
      "honeyType",
      "price",
      "quantity",
      "unit",
      "isAvailable",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    // Replace image only when a new image is uploaded
    if (req.file) {
      product.imageUrl = `/uploads/products/${req.file.filename}`;
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
};

// ================= DELETE PRODUCT =================

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      beekeeper: req.user.userId,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or access denied",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};

module.exports = {
  addProduct,
  getMyProducts,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};