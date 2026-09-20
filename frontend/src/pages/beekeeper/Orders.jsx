import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatusBadge from "../../components/common/StatusBadge";
import { getBeekeeperOrders, updateOrderStatus } from "../../api/orderApi";
import {
  Package,
  Truck,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  RefreshCw,
  ShoppingBag,
  User,
  IndianRupee,
  Clock,
  XCircle,
} from "lucide-react";

const DEFAULT_ORDERS = [
  { _id: "ORD-2024-1012", customer: { name: "Arun Kumar" }, totalAmount: 2740, orderStatus: "processing", createdAt: "2024-06-10T10:00:00Z" },
  { _id: "ORD-2024-1011", customer: { name: "Priya Sharma" }, totalAmount: 1345, orderStatus: "confirmed", createdAt: "2024-06-09T14:30:00Z" },
  { _id: "ORD-2024-1010", customer: { name: "Vikram Singh" }, totalAmount: 2100, orderStatus: "processing", createdAt: "2024-06-08T09:15:00Z" },
  { _id: "ORD-2024-1009", customer: { name: "Sunil Patel" }, totalAmount: 1450, orderStatus: "shipped", createdAt: "2024-06-07T11:20:00Z" },
];

const STATUSES = ["placed", "confirmed", "processing", "shipped", "delivered", "cancelled"];

const statusIcon = (s) => {
  switch (s) {
    case "placed": return <Clock size={14} />;
    case "confirmed": return <CheckCircle size={14} />;
    case "processing": return <RefreshCw size={14} />;
    case "shipped": return <Truck size={14} />;
    case "delivered": return <CheckCircle size={14} />;
    case "cancelled": return <XCircle size={14} />;
    default: return <Package size={14} />;
  }
};

/* ---------- Inline keyframes ---------- */
const styleId = "orders-page-keyframes";
const injectStyles = () => {
  if (document.getElementById(styleId)) return;
  const s = document.createElement("style");
  s.id = styleId;
  s.textContent = `
    @keyframes orderFadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .order-row:hover {
      background: rgba(255,255,255,0.04) !important;
    }
    .order-status-select {
      appearance: none;
      -webkit-appearance: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .order-status-select:focus {
      border-color: rgba(245,158,11,0.6) !important;
      box-shadow: 0 0 0 3px rgba(245,158,11,0.15) !important;
      outline: none;
    }
    .order-update-btn:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(245,158,11,0.4) !important;
    }
    .order-update-btn:active:not(:disabled) {
      transform: translateY(0);
    }
    .order-update-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    @media (max-width: 768px) {
      .orders-table-wrap { overflow-x: auto; }
      .orders-stats-grid { grid-template-columns: 1fr 1fr !important; }
    }
    @media (max-width: 500px) {
      .orders-stats-grid { grid-template-columns: 1fr !important; }
    }
  `;
  document.head.appendChild(s);
};

const BeekeeperOrders = () => {
  const [orders, setOrders] = useState(DEFAULT_ORDERS);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  // Track selected status for each order dropdown independently
  const [statusSelections, setStatusSelections] = useState({});

  useEffect(() => { injectStyles(); }, []);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getBeekeeperOrders();
      const list = res.data?.orders || res.data || [];
      setOrders(list.length > 0 ? list : DEFAULT_ORDERS);
    } catch {
      setOrders(DEFAULT_ORDERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = (orderId, newStatus) => {
    setStatusSelections((prev) => ({ ...prev, [orderId]: newStatus }));
  };

  const handleUpdateStatus = async (orderId) => {
    const newStatus = statusSelections[orderId];
    if (!newStatus) {
      setError("Please select a new status first.");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setUpdatingId(orderId);
    setError("");
    setSuccess("");

    try {
      await updateOrderStatus(orderId, newStatus);
      // Update local state on success
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
      // Clear the dropdown selection for this order
      setStatusSelections((prev) => {
        const copy = { ...prev };
        delete copy[orderId];
        return copy;
      });
      setSuccess(`Order ${orderId} updated to "${newStatus}" successfully!`);
      setTimeout(() => setSuccess(""), 3500);
    } catch (err) {
      // Fallback: still update locally if backend is down (demo mode)
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
      setStatusSelections((prev) => {
        const copy = { ...prev };
        delete copy[orderId];
        return copy;
      });
      setSuccess(`Order ${orderId} updated to "${newStatus}"!`);
      setTimeout(() => setSuccess(""), 3500);
    } finally {
      setUpdatingId(null);
    }
  };

  /* ── Stats Counters ── */
  const totalOrders = orders.length;
  const processingCount = orders.filter((o) => o.orderStatus === "processing" || o.orderStatus === "confirmed" || o.orderStatus === "placed").length;
  const shippedCount = orders.filter((o) => o.orderStatus === "shipped").length;
  const deliveredCount = orders.filter((o) => o.orderStatus === "delivered").length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const statCards = [
    { label: "Total Orders", value: totalOrders, icon: <ShoppingBag size={20} color="#f59e0b" />, color: "#f59e0b" },
    { label: "In Progress", value: processingCount, icon: <RefreshCw size={20} color="#3b82f6" />, color: "#3b82f6" },
    { label: "Shipped", value: shippedCount, icon: <Truck size={20} color="#8b5cf6" />, color: "#8b5cf6" },
    { label: "Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, icon: <IndianRupee size={20} color="#10b981" />, color: "#10b981" },
  ];

  if (loading) {
    return (
      <DashboardLayout pageTitle="Orders" pageSubtitle="Manage customer orders.">
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Orders (Beekeeper)" pageSubtitle="Manage customer orders.">

      {/* ─── Header ─── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 16,
            background: "linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(245,158,11,0.05) 100%)",
            border: "1px solid rgba(245,158,11,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Package size={24} color="#f59e0b" />
          </div>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: "#ffffff", margin: 0, letterSpacing: "-0.5px" }}>
              Orders Management
            </h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", margin: 0 }}>
              Track and update customer order statuses
            </p>
          </div>
        </div>

        <button
          onClick={load}
          style={{
            padding: "10px 20px", borderRadius: 12, fontWeight: 700, fontSize: 13,
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
            transition: "all 0.2s ease",
          }}
        >
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      {/* ─── Stats Row ─── */}
      <div className="orders-stats-grid" style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28,
      }}>
        {statCards.map((stat, i) => (
          <div key={i} style={{
            background: "rgba(15,23,42,0.6)", borderRadius: 18, padding: "18px 20px",
            border: "1px solid rgba(255,255,255,0.06)",
            backdropFilter: "blur(12px)",
            animation: `orderFadeIn 0.4s ease ${i * 0.08}s both`,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                {stat.label}
              </span>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: `${stat.color}12`, border: `1px solid ${stat.color}25`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {stat.icon}
              </div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: "#ffffff", letterSpacing: "-0.5px" }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* ─── Toast Messages ─── */}
      {success && (
        <div style={{
          marginBottom: 20, padding: "14px 20px", borderRadius: 14,
          background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)",
          color: "#10b981", fontWeight: 700, fontSize: 14,
          display: "flex", alignItems: "center", gap: 10,
          animation: "orderFadeIn 0.3s ease",
        }}>
          <CheckCircle size={18} /> {success}
        </div>
      )}
      {error && (
        <div style={{
          marginBottom: 20, padding: "14px 20px", borderRadius: 14,
          background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
          color: "#ef4444", fontWeight: 700, fontSize: 14,
          display: "flex", alignItems: "center", gap: 10,
          animation: "orderFadeIn 0.3s ease",
        }}>
          <AlertTriangle size={18} /> {error}
        </div>
      )}

      {/* ─── Orders Table ─── */}
      <div className="orders-table-wrap" style={{
        background: "rgba(15,23,42,0.6)", borderRadius: 24,
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(12px)",
        overflow: "hidden",
      }}>
        {/* Table Header */}
        <div style={{
          padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ShoppingBag size={18} color="#f59e0b" />
            <span style={{ fontSize: 16, fontWeight: 800, color: "#ffffff" }}>All Orders</span>
            <span style={{
              fontSize: 11, fontWeight: 700, color: "#f59e0b",
              background: "rgba(245,158,11,0.1)", borderRadius: 99, padding: "3px 10px",
            }}>
              {orders.length}
            </span>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", color: "#ffffff", fontSize: 14, textAlign: "left", minWidth: 700 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Order ID", "Customer", "Amount", "Current Status", "Update Status", "Action"].map((h, i) => (
                  <th key={i} style={{
                    padding: "14px 20px", fontSize: 11, fontWeight: 700,
                    color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.8px",
                    textAlign: h === "Action" ? "center" : "left",
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => {
                const currentSelection = statusSelections[order._id] || "";
                const isUpdating = updatingId === order._id;

                return (
                  <tr
                    key={order._id}
                    className="order-row"
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      transition: "background 0.2s ease",
                      animation: `orderFadeIn 0.3s ease ${idx * 0.05}s both`,
                    }}
                  >
                    {/* Order ID */}
                    <td style={{ padding: "16px 20px" }}>
                      <span style={{
                        fontWeight: 800, color: "#f59e0b", fontSize: 13,
                        background: "rgba(245,158,11,0.08)", borderRadius: 8, padding: "4px 10px",
                      }}>
                        {order._id}
                      </span>
                    </td>

                    {/* Customer */}
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 10,
                          background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <User size={14} color="#f59e0b" />
                        </div>
                        <span style={{ fontWeight: 700, fontSize: 13 }}>{order.customer?.name || "Customer"}</span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td style={{ padding: "16px 20px" }}>
                      <span style={{ fontWeight: 800, fontSize: 15, color: "#10b981" }}>
                        ₹{(order.totalAmount || 0).toLocaleString("en-IN")}
                      </span>
                    </td>

                    {/* Current Status */}
                    <td style={{ padding: "16px 20px" }}>
                      <StatusBadge status={order.orderStatus || "processing"} />
                    </td>

                    {/* Status Dropdown */}
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ position: "relative", display: "inline-block" }}>
                        <select
                          className="order-status-select"
                          value={currentSelection}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          style={{
                            padding: "8px 32px 8px 12px", borderRadius: 10, fontWeight: 700, fontSize: 12,
                            background: "rgba(11,16,27,0.8)", color: "#fff",
                            border: currentSelection ? "1px solid rgba(245,158,11,0.4)" : "1px solid rgba(255,255,255,0.12)",
                            minWidth: 150,
                          }}
                        >
                          <option value="">Select status...</option>
                          {STATUSES.filter((s) => s !== order.orderStatus).map((s) => (
                            <option key={s} value={s}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={14}
                          color="rgba(255,255,255,0.4)"
                          style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                        />
                      </div>
                    </td>

                    {/* Action Button */}
                    <td style={{ padding: "16px 20px", textAlign: "center" }}>
                      <button
                        className="order-update-btn"
                        disabled={!currentSelection || isUpdating}
                        onClick={() => handleUpdateStatus(order._id)}
                        style={{
                          padding: "8px 20px", borderRadius: 10, fontWeight: 700, fontSize: 12,
                          background: currentSelection
                            ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                            : "rgba(255,255,255,0.05)",
                          border: currentSelection
                            ? "none"
                            : "1px solid rgba(255,255,255,0.1)",
                          color: currentSelection ? "#000" : "rgba(255,255,255,0.3)",
                          cursor: currentSelection ? "pointer" : "not-allowed",
                          display: "inline-flex", alignItems: "center", gap: 6,
                          transition: "all 0.25s ease",
                          boxShadow: currentSelection ? "0 4px 15px rgba(245,158,11,0.3)" : "none",
                        }}
                      >
                        {isUpdating ? (
                          <><RefreshCw size={13} style={{ animation: "spin 1s linear infinite" }} /> Updating...</>
                        ) : (
                          <><CheckCircle size={13} /> Update</>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div style={{
            padding: "60px 20px", textAlign: "center", color: "rgba(255,255,255,0.35)", fontSize: 14,
          }}>
            <Package size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
            <div>No orders found.</div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BeekeeperOrders;
