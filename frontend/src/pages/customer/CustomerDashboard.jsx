import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import { AuthContext } from "../../context/AuthContext";
import { getCart } from "../../api/cartApi";
import { getMyOrders } from "../../api/orderApi";
import { getProducts } from "../../api/productApi";
import { ShoppingBag, QrCode, Package, Award, ArrowRight, ShieldCheck, ShoppingCart, Truck, Sparkles, CheckCircle2 } from "lucide-react";

const honeyJarAssetUrl = "/assets/honey-jar-product.png";
const marketplaceAssetUrl = "/assets/feature_marketplace.png";
const qrAssetUrl = "/assets/feature_qr_traceability.png";
const traceabilityAssetUrl = "/assets/feature_smart_hive_monitoring.png";

const getFullImageUrl = (url) => {
  if (!url) return honeyJarAssetUrl;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("blob:")) return url;
  if (url.startsWith("assets/") || url.startsWith("/assets/")) {
    return url.startsWith("/") ? url : `/${url}`;
  }
  if (url.startsWith("uploads/") || url.startsWith("/uploads/")) {
    return `http://localhost:5000/${url.replace(/^\//, "")}`;
  }
  return url.startsWith("/") ? url : `/${url}`;
};

const FEATURED_PRODUCTS = [
  { _id: "1", name: "Wild Forest Honey", honeyType: "Multifloral", price: 650, weight: "500g", imageUrl: "/assets/honey-jar-product.png" },
  { _id: "2", name: "Acacia Honey", honeyType: "Single Origin", price: 750, weight: "500g", imageUrl: "/assets/feature_marketplace.png" },
  { _id: "3", name: "Tulsi Honey", honeyType: "Organic Infused", price: 580, weight: "500g", imageUrl: "/assets/honey-jar-qr.png" },
];

const CustomerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [featured, setFeatured] = useState(FEATURED_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [cartRes, orderRes, prodRes] = await Promise.allSettled([
        getCart(), 
        getMyOrders(),
        getProducts()
      ]);
      if (cartRes.status === "fulfilled") setCartItems(cartRes.value.data?.items || []);
      if (orderRes.status === "fulfilled") setOrders(orderRes.value.data?.orders || []);
      if (prodRes.status === "fulfilled" && Array.isArray(prodRes.value.data?.products) && prodRes.value.data.products.length > 0) {
        setFeatured(prodRes.value.data.products.slice(0, 3));
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const delivered = orders.filter((order) => order.orderStatus === "delivered" || order.orderStatus === "shipped").length;

  return (
    <DashboardLayout pageTitle="Customer Dashboard" pageSubtitle={`Welcome back, ${user?.name || "Customer"} 👋`}>
      {loading ? (
        <LoadingSpinner text="Loading customer portal..." />
      ) : error ? (
        <ErrorState onRetry={load} description={error} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {/* 3D HERO GLASS BANNER */}
          <div 
            className="card-3d" 
            style={{ 
              background: "linear-gradient(135deg, rgba(20, 16, 10, 0.95) 0%, rgba(38, 26, 8, 0.85) 100%)", 
              borderRadius: 28, 
              padding: "36px 40px", 
              border: "1px solid rgba(245, 158, 11, 0.35)", 
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)",
              display: "grid",
              gridTemplateColumns: "1fr 280px",
              gap: 32,
              alignItems: "center"
            }}
          >
            <div style={{ zIndex: 2 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 99, background: "rgba(245, 158, 11, 0.15)", border: "1px solid rgba(245, 158, 11, 0.35)", color: "#f59e0b", fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>
                <Award size={15} /> 100% Certified Organic Marketplace
              </div>
              <h1 style={{ fontSize: 34, fontWeight: 900, color: "#ffffff", margin: "0 0 12px 0", letterSpacing: "-0.5px" }}>
                Welcome back, <span style={{ color: "#f59e0b" }}>{user?.name || "Valued Customer"}</span> 👋
              </h1>
              <p style={{ fontSize: 14.5, color: "rgba(255, 255, 255, 0.8)", maxWidth: 580, lineHeight: 1.65, margin: "0 0 24px 0" }}>
                Shop pure, unadulterated honey directly from certified local beekeepers. Scan QR codes on your honey jars to inspect the complete 3D supply chain certificate.
              </p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <Link 
                  to="/customer/products" 
                  className="btn-primary" 
                  style={{ padding: "12px 26px", borderRadius: 14, background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", boxShadow: "0 4px 20px rgba(245, 158, 11, 0.4)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}
                >
                  <ShoppingBag size={17} /> Explore Marketplace
                </Link>
                <Link 
                  to="/qr-scanner" 
                  className="btn-outline" 
                  style={{ padding: "12px 24px", borderRadius: 14, borderColor: "rgba(245, 158, 11, 0.4)", color: "#f59e0b", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}
                >
                  <QrCode size={17} /> Scan Honey QR Code
                </Link>
              </div>
            </div>

            {/* Floating 3D Honey Jar Asset Banner Image */}
            <div style={{ width: "100%", height: 210, borderRadius: 20, overflow: "hidden", background: "linear-gradient(135deg, #1f1406 0%, #362205 100%)", border: "1px solid rgba(245, 158, 11, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 30px rgba(245, 158, 11, 0.2)" }}>
              <img 
                src={honeyJarAssetUrl} 
                alt="3D Honey Jar" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = honeyJarAssetUrl;
                }}
                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
              />
            </div>
          </div>

          {/* 3D STAT CARDS GRID */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            <div className="card-3d" style={{ background: "rgba(15, 23, 42, 0.85)", borderRadius: 20, padding: 22, border: "1px solid rgba(255, 255, 255, 0.08)", display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(245, 158, 11, 0.15)", border: "1px solid rgba(245, 158, 11, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#f59e0b" }}>
                <Package size={24} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 1 }}>Total Orders</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: "#ffffff", marginTop: 2 }}>{orders.length}</div>
              </div>
            </div>

            <div className="card-3d" style={{ background: "rgba(15, 23, 42, 0.85)", borderRadius: 20, padding: 22, border: "1px solid rgba(255, 255, 255, 0.08)", display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981" }}>
                <Truck size={24} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 1 }}>Delivered / Shipped</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: "#10b981", marginTop: 2 }}>{delivered}</div>
              </div>
            </div>

            <div className="card-3d" style={{ background: "rgba(15, 23, 42, 0.85)", borderRadius: 20, padding: 22, border: "1px solid rgba(255, 255, 255, 0.08)", display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(245, 158, 11, 0.15)", border: "1px solid rgba(245, 158, 11, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#f59e0b" }}>
                <ShoppingCart size={24} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 1 }}>Cart Items</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: "#f59e0b", marginTop: 2 }}>{cartItems.length}</div>
              </div>
            </div>

            <div className="card-3d" style={{ background: "rgba(15, 23, 42, 0.85)", borderRadius: 20, padding: 22, border: "1px solid rgba(16, 185, 129, 0.3)", display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981" }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 1 }}>Authenticity</div>
                <div style={{ fontSize: 15, fontWeight: 900, color: "#10b981", marginTop: 4 }}>✓ 100% Certified Pure</div>
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS WITH 3D THUMBNAILS */}
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: "#ffffff", marginBottom: 16 }}>Quick Actions</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
              <Link 
                to="/customer/products" 
                className="card-3d" 
                style={{ 
                  background: "rgba(15, 23, 42, 0.85)", 
                  borderRadius: 20, 
                  padding: 20, 
                  border: "1px solid rgba(245, 158, 11, 0.25)", 
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "column",
                  justify: "space-between"
                }}
              >
                <div>
                  <div style={{ width: "100%", height: 160, borderRadius: 14, overflow: "hidden", background: "linear-gradient(135deg, #1f1406 0%, #362205 100%)", marginBottom: 16, border: "1px solid rgba(245, 158, 11, 0.2)" }}>
                    <img 
                      src={marketplaceAssetUrl} 
                      alt="Shop Honey" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = honeyJarAssetUrl;
                      }}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 900, color: "#ffffff", marginBottom: 6 }}>Shop Artisanal Honey</h3>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", margin: 0, lineHeight: 1.5 }}>
                    Browse 100% verified pure honey varieties directly from sustainable local beekeepers.
                  </p>
                </div>
                <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 6, color: "#f59e0b", fontSize: 13, fontWeight: 800 }}>
                  Browse Products <ArrowRight size={15} />
                </div>
              </Link>

              <Link 
                to="/qr-scanner" 
                className="card-3d" 
                style={{ 
                  background: "rgba(15, 23, 42, 0.85)", 
                  borderRadius: 20, 
                  padding: 20, 
                  border: "1px solid rgba(16, 185, 129, 0.25)", 
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "column",
                  justify: "space-between"
                }}
              >
                <div>
                  <div style={{ width: "100%", height: 160, borderRadius: 14, overflow: "hidden", background: "linear-gradient(135deg, #05120c 0%, #0c2619 100%)", marginBottom: 16, border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                    <img 
                      src={qrAssetUrl} 
                      alt="Scan QR Code" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = honeyJarAssetUrl;
                      }}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 900, color: "#ffffff", marginBottom: 6 }}>Scan Jar QR Code</h3>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", margin: 0, lineHeight: 1.5 }}>
                    Verify honey batch origin, harvest date, and hive health history instantly via camera.
                  </p>
                </div>
                <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 6, color: "#10b981", fontSize: 13, fontWeight: 800 }}>
                  Scan Jar Code <ArrowRight size={15} />
                </div>
              </Link>

              <Link 
                to="/customer/orders" 
                className="card-3d" 
                style={{ 
                  background: "rgba(15, 23, 42, 0.85)", 
                  borderRadius: 20, 
                  padding: 20, 
                  border: "1px solid rgba(255, 255, 255, 0.1)", 
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "column",
                  justify: "space-between"
                }}
              >
                <div>
                  <div style={{ width: "100%", height: 160, borderRadius: 14, overflow: "hidden", background: "linear-gradient(135deg, #111827 0%, #1f2937 100%)", marginBottom: 16, border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                    <img 
                      src={traceabilityAssetUrl} 
                      alt="Track Orders" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = honeyJarAssetUrl;
                      }}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 900, color: "#ffffff", marginBottom: 6 }}>Track My Orders</h3>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", margin: 0, lineHeight: 1.5 }}>
                    Monitor real-time shipment updates from apiary harvest to doorstep delivery.
                  </p>
                </div>
                <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 6, color: "#ffffff", fontSize: 13, fontWeight: 800 }}>
                  View Orders <ArrowRight size={15} />
                </div>
              </Link>
            </div>
          </div>

          {/* FEATURED MARKETPLACE SELECTION */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: "#ffffff", margin: 0 }}>Featured Pure Honey</h2>
              <Link to="/customer/products" style={{ color: "#f59e0b", fontSize: 13, fontWeight: 800, textDecoration: "none" }}>
                View All →
              </Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
              {featured.map((p) => (
                <div 
                  key={p._id} 
                  className="card-3d" 
                  style={{ 
                    background: "rgba(18, 14, 10, 0.85)", 
                    borderRadius: 20, 
                    padding: 20, 
                    border: "1px solid rgba(245, 158, 11, 0.25)",
                    display: "flex",
                    flexDirection: "column",
                    justify: "space-between"
                  }}
                >
                  <div>
                    <div style={{ width: "100%", height: 170, borderRadius: 14, overflow: "hidden", background: "linear-gradient(135deg, #1f1406 0%, #362205 100%)", marginBottom: 14, border: "1px solid rgba(245, 158, 11, 0.2)" }}>
                      <img 
                        src={getFullImageUrl(p.imageUrl)} 
                        alt={p.name} 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = honeyJarAssetUrl;
                        }}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                      />
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 700, marginBottom: 4 }}>
                      {p.honeyType || "Multifloral"} · {p.weight || "500g"}
                    </div>
                    <h3 style={{ fontSize: 17, fontWeight: 900, color: "#ffffff", margin: "0 0 10px 0" }}>{p.name}</h3>
                    <div style={{ fontSize: 22, fontWeight: 900, color: "#f59e0b", marginBottom: 14 }}>
                      ₹{p.price}
                    </div>
                  </div>

                  <Link 
                    to={`/customer/products/${p._id}`} 
                    className="btn-primary" 
                    style={{ textAlign: "center", textDecoration: "none", padding: "10px", borderRadius: 12, display: "block" }}
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CustomerDashboard;
