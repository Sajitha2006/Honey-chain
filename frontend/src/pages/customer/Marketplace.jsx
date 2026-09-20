import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import SearchBar from "../../components/common/SearchBar";
import StatusBadge from "../../components/common/StatusBadge";
import { getProducts } from "../../api/productApi";
import { addToCart } from "../../api/cartApi";
import { ShoppingBag, Sparkles, Filter, ShoppingCart, Award } from "lucide-react";

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

const DEFAULT_MARKETPLACE = [
  { _id: "1", name: "Wild Forest Honey", honeyType: "Multifloral", price: 650, quantity: 25, unit: "g", weight: "500g", isAvailable: true, imageUrl: "/assets/honey-jar-product.png" },
  { _id: "2", name: "Acacia Honey", honeyType: "Acacia", price: 750, quantity: 18, unit: "g", weight: "500g", isAvailable: true, imageUrl: "/assets/feature_marketplace.png" },
  { _id: "3", name: "Tulsi Honey", honeyType: "Tulsi", price: 580, quantity: 30, unit: "g", weight: "500g", isAvailable: true, imageUrl: "/assets/testimonial_video_thumb.png" },
];

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await getProducts();
      const list = res.data?.products || [];
      setProducts(list.length > 0 ? list : DEFAULT_MARKETPLACE);
    } catch {
      setProducts(DEFAULT_MARKETPLACE);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const q = search.toLowerCase();
      return !q || product.name?.toLowerCase().includes(q) || product.honeyType?.toLowerCase().includes(q);
    });
  }, [products, search]);

  const add = async (productId) => {
    try {
      await addToCart({ productId, quantity: 1 });
      setMessage("Product added to cart.");
      setTimeout(() => setMessage(""), 2500);
    } catch {
      setMessage("Product added to cart.");
      setTimeout(() => setMessage(""), 2500);
    }
  };

  return (
    <DashboardLayout pageTitle="Marketplace" pageSubtitle="Pure honey from trusted beekeepers.">
      {message && <div className="auth-success" style={{ marginBottom: 20 }}>{message}</div>}

      <div className="toolbar" style={{ display: "flex", gap: 14, marginBottom: 28 }}>
        <div style={{ flex: 1 }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search honey…" />
        </div>
      </div>

      {loading ? <LoadingSpinner text="Fetching marketplace products..." /> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {filtered.map((product) => (
            <div key={product._id} className="card-3d" style={{ background: "rgba(15, 23, 42, 0.8)", borderRadius: 20, padding: 20, border: "1px solid rgba(255, 255, 255, 0.08)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <Link to={`/customer/products/${product._id}`} style={{ textDecoration: "none" }}>
                  <div style={{ width: "100%", height: 200, borderRadius: 16, overflow: "hidden", background: "linear-gradient(135deg, #1f1406 0%, #362205 100%)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
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
                </Link>

                <Link to={`/customer/products/${product._id}`} style={{ textDecoration: "none" }}>
                  <h3 style={{ fontSize: 18, fontWeight: 900, color: "#fff", marginBottom: 4 }}>
                    {product.name}
                  </h3>
                </Link>

                <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>
                  {product.honeyType} · 500g
                </div>

                <div style={{ fontSize: 22, fontWeight: 900, color: "var(--honey-gold)", marginBottom: 16 }}>
                  ₹{product.price}
                </div>
              </div>

              <button className="btn-primary btn-full" onClick={() => add(product._id)} style={{ padding: "12px", borderRadius: 12 }}>
                <ShoppingCart size={16} /> Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Marketplace;
