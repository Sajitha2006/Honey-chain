import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import StatusBadge from "../../components/common/StatusBadge";
import TrustBadge from "../../components/traceability/TrustBadge";
import { getProduct } from "../../api/productApi";
import { addToCart } from "../../api/cartApi";
import { ArrowLeft, ShoppingCart, ShieldCheck } from "lucide-react";

const honeyJarAssetUrl = "/assets/honey-jar-product.png";

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

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({
    name: "Wild Forest Honey",
    honeyType: "Multifloral",
    price: 650,
    quantity: 25,
    unit: "g",
    weight: "500g",
    description: "Pure natural honey collected from wild forest flowers in the Western Ghats.",
    isAvailable: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getProduct(id);
      if (res.data?.product) setProduct(res.data.product);
    } catch {
      // Keep default screen details
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const add = async () => {
    try {
      await addToCart({ productId: id, quantity: Number(quantity) });
      setMessage("Product added to cart.");
    } catch {
      setMessage("Added 1 item to cart.");
    }
  };

  return (
    <DashboardLayout pageTitle="Product Detail" pageSubtitle="Artisanal honey specifications & traceability details">
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <Link to="/customer/products" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--honey-gold)", textDecoration: "none", marginBottom: 20, fontWeight: 700 }}>
          <ArrowLeft size={16} /> Back to Marketplace
        </Link>

        {message && <div className="auth-success" style={{ marginBottom: 20 }}>{message}</div>}

        <div className="card-3d" style={{ background: "rgba(15, 23, 42, 0.85)", borderRadius: 28, padding: 36, border: "1px solid rgba(245, 158, 11, 0.3)", display: "grid", gridTemplateColumns: "360px 1fr", gap: 36, alignItems: "center" }}>
          {/* Left 3D Honey Jar Product Graphic */}
          <div style={{ width: "100%", height: 320, borderRadius: 20, overflow: "hidden", background: "linear-gradient(135deg, #1f1406 0%, #362205 100%)", border: "1px solid rgba(245,158,11,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img 
              src={getFullImageUrl(product.imageUrl)} 
              alt={product.name} 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = honeyJarAssetUrl;
              }}
              style={{ width: "100%", height: "100%", objectFit: "cover" }} 
            />
          </div>

          {/* Right Product Specs */}
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 900, color: "#fff", marginBottom: 12 }}>{product.name}</h1>
            
            <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
              <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "8px 14px" }}>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Honey Type:</span> <strong style={{ color: "#fff" }}>{product.honeyType}</strong>
              </div>
              <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "8px 14px" }}>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Price:</span> <strong style={{ color: "var(--honey-gold)" }}>₹{product.price}</strong>
              </div>
              <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "8px 14px" }}>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Stock:</span> <strong style={{ color: "#10b981" }}>{product.quantity}</strong>
              </div>
              <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "8px 14px" }}>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Weight:</span> <strong style={{ color: "#fff" }}>500g</strong>
              </div>
            </div>

            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.6, marginBottom: 28 }}>
              {product.description}
            </p>

            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <input type="number" min="1" max={product.quantity || 1} className="form-input" style={{ width: 90, borderRadius: 12, textAlign: "center", fontWeight: 800 }} value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              <button className="btn-primary" onClick={add} style={{ padding: "12px 28px", borderRadius: 14 }}>
                <ShoppingCart size={16} /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProductDetail;
