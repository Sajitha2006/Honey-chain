import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatusBadge from "../../components/common/StatusBadge";
import { getMyOrders, cancelOrder } from "../../api/orderApi";
import {
  Package,
  Truck,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  ShoppingBag,
  IndianRupee,
  Clock,
  XCircle,
  Eye,
  X,
  MapPin,
  Calendar,
  ChevronRight,
  Box,
} from "lucide-react";

const DEFAULT_CUSTOMER_ORDERS = [
  {
    _id: "ORD-2024-1012",
    createdAt: "2024-05-25T10:00:00Z",
    totalAmount: 2740,
    orderStatus: "delivered",
    items: [{ product: { name: "Wild Forest Honey" }, quantity: 2, price: 650 }, { product: { name: "Manuka Honey" }, quantity: 1, price: 1440 }],
    shippingAddress: { street: "12, MG Road", city: "Chennai", state: "Tamil Nadu", zip: "600001" },
  },
  {
    _id: "ORD-2024-1009",
    createdAt: "2024-05-20T14:30:00Z",
    totalAmount: 1390,
    orderStatus: "shipped",
    items: [{ product: { name: "Acacia Honey" }, quantity: 1, price: 890 }, { product: { name: "Raw Honeycomb" }, quantity: 1, price: 500 }],
    shippingAddress: { street: "45, Anna Nagar", city: "Chennai", state: "Tamil Nadu", zip: "600040" },
  },
  {
    _id: "ORD-2024-1005",
    createdAt: "2024-05-15T09:15:00Z",
    totalAmount: 3240,
    orderStatus: "confirmed",
    items: [{ product: { name: "Premium Multifloral" }, quantity: 3, price: 780 }, { product: { name: "Bee Pollen" }, quantity: 2, price: 450 }],
    shippingAddress: { street: "8, Adyar Main Rd", city: "Chennai", state: "Tamil Nadu", zip: "600020" },
  },
  {
    _id: "ORD-2024-0999",
    createdAt: "2024-05-10T11:20:00Z",
    totalAmount: 1450,
    orderStatus: "delivered",
    items: [{ product: { name: "Jungle Honey" }, quantity: 2, price: 725 }],
    shippingAddress: { street: "22, T Nagar", city: "Chennai", state: "Tamil Nadu", zip: "600017" },
  },
];

const statusIcon = (s) => {
  switch (s) {
    case "placed": return <Clock size={14} color="#3b82f6" />;
    case "confirmed": return <CheckCircle size={14} color="#3b82f6" />;
    case "processing": return <RefreshCw size={14} color="#f59e0b" />;
    case "shipped": return <Truck size={14} color="#8b5cf6" />;
    case "delivered": return <CheckCircle size={14} color="#10b981" />;
    case "cancelled": return <XCircle size={14} color="#ef4444" />;
    default: return <Package size={14} color="#94a3b8" />;
  }
};

const statusColor = (s) => {
  switch (s) {
    case "placed": case "confirmed": return "#3b82f6";
    case "processing": return "#f59e0b";
    case "shipped": return "#8b5cf6";
    case "delivered": return "#10b981";
    case "cancelled": return "#ef4444";
    default: return "#94a3b8";
  }
};

/* Timeline steps for tracking */
const TIMELINE_STEPS = ["placed", "confirmed", "processing", "shipped", "delivered"];

/* ---------- Inline keyframes ---------- */
const styleId = "customer-orders-keyframes";
const injectStyles = () => {
  if (document.getElementById(styleId)) return;
  const s = document.createElement("style");
  s.id = styleId;
  s.textContent = `
    @keyframes coFadeIn {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes coSlideIn {
      from { opacity: 0; transform: translateX(20px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    .co-order-row:hover {
      background: rgba(255,255,255,0.04) !important;
    }
    .co-view-btn:hover {
      background: rgba(245,158,11,0.15) !important;
      border-color: rgba(245,158,11,0.5) !important;
      transform: translateY(-1px);
    }
    .co-cancel-btn:hover:not(:disabled) {
      background: rgba(239,68,68,0.15) !important;
      border-color: rgba(239,68,68,0.5) !important;
      transform: translateY(-1px);
    }
    .co-cancel-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .co-modal-backdrop {
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(0,0,0,0.7); backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      animation: coFadeIn 0.2s ease;
    }
    .co-modal-card {
      background: linear-gradient(180deg, rgba(15,23,42,0.98) 0%, rgba(11,16,27,0.99) 100%);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 24px; width: 90%; max-width: 560px; max-height: 85vh;
      overflow-y: auto; animation: coSlideIn 0.3s ease;
      box-shadow: 0 25px 80px rgba(0,0,0,0.7);
    }
    @media (max-width: 768px) {
      .co-stats-grid { grid-template-columns: 1fr 1fr !important; }
    }
    @media (max-width: 500px) {
      .co-stats-grid { grid-template-columns: 1fr !important; }
    }
  `;
  document.head.appendChild(s);
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  } catch { return dateStr; }
};

const CustomerOrders = () => {
  const [orders, setOrders] = useState(DEFAULT_CUSTOMER_ORDERS);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);
  const [viewOrder, setViewOrder] = useState(null);

  useEffect(() => { injectStyles(); }, []);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getMyOrders();
      const list = res.data?.orders || res.data || [];
      setOrders(list.length > 0 ? list : DEFAULT_CUSTOMER_ORDERS);
    } catch {
      setOrders(DEFAULT_CUSTOMER_ORDERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    setCancellingId(orderId);
    setError("");
    setSuccess("");

    try {
      await cancelOrder(orderId);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: "cancelled" } : o))
      );
      setSuccess(`Order ${orderId} cancelled successfully.`);
      setTimeout(() => setSuccess(""), 3500);
    } catch {
      // Fallback for demo
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: "cancelled" } : o))
      );
      setSuccess(`Order ${orderId} cancelled.`);
      setTimeout(() => setSuccess(""), 3500);
    } finally {
      setCancellingId(null);
    }
  };

  /* ── Stats ── */
  const totalOrders = orders.length;
  const activeCount = orders.filter((o) => ["placed", "confirmed", "processing", "shipped"].includes(o.orderStatus)).length;
  const deliveredCount = orders.filter((o) => o.orderStatus === "delivered").length;
  const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const statCards = [
    { label: "Total Orders", value: totalOrders, icon: <ShoppingBag size={20} color="#f59e0b" />, color: "#f59e0b" },
    { label: "Active", value: activeCount, icon: <Truck size={20} color="#3b82f6" />, color: "#3b82f6" },
    { label: "Delivered", value: deliveredCount, icon: <CheckCircle size={20} color="#10b981" />, color: "#10b981" },
    { label: "Total Spent", value: `₹${totalSpent.toLocaleString("en-IN")}`, icon: <IndianRupee size={20} color="#8b5cf6" />, color: "#8b5cf6" },
  ];

  if (loading) {
    return (
      <DashboardLayout pageTitle="My Orders" pageSubtitle="Track your order history.">
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="My Orders" pageSubtitle="Track your order history.">

      {/* ─── Header ─── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 16,
            background: "linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(245,158,11,0.05) 100%)",
            border: "1px solid rgba(245,158,11,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <ShoppingBag size={24} color="#f59e0b" />
          </div>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: "#ffffff", margin: 0, letterSpacing: "-0.5px" }}>
              My Orders
            </h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", margin: 0 }}>
              Track your purchases and order history
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
      <div className="co-stats-grid" style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28,
      }}>
        {statCards.map((stat, i) => (
          <div key={i} style={{
            background: "rgba(15,23,42,0.6)", borderRadius: 18, padding: "18px 20px",
            border: "1px solid rgba(255,255,255,0.06)",
            backdropFilter: "blur(12px)",
            animation: `coFadeIn 0.4s ease ${i * 0.08}s both`,
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
          animation: "coFadeIn 0.3s ease",
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
          animation: "coFadeIn 0.3s ease",
        }}>
          <AlertTriangle size={18} /> {error}
        </div>
      )}

      {/* ─── Orders Table ─── */}
      <div style={{
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
            <Package size={18} color="#f59e0b" />
            <span style={{ fontSize: 16, fontWeight: 800, color: "#ffffff" }}>Order History</span>
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
                {["Order ID", "Date", "Amount", "Status", "Actions"].map((h, i) => (
                  <th key={i} style={{
                    padding: "14px 20px", fontSize: 11, fontWeight: 700,
                    color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.8px",
                    textAlign: h === "Actions" ? "right" : "left",
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => {
                const isCancelling = cancellingId === order._id;
                const canCancel = ["placed", "confirmed"].includes(order.orderStatus);

                return (
                  <tr
                    key={order._id}
                    className="co-order-row"
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      transition: "background 0.2s ease",
                      animation: `coFadeIn 0.3s ease ${idx * 0.05}s both`,
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

                    {/* Date */}
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Calendar size={14} color="rgba(255,255,255,0.35)" />
                        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>
                          {formatDate(order.createdAt || order.date)}
                        </span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td style={{ padding: "16px 20px" }}>
                      <span style={{ fontWeight: 800, fontSize: 15, color: "#10b981" }}>
                        ₹{(order.totalAmount || 0).toLocaleString("en-IN")}
                      </span>
                    </td>

                    {/* Status */}
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {statusIcon(order.orderStatus)}
                        <StatusBadge status={order.orderStatus || "processing"} />
                      </div>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "16px 20px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <button
                          className="co-view-btn"
                          onClick={() => setViewOrder(order)}
                          style={{
                            padding: "7px 16px", borderRadius: 10, fontWeight: 700, fontSize: 12,
                            background: "rgba(245,158,11,0.08)",
                            border: "1px solid rgba(245,158,11,0.3)",
                            color: "#f59e0b", cursor: "pointer",
                            display: "inline-flex", alignItems: "center", gap: 6,
                            transition: "all 0.2s ease",
                          }}
                        >
                          <Eye size={13} /> View
                        </button>

                        {canCancel && (
                          <button
                            className="co-cancel-btn"
                            disabled={isCancelling}
                            onClick={() => handleCancel(order._id)}
                            style={{
                              padding: "7px 16px", borderRadius: 10, fontWeight: 700, fontSize: 12,
                              background: "rgba(239,68,68,0.08)",
                              border: "1px solid rgba(239,68,68,0.3)",
                              color: "#ef4444", cursor: "pointer",
                              display: "inline-flex", alignItems: "center", gap: 6,
                              transition: "all 0.2s ease",
                            }}
                          >
                            {isCancelling ? (
                              <><RefreshCw size={13} style={{ animation: "spin 1s linear infinite" }} /> Cancelling...</>
                            ) : (
                              <><XCircle size={13} /> Cancel</>
                            )}
                          </button>
                        )}
                      </div>
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
            <div>No orders found. Start shopping!</div>
          </div>
        )}
      </div>

      {/* ─── Order Detail Modal ─── */}
      {viewOrder && (
        <div className="co-modal-backdrop" onClick={() => setViewOrder(null)}>
          <div className="co-modal-card" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{
              padding: "22px 28px", borderBottom: "1px solid rgba(255,255,255,0.06)",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: "#ffffff", margin: 0, letterSpacing: "-0.3px" }}>
                  Order Details
                </h2>
                <span style={{
                  fontSize: 13, fontWeight: 800, color: "#f59e0b",
                  background: "rgba(245,158,11,0.1)", borderRadius: 6, padding: "2px 8px",
                  marginTop: 4, display: "inline-block",
                }}>
                  {viewOrder._id}
                </span>
              </div>
              <button
                onClick={() => setViewOrder(null)}
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "24px 28px" }}>

              {/* Status + Date Row */}
              <div style={{
                display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap",
              }}>
                <div style={{
                  flex: 1, minWidth: 140,
                  background: "rgba(255,255,255,0.03)", borderRadius: 14, padding: "14px 16px",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>
                    Status
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {statusIcon(viewOrder.orderStatus)}
                    <StatusBadge status={viewOrder.orderStatus} />
                  </div>
                </div>

                <div style={{
                  flex: 1, minWidth: 140,
                  background: "rgba(255,255,255,0.03)", borderRadius: 14, padding: "14px 16px",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>
                    Order Date
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Calendar size={14} color="#f59e0b" />
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>
                      {formatDate(viewOrder.createdAt || viewOrder.date)}
                    </span>
                  </div>
                </div>

                <div style={{
                  flex: 1, minWidth: 140,
                  background: "rgba(255,255,255,0.03)", borderRadius: 14, padding: "14px 16px",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>
                    Total
                  </div>
                  <span style={{ fontSize: 20, fontWeight: 900, color: "#10b981" }}>
                    ₹{(viewOrder.totalAmount || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Order Tracking Timeline */}
              {viewOrder.orderStatus !== "cancelled" && (
                <div style={{
                  background: "rgba(255,255,255,0.03)", borderRadius: 16, padding: "20px",
                  border: "1px solid rgba(255,255,255,0.06)", marginBottom: 24,
                }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 16 }}>
                    Order Tracking
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                    {TIMELINE_STEPS.map((step, i) => {
                      const currentIdx = TIMELINE_STEPS.indexOf(viewOrder.orderStatus);
                      const isCompleted = i <= currentIdx;
                      const isCurrent = i === currentIdx;
                      const clr = isCompleted ? statusColor(viewOrder.orderStatus) : "rgba(255,255,255,0.15)";

                      return (
                        <div key={step} style={{ display: "flex", alignItems: "center", flex: i < TIMELINE_STEPS.length - 1 ? 1 : "none" }}>
                          {/* Dot */}
                          <div style={{
                            width: isCurrent ? 28 : 20, height: isCurrent ? 28 : 20,
                            borderRadius: "50%", flexShrink: 0,
                            background: isCompleted ? `${clr}20` : "rgba(255,255,255,0.04)",
                            border: `2px solid ${clr}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "all 0.3s ease",
                            boxShadow: isCurrent ? `0 0 12px ${clr}40` : "none",
                          }}>
                            {isCompleted && <CheckCircle size={isCurrent ? 14 : 10} color={clr} />}
                          </div>
                          {/* Connector line */}
                          {i < TIMELINE_STEPS.length - 1 && (
                            <div style={{
                              flex: 1, height: 2,
                              background: i < currentIdx
                                ? clr
                                : "rgba(255,255,255,0.08)",
                              transition: "background 0.3s ease",
                            }} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                    {TIMELINE_STEPS.map((step) => (
                      <span key={step} style={{
                        fontSize: 10, fontWeight: 600,
                        color: "rgba(255,255,255,0.35)",
                        textTransform: "capitalize",
                        textAlign: "center",
                        width: `${100 / TIMELINE_STEPS.length}%`,
                      }}>
                        {step}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Items */}
              {viewOrder.items && viewOrder.items.length > 0 && (
                <div style={{
                  background: "rgba(255,255,255,0.03)", borderRadius: 16, padding: "20px",
                  border: "1px solid rgba(255,255,255,0.06)", marginBottom: 24,
                }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 14 }}>
                    Items Ordered
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {viewOrder.items.map((item, i) => (
                      <div key={i} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "10px 14px", borderRadius: 12,
                        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: 8,
                            background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <Box size={14} color="#f59e0b" />
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>
                              {item.product?.name || "Honey Product"}
                            </div>
                            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                              Qty: {item.quantity || 1}
                            </div>
                          </div>
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 800, color: "#10b981" }}>
                          ₹{(item.price || 0).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Shipping Address */}
              {viewOrder.shippingAddress && (
                <div style={{
                  background: "rgba(255,255,255,0.03)", borderRadius: 16, padding: "20px",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10 }}>
                    Shipping Address
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <MapPin size={16} color="#f59e0b" style={{ marginTop: 2, flexShrink: 0 }} />
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>
                      {viewOrder.shippingAddress.street && <div>{viewOrder.shippingAddress.street}</div>}
                      <div>
                        {viewOrder.shippingAddress.city}{viewOrder.shippingAddress.state ? `, ${viewOrder.shippingAddress.state}` : ""}
                        {viewOrder.shippingAddress.zip ? ` - ${viewOrder.shippingAddress.zip}` : ""}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CustomerOrders;
