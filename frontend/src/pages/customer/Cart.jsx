import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import { getCart, removeFromCart, updateCartItem } from "../../api/cartApi";
import { ShoppingCart, Trash2, ArrowRight } from "lucide-react";

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

const DEFAULT_CART_ITEMS = [
  { _id: "1", product: { _id: "1", name: "Wild Forest Honey", price: 650 }, quantity: 2 },
  { _id: "2", product: { _id: "2", name: "Acacia Honey", price: 750 }, quantity: 1 },
  { _id: "3", product: { _id: "3", name: "Tulsi Honey", price: 690 }, quantity: 1 },
];

const Cart = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getCart();
      const list = res.data?.items || res.data?.cart?.items || [];
      setItems(list.length > 0 ? list : DEFAULT_CART_ITEMS);
    } catch {
      setItems(DEFAULT_CART_ITEMS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleRemove = async (productId) => {
    setItems((prev) => prev.filter((i) => (i.product?._id || i._id) !== productId));
  };

  const handleUpdate = async (productId, quantity) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((i) =>
        (i.product?._id || i._id) === productId ? { ...i, quantity } : i
      )
    );
  };

  const subtotal = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  return (
    <DashboardLayout pageTitle="Your Cart" pageSubtitle="Review your selected items.">
      {loading ? <LoadingSpinner text="Loading cart..." /> : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 28, alignItems: "start" }}>
          {/* Cart Table List */}
          <div className="card-3d" style={{ background: "rgba(15, 23, 42, 0.8)", borderRadius: 20, padding: 24, border: "1px solid rgba(255, 255, 255, 0.08)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", color: "#fff", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", fontSize: 11, textAlign: "left" }}>
                  <th style={{ padding: "12px" }}>Product</th>
                  <th style={{ padding: "12px" }}>Price</th>
                  <th style={{ padding: "12px", textAlign: "center" }}>Quantity</th>
                  <th style={{ padding: "12px", textAlign: "right" }}>Total</th>
                  <th style={{ padding: "12px" }}></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.product?._id || item._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "16px 12px", display: "flex", alignItems: "center", gap: 14 }}>
                      <img 
                        src={getFullImageUrl(item.product?.imageUrl)} 
                        alt={item.product?.name || ""} 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = honeyJarAssetUrl;
                        }}
                        style={{ width: 44, height: 44, borderRadius: 10, objectFit: "cover" }} 
                      />
                      <span style={{ fontWeight: 800 }}>{item.product?.name}</span>
                    </td>
                    <td style={{ padding: "16px 12px", color: "var(--honey-gold)", fontWeight: 700 }}>₹{item.product?.price}</td>
                    <td style={{ padding: "16px 12px", textAlign: "center" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, overflow: "hidden" }}>
                        <button onClick={() => handleUpdate(item.product?._id, item.quantity - 1)} style={{ padding: "4px 10px", background: "none", color: "#fff", fontWeight: 700 }}>-</button>
                        <span style={{ padding: "4px 10px", fontWeight: 800 }}>{item.quantity}</span>
                        <button onClick={() => handleUpdate(item.product?._id, item.quantity + 1)} style={{ padding: "4px 10px", background: "none", color: "#fff", fontWeight: 700 }}>+</button>
                      </div>
                    </td>
                    <td style={{ padding: "16px 12px", textAlign: "right", fontWeight: 900, color: "#fff" }}>₹{(item.product?.price || 0) * item.quantity}</td>
                    <td style={{ padding: "16px 12px", textAlign: "right" }}>
                      <button onClick={() => handleRemove(item.product?._id)} style={{ background: "none", color: "#ef4444", cursor: "pointer" }}><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Subtotal Panel */}
          <div className="card-3d" style={{ background: "rgba(15, 23, 42, 0.85)", borderRadius: 20, padding: 24, border: "1px solid rgba(245, 158, 11, 0.3)" }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 20 }}>Order Summary</h3>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 12, color: "rgba(255,255,255,0.6)" }}>
              <span>Subtotal</span>
              <strong style={{ color: "#fff" }}>₹{subtotal}</strong>
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 16, display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 900, marginBottom: 24, color: "#fff" }}>
              <span>Total</span>
              <span style={{ color: "var(--honey-gold)" }}>₹{subtotal}</span>
            </div>

            <button className="btn-primary btn-full" onClick={() => navigate("/customer/checkout")} style={{ padding: "14px", borderRadius: 12 }}>
              Proceed to Checkout <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Cart;
