import { Navigate, Route, Routes } from "react-router-dom";
import { useContext } from "react";

// ==========================================
// AUTH
// ==========================================
import { AuthContext } from "../context/AuthContext";

// ==========================================
// PUBLIC PAGES
// ==========================================
import Landing from "../pages/public/Landing";
import QRScanner from "../pages/public/QRScanner";
import VerifyHoney from "../pages/public/VerifyHoney";

// ==========================================
// AUTH PAGES
// ==========================================
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// ==========================================
// BEEKEEPER PAGES
// ==========================================
import BeekeeperDashboard from "../pages/beekeeper/Dashboard";
import Apiaries from "../pages/beekeeper/Apiaries";
import Hives from "../pages/beekeeper/Hives";
import IoTMonitoring from "../pages/beekeeper/IoTMonitoring";
import HiveHealth from "../pages/beekeeper/HiveHealth";
import DiseaseDetection from "../pages/beekeeper/DiseaseDetection";
import Products from "../pages/beekeeper/Products";
import Orders from "../pages/beekeeper/Orders";
import Traceability from "../pages/beekeeper/Traceability";
import Alerts from "../pages/beekeeper/Alerts";
import BeekeeperProfile from "../pages/beekeeper/Profile";

// ==========================================
// CUSTOMER PAGES
// ==========================================
import CustomerDashboard from "../pages/customer/CustomerDashboard";
import Marketplace from "../pages/customer/Marketplace";
import ProductDetail from "../pages/customer/ProductDetail";
import Cart from "../pages/customer/Cart";
import Checkout from "../pages/customer/Checkout";
import CustomerOrders from "../pages/customer/CustomerOrders";
import CustomerProfile from "../pages/customer/CustomerProfile";

// ==========================================
// PROTECTED ROUTE
// ==========================================

const ProtectedRoute = ({ children, allowedRole }) => {
  const auth = useContext(AuthContext);

  // ------------------------------------------
  // AUTH CONTEXT SAFETY
  // ------------------------------------------

  if (!auth) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  const { user, loading } = auth;

  // ------------------------------------------
  // LOADING
  // ------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFBF0]">
        <div className="text-center">

          <div className="text-5xl mb-4">
            🐝
          </div>

          <div className="w-10 h-10 border-4 border-[#F59E0B] border-t-transparent rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-stone-600 font-medium">
            Loading Honey Chain...
          </p>

        </div>
      </div>
    );
  }

  // ------------------------------------------
  // NOT LOGGED IN
  // ------------------------------------------

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // ------------------------------------------
  // ROLE CHECK
  // ------------------------------------------

  if (
    allowedRole &&
    user.role !== allowedRole
  ) {
    if (user.role === "beekeeper") {
      return (
        <Navigate
          to="/beekeeper/dashboard"
          replace
        />
      );
    }

    if (user.role === "customer") {
      return (
        <Navigate
          to="/customer/dashboard"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
};

// ==========================================
// APP ROUTES
// ==========================================

const AppRoutes = () => {
  const auth = useContext(AuthContext);

  const user = auth?.user;

  return (
    <Routes>

      {/* ======================================
          PUBLIC ROUTES
      ====================================== */}

      <Route
        path="/"
        element={<Landing />}
      />

      <Route
        path="/qr-scanner"
        element={<QRScanner />}
      />

      <Route
        path="/verify/:batchId"
        element={<VerifyHoney />}
      />

      {/* ======================================
          AUTH ROUTES
      ====================================== */}

      <Route
        path="/login"
        element={
          user ? (
            user.role === "beekeeper" ? (
              <Navigate
                to="/beekeeper/dashboard"
                replace
              />
            ) : (
              <Navigate
                to="/customer/dashboard"
                replace
              />
            )
          ) : (
            <Login />
          )
        }
      />

      <Route
        path="/register"
        element={
          user ? (
            user.role === "beekeeper" ? (
              <Navigate
                to="/beekeeper/dashboard"
                replace
              />
            ) : (
              <Navigate
                to="/customer/dashboard"
                replace
              />
            )
          ) : (
            <Register />
          )
        }
      />

      {/* ======================================
          BEEKEEPER
      ====================================== */}

      <Route
        path="/beekeeper/dashboard"
        element={
          <ProtectedRoute allowedRole="beekeeper">
            <BeekeeperDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/beekeeper/apiaries"
        element={
          <ProtectedRoute allowedRole="beekeeper">
            <Apiaries />
          </ProtectedRoute>
        }
      />

      <Route
        path="/beekeeper/hives"
        element={
          <ProtectedRoute allowedRole="beekeeper">
            <Hives />
          </ProtectedRoute>
        }
      />

      <Route
        path="/beekeeper/iot"
        element={
          <ProtectedRoute allowedRole="beekeeper">
            <IoTMonitoring />
          </ProtectedRoute>
        }
      />

      <Route
        path="/beekeeper/health"
        element={
          <ProtectedRoute allowedRole="beekeeper">
            <HiveHealth />
          </ProtectedRoute>
        }
      />

      <Route
        path="/beekeeper/disease"
        element={
          <ProtectedRoute allowedRole="beekeeper">
            <DiseaseDetection />
          </ProtectedRoute>
        }
      />

      <Route
        path="/beekeeper/products"
        element={
          <ProtectedRoute allowedRole="beekeeper">
            <Products />
          </ProtectedRoute>
        }
      />

      <Route
        path="/beekeeper/orders"
        element={
          <ProtectedRoute allowedRole="beekeeper">
            <Orders />
          </ProtectedRoute>
        }
      />

      <Route
        path="/beekeeper/traceability"
        element={
          <ProtectedRoute allowedRole="beekeeper">
            <Traceability />
          </ProtectedRoute>
        }
      />

      <Route
        path="/beekeeper/alerts"
        element={
          <ProtectedRoute allowedRole="beekeeper">
            <Alerts />
          </ProtectedRoute>
        }
      />

      <Route
        path="/beekeeper/profile"
        element={
          <ProtectedRoute allowedRole="beekeeper">
            <BeekeeperProfile />
          </ProtectedRoute>
        }
      />

      {/* ======================================
          CUSTOMER
      ====================================== */}

      <Route
        path="/customer/dashboard"
        element={
          <ProtectedRoute allowedRole="customer">
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/products"
        element={
          <ProtectedRoute allowedRole="customer">
            <Marketplace />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/products/:id"
        element={
          <ProtectedRoute allowedRole="customer">
            <ProductDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/cart"
        element={
          <ProtectedRoute allowedRole="customer">
            <Cart />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/checkout"
        element={
          <ProtectedRoute allowedRole="customer">
            <Checkout />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/orders"
        element={
          <ProtectedRoute allowedRole="customer">
            <CustomerOrders />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/profile"
        element={
          <ProtectedRoute allowedRole="customer">
            <CustomerProfile />
          </ProtectedRoute>
        }
      />

      {/* ======================================
          UNKNOWN ROUTE
      ====================================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
};

export default AppRoutes;