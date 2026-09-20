const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const diseaseRoutes = require("./routes/diseaseRoutes");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const apiaryRoutes = require("./routes/apiaryRoutes");
const hiveRoutes = require("./routes/hiveRoutes");
const sensorRoutes = require("./routes/sensorRoutes");
const healthRoutes = require("./routes/healthRoutes");
const alertRoutes = require("./routes/alertRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const traceabilityRoutes = require("./routes/traceabilityRoutes");

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Honey Chain API is running");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/apiaries", apiaryRoutes);
app.use("/api/hives", hiveRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/disease", diseaseRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/traceability", traceabilityRoutes);

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
