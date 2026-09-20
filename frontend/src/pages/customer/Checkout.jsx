import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { createOrder } from "../../api/orderApi";
import { Truck, ShieldCheck, CheckCircle2 } from "lucide-react";

const Checkout = () => {
  const [shippingAddress, setShippingAddress] = useState({
    name: "JAGADEESH P",
    phone: "+91 9876543210",
    address: "123, Green Valley",
    city: "Coimbatore",
    pincode: "641001"
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await createOrder({ shippingAddress, paymentMethod: "COD" });
      navigate("/customer/orders");
    } catch {
      navigate("/customer/orders");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout pageTitle="Checkout" pageSubtitle="Complete your order.">
      <div className="page-header-row" style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: "#ffffff", margin: 0 }}>Checkout</h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", margin: "4px 0 0" }}>Complete your order.</p>
      </div>

      {/* Progress Bar matching Picture 13 */}
      <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
        <span style={{ padding: "6px 16px", borderRadius: 99, background: "#f59e0b", color: "#000", fontSize: 12, fontWeight: 800 }}>Shipping</span>
        <span style={{ padding: "6px 16px", borderRadius: 99, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 700 }}>Order Summary</span>
        <span style={{ padding: "6px 16px", borderRadius: 99, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 700 }}>Payment</span>
        <span style={{ padding: "6px 16px", borderRadius: 99, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 700 }}>Confirm</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 28, alignItems: "start" }}>
        {/* Left Shipping Address Form */}
        <div className="card-3d" style={{ background: "rgba(15, 23, 42, 0.8)", borderRadius: 20, padding: 28, border: "1px solid rgba(255, 255, 255, 0.08)" }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: "#ffffff", marginBottom: 20 }}>Shipping Address</h3>

          <form onSubmit={submit}>
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">Full Name</label>
              <input className="form-input" value={shippingAddress.name} onChange={(e) => setShippingAddress((p) => ({ ...p, name: e.target.value }))} required />
            </div>

            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">Phone</label>
              <input className="form-input" value={shippingAddress.phone} onChange={(e) => setShippingAddress((p) => ({ ...p, phone: e.target.value }))} required />
            </div>

            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">Address</label>
              <input className="form-input" value={shippingAddress.address} onChange={(e) => setShippingAddress((p) => ({ ...p, address: e.target.value }))} required />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
              <div className="form-group">
                <label className="form-label">City</label>
                <input className="form-input" value={shippingAddress.city} onChange={(e) => setShippingAddress((p) => ({ ...p, city: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">PIN Code</label>
                <input className="form-input" value={shippingAddress.pincode} onChange={(e) => setShippingAddress((p) => ({ ...p, pincode: e.target.value }))} required />
              </div>
            </div>

            <button className="btn-primary btn-full" disabled={saving} style={{ padding: "14px", borderRadius: 12 }}>
              {saving ? "Processing…" : "Continue to Payment →"}
            </button>
          </form>
        </div>

        {/* Right Summary */}
        <div className="card-3d" style={{ background: "rgba(15, 23, 42, 0.85)", borderRadius: 20, padding: 24, border: "1px solid rgba(245, 158, 11, 0.3)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "#ffffff", marginBottom: 20 }}>Order Summary</h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "rgba(255,255,255,0.8)" }}>
              <span>Wild Forest Honey x 2</span>
              <strong>₹1,300</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "rgba(255,255,255,0.8)" }}>
              <span>Acacia Honey x 1</span>
              <strong>₹750</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "rgba(255,255,255,0.8)" }}>
              <span>Tulsi Honey x 1</span>
              <strong>₹690</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
              <span>Shipping</span>
              <strong style={{ color: "#10b981" }}>FREE</strong>
            </div>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 16, display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 900, color: "#f59e0b" }}>
            <span>Total</span>
            <span>₹2,740</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Checkout;
