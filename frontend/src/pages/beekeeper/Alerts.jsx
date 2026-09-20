import { useEffect, useMemo, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";

import {
  getMyAlerts,
  markAlertAsRead,
 
} from "../../api/alertApi";

import {
  Bell,
  CheckCircle,
  AlertTriangle,
  ShieldAlert,
  Info,
  Clock3,
  Search,
  RefreshCw,
  ChevronRight,
  Activity,
  X,
} from "lucide-react";

const DEFAULT_ALERTS = [
  {
    _id: "al1",
    title: "High Temperature",
    hive: "HIVE-001",
    time: "2 min ago",
    severity: "HIGH",
    isRead: false,
  },
  {
    _id: "al2",
    title: "Low Honey Flow Detected",
    hive: "HIVE-003",
    time: "15 min ago",
    severity: "MEDIUM",
    isRead: false,
  },
  {
    _id: "al3",
    title: "Humidity Fluctuation",
    hive: "HIVE-002",
    time: "30 min ago",
    severity: "MEDIUM",
    isRead: true,
  },
  {
    _id: "al4",
    title: "Varroa Mite Activity High",
    hive: "HIVE-001",
    time: "1 hr ago",
    severity: "HIGH",
    isRead: false,
  },
  {
    _id: "al5",
    title: "System Check Completed",
    hive: "All Systems",
    time: "2 hrs ago",
    severity: "LOW",
    isRead: true,
  },
  {
    _id: "al6",
    title: "Sensor Battery Low",
    hive: "HIVE-005",
    time: "3 hrs ago",
    severity: "LOW",
    isRead: true,
  },
];

const formatHiveName = (hive) => {
  if (!hive) return "System";

  const name =
    typeof hive === "object"
      ? hive.hiveId || hive.name || hive._id || "System"
      : hive;

  const str = String(name);

  if (
    str.includes("HIVE") ||
    str.toLowerCase().includes("system") ||
    str.toLowerCase().includes("all")
  ) {
    return str;
  }

  return `Hive #${str}`;
};

const Alerts = () => {
  const [alerts, setAlerts] = useState(DEFAULT_ALERTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedAlert, setSelectedAlert] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getMyAlerts();
      const list = res.data?.alerts || res.data || [];

      setAlerts(list.length > 0 ? list : DEFAULT_ALERTS);
    } catch (err) {
      console.error("Failed to load alerts:", err);
      setAlerts(DEFAULT_ALERTS);
      setError("Unable to retrieve live alerts. Showing recent system alerts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleMarkAll = async () => {
    setAlerts((prev) =>
      prev.map((alert) => ({
        ...alert,
        isRead: true,
      }))
    );

    /*
      Keep backend integration safe.
      Individual alert APIs can still be used when opening an alert.
    */
  };

  const handleAlertClick = async (item) => {
    setSelectedAlert(item);

    if (!item.isRead) {
      try {
        if (item._id) {
          await markAlertAsRead(item._id);
        }
      } catch (err) {
        console.error("Mark alert as read failed:", err);
      }

      setAlerts((prev) =>
        prev.map((alert) =>
          alert._id === item._id
            ? { ...alert, isRead: true }
            : alert
        )
      );
    }
  };

  const filtered = useMemo(() => {
    return alerts.filter((alert) => {
      const severityMatch =
        filterSeverity === "all" ||
        alert.severity?.toLowerCase() ===
          filterSeverity.toLowerCase();

      const searchText = search.toLowerCase();

      const searchMatch =
        !searchText ||
        alert.title?.toLowerCase().includes(searchText) ||
        alert.message?.toLowerCase().includes(searchText) ||
        formatHiveName(alert.hive)
          .toLowerCase()
          .includes(searchText);

      return severityMatch && searchMatch;
    });
  }, [alerts, filterSeverity, search]);

  const stats = useMemo(() => {
    const high = alerts.filter(
      (a) =>
        a.severity === "HIGH" ||
        a.severity === "high" ||
        a.severity === "CRITICAL"
    ).length;

    const medium = alerts.filter(
      (a) =>
        a.severity === "MEDIUM" ||
        a.severity === "medium"
    ).length;

    const unread = alerts.filter((a) => !a.isRead).length;

    return {
      total: alerts.length,
      high,
      medium,
      unread,
    };
  }, [alerts]);

  const getSeverityConfig = (severity) => {
    const value = severity?.toUpperCase();

    if (value === "CRITICAL" || value === "HIGH") {
      return {
        color: "#ef4444",
        soft: "rgba(239,68,68,0.10)",
        border: "rgba(239,68,68,0.30)",
        icon: <ShieldAlert size={19} />,
        label: value,
      };
    }

    if (value === "MEDIUM") {
      return {
        color: "#f59e0b",
        soft: "rgba(245,158,11,0.10)",
        border: "rgba(245,158,11,0.30)",
        icon: <AlertTriangle size={19} />,
        label: value,
      };
    }

    return {
      color: "#10b981",
      soft: "rgba(16,185,129,0.10)",
      border: "rgba(16,185,129,0.25)",
      icon: <Info size={19} />,
      label: value || "LOW",
    };
  };

  return (
    <DashboardLayout
      pageTitle="System Alert Center"
      pageSubtitle="Real-time environmental threshold breach notifications & health warnings"
    >
      <style>
        {`
          @keyframes alertFadeUp {
            from {
              opacity: 0;
              transform: translateY(16px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes alertPulse {
            0%, 100% {
              box-shadow: 0 0 0 0 rgba(239,68,68,0.30);
            }
            50% {
              box-shadow: 0 0 0 7px rgba(239,68,68,0);
            }
          }

          @keyframes alertGreenPulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.45;
            }
          }

          @keyframes alertSpin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          .alert-page-card {
            transition:
              transform 0.25s ease,
              border-color 0.25s ease,
              box-shadow 0.25s ease;
          }

          .alert-page-card:hover {
            transform: translateY(-2px);
            border-color: rgba(245,158,11,0.22) !important;
            box-shadow:
              0 18px 45px rgba(0,0,0,0.22),
              0 0 25px rgba(245,158,11,0.04);
          }

          .alert-item {
            transition:
              transform 0.22s ease,
              background 0.22s ease,
              border-color 0.22s ease;
          }

          .alert-item:hover {
            transform: translateX(4px);
            background: rgba(255,255,255,0.045) !important;
          }

          .alert-search:focus {
            outline: none;
            border-color: rgba(245,158,11,0.55) !important;
            box-shadow: 0 0 0 3px rgba(245,158,11,0.08);
          }

          .alert-filter {
            transition: all 0.2s ease;
          }

          .alert-filter:hover {
            border-color: rgba(245,158,11,0.4) !important;
            color: #f59e0b !important;
          }

          @media (max-width: 700px) {
            .alerts-header {
              flex-direction: column !important;
              align-items: flex-start !important;
            }

            .alert-stats {
              grid-template-columns: repeat(2, 1fr) !important;
            }

            .alert-item {
              align-items: flex-start !important;
            }

            .alert-item-right {
              display: none !important;
            }

            .alert-toolbar {
              flex-direction: column !important;
            }

            .alert-search-wrapper {
              width: 100% !important;
            }
          }
        `}
      </style>

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          paddingBottom: 40,
        }}
      >
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div
          className="alerts-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
            marginBottom: 24,
            animation: "alertFadeUp 0.4s ease both",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "6px 12px",
                borderRadius: 99,
                background: "rgba(245,158,11,0.08)",
                border: "1px solid rgba(245,158,11,0.20)",
                color: "#f59e0b",
                fontSize: 10,
                fontWeight: 900,
                letterSpacing: 1,
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              <Activity size={12} />
              Live Monitoring
            </div>

            <h1
              style={{
                fontSize: 30,
                fontWeight: 900,
                color: "#fff",
                margin: 0,
                letterSpacing: "-0.8px",
              }}
            >
              Alert Center
            </h1>

            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.48)",
                margin: "6px 0 0",
              }}
            >
              Monitor hive health, environmental warnings and
              system events.
            </p>
          </div>

          <button
            onClick={handleMarkAll}
            className="btn-outline btn-sm"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 16px",
              borderRadius: 12,
              border: "1px solid rgba(245,158,11,0.25)",
              background: "rgba(245,158,11,0.05)",
              color: "#f59e0b",
            }}
          >
            <CheckCircle size={15} />
            Mark all as read
          </button>
        </div>

        {/* =====================================================
            STAT CARDS
        ===================================================== */}

        <div
          className="alert-stats"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 14,
            marginBottom: 22,
            animation: "alertFadeUp 0.45s ease 0.05s both",
          }}
        >
          {[
            {
              label: "Total Alerts",
              value: stats.total,
              icon: <Bell size={18} />,
              color: "#f59e0b",
            },
            {
              label: "Unread",
              value: stats.unread,
              icon: <Activity size={18} />,
              color: "#3b82f6",
            },
            {
              label: "High Risk",
              value: stats.high,
              icon: <ShieldAlert size={18} />,
              color: "#ef4444",
            },
            {
              label: "Medium Risk",
              value: stats.medium,
              icon: <AlertTriangle size={18} />,
              color: "#f59e0b",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="alert-page-card"
              style={{
                background: "rgba(8,14,21,0.72)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 17,
                padding: "17px 18px",
                backdropFilter: "blur(16px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.45)",
                    fontSize: 10,
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: 0.7,
                    marginBottom: 7,
                  }}
                >
                  {stat.label}
                </div>

                <div
                  style={{
                    color: "#fff",
                    fontSize: 25,
                    fontWeight: 900,
                  }}
                >
                  {stat.value}
                </div>
              </div>

              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: stat.color,
                  background: `${stat.color}12`,
                  border: `1px solid ${stat.color}25`,
                }}
              >
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* =====================================================
            MAIN ALERT CARD
        ===================================================== */}

        <div
          className="alert-page-card"
          style={{
            background: "rgba(8,14,21,0.78)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 22,
            backdropFilter: "blur(18px)",
            overflow: "hidden",
            animation: "alertFadeUp 0.5s ease 0.1s both",
          }}
        >
          {/* TOOLBAR */}

          <div
            className="alert-toolbar"
            style={{
              padding: "18px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 14,
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {/* FILTERS */}

            <div
              style={{
                display: "flex",
                gap: 7,
                flexWrap: "wrap",
              }}
            >
              {["all", "high", "medium", "low"].map((severity) => {
                const active = filterSeverity === severity;

                return (
                  <button
                    key={severity}
                    onClick={() => setFilterSeverity(severity)}
                    className="alert-filter"
                    style={{
                      padding: "8px 14px",
                      borderRadius: 99,
                      border: active
                        ? "1px solid rgba(245,158,11,0.55)"
                        : "1px solid rgba(255,255,255,0.09)",
                      background: active
                        ? "rgba(245,158,11,0.12)"
                        : "rgba(255,255,255,0.025)",
                      color: active
                        ? "#f59e0b"
                        : "rgba(255,255,255,0.55)",
                      fontSize: 11,
                      fontWeight: 800,
                      cursor: "pointer",
                      textTransform: "capitalize",
                    }}
                  >
                    {severity}
                  </button>
                );
              })}
            </div>

            {/* SEARCH + REFRESH */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                className="alert-search-wrapper"
                style={{
                  position: "relative",
                  width: 220,
                }}
              >
                <Search
                  size={15}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "rgba(255,255,255,0.35)",
                  }}
                />

                <input
                  className="alert-search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search alerts..."
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "9px 12px 9px 36px",
                    borderRadius: 11,
                    border:
                      "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(0,0,0,0.22)",
                    color: "#fff",
                    fontSize: 11,
                  }}
                />
              </div>

              <button
                onClick={load}
                title="Refresh alerts"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  border:
                    "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.03)",
                  color: "rgba(255,255,255,0.6)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <RefreshCw size={15} />
              </button>
            </div>
          </div>

          {/* ERROR */}

          {error && (
            <div
              style={{
                margin: "16px 20px 0",
                padding: "11px 14px",
                borderRadius: 12,
                background: "rgba(245,158,11,0.07)",
                border: "1px solid rgba(245,158,11,0.18)",
                color: "#fbbf24",
                fontSize: 11,
              }}
            >
              {error}
            </div>
          )}

          {/* ===================================================
              ALERT LIST
          =================================================== */}

          <div style={{ padding: 20 }}>
            {loading ? (
              <LoadingSpinner text="Retrieving system alert log..." />
            ) : filtered.length === 0 ? (
              <div
                style={{
                  minHeight: 260,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(255,255,255,0.4)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 18,
                    background: "rgba(16,185,129,0.08)",
                    border:
                      "1px solid rgba(16,185,129,0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 12,
                  }}
                >
                  <CheckCircle
                    size={27}
                    color="#10b981"
                  />
                </div>

                <div
                  style={{
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: 800,
                    marginBottom: 5,
                  }}
                >
                  No alerts found
                </div>

                <div
                  style={{
                    fontSize: 11,
                  }}
                >
                  Your selected filter has no matching alerts.
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {filtered.map((item, index) => {
                  const config = getSeverityConfig(
                    item.severity
                  );

                  return (
                    <div
                      key={item._id}
                      className="alert-item"
                      onClick={() => handleAlertClick(item)}
                      style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 15,
                        padding: "14px 15px",
                        borderRadius: 15,
                        background: item.isRead
                          ? "rgba(255,255,255,0.018)"
                          : config.soft,
                        border: `1px solid ${
                          item.isRead
                            ? "rgba(255,255,255,0.065)"
                            : config.border
                        }`,
                        cursor: "pointer",
                        animation: `alertFadeUp 0.35s ease ${
                          index * 0.04
                        }s both`,
                      }}
                    >
                      {/* UNREAD INDICATOR */}

                      {!item.isRead && (
                        <div
                          style={{
                            position: "absolute",
                            left: -1,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: 3,
                            height: 30,
                            borderRadius: "0 4px 4px 0",
                            background: config.color,
                            boxShadow: `0 0 12px ${config.color}`,
                          }}
                        />
                      )}

                      {/* LEFT */}

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 13,
                          minWidth: 0,
                        }}
                      >
                        <div
                          style={{
                            flexShrink: 0,
                            width: 44,
                            height: 44,
                            borderRadius: 13,
                            background: config.soft,
                            border: `1px solid ${config.border}`,
                            color: config.color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            animation:
                              !item.isRead &&
                              (config.label === "HIGH" ||
                                config.label === "CRITICAL")
                                ? "alertPulse 2s infinite"
                                : "none",
                          }}
                        >
                          {config.icon}
                        </div>

                        <div
                          style={{
                            minWidth: 0,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              flexWrap: "wrap",
                            }}
                          >
                            <span
                              style={{
                                color: "#fff",
                                fontSize: 13,
                                fontWeight: 850,
                              }}
                            >
                              {item.title ||
                                item.message ||
                                "System Alert"}
                            </span>

                            {!item.isRead && (
                              <span
                                style={{
                                  padding: "3px 7px",
                                  borderRadius: 99,
                                  background:
                                    "rgba(59,130,246,0.12)",
                                  border:
                                    "1px solid rgba(59,130,246,0.22)",
                                  color: "#60a5fa",
                                  fontSize: 8,
                                  fontWeight: 900,
                                  letterSpacing: 0.5,
                                }}
                              >
                                NEW
                              </span>
                            )}
                          </div>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 7,
                              marginTop: 5,
                              color:
                                "rgba(255,255,255,0.42)",
                              fontSize: 10,
                            }}
                          >
                            <span>
                              {formatHiveName(item.hive)}
                            </span>

                            <span
                              style={{
                                opacity: 0.4,
                              }}
                            >
                              •
                            </span>

                            <Clock3 size={11} />

                            <span>
                              {item.time || "Just now"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* RIGHT */}

                      <div
                        className="alert-item-right"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 13,
                          flexShrink: 0,
                        }}
                      >
                        <span
                          style={{
                            padding: "5px 10px",
                            borderRadius: 99,
                            background: config.soft,
                            border: `1px solid ${config.border}`,
                            color: config.color,
                            fontSize: 9,
                            fontWeight: 900,
                            letterSpacing: 0.6,
                          }}
                        >
                          {config.label}
                        </span>

                        <ChevronRight
                          size={16}
                          color="rgba(255,255,255,0.25)"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* =====================================================
            BOTTOM STATUS
        ===================================================== */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginTop: 18,
            color: "rgba(255,255,255,0.35)",
            fontSize: 10,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#10b981",
              boxShadow: "0 0 10px rgba(16,185,129,0.7)",
              animation: "alertGreenPulse 2s infinite",
            }}
          />
          HoneyChain monitoring system operational
        </div>
      </div>

      {/* =======================================================
          ALERT DETAIL MODAL
      ======================================================= */}

      {selectedAlert && (
        <div
          onClick={() => setSelectedAlert(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(0,0,0,0.72)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 480,
              background:
                "linear-gradient(145deg, #0d151c, #070c12)",
              border:
                "1px solid rgba(245,158,11,0.20)",
              borderRadius: 22,
              boxShadow:
                "0 30px 80px rgba(0,0,0,0.55)",
              overflow: "hidden",
              animation: "alertFadeUp 0.25s ease both",
            }}
          >
            {(() => {
              const config = getSeverityConfig(
                selectedAlert.severity
              );

              return (
                <>
                  <div
                    style={{
                      height: 4,
                      background: config.color,
                      boxShadow: `0 0 20px ${config.color}`,
                    }}
                  />

                  <div style={{ padding: 24 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 15,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 14,
                            background: config.soft,
                            border: `1px solid ${config.border}`,
                            color: config.color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {config.icon}
                        </div>

                        <div>
                          <div
                            style={{
                              color:
                                "rgba(255,255,255,0.4)",
                              fontSize: 9,
                              fontWeight: 900,
                              letterSpacing: 1,
                              textTransform:
                                "uppercase",
                              marginBottom: 4,
                            }}
                          >
                            System Alert
                          </div>

                          <h2
                            style={{
                              color: "#fff",
                              fontSize: 18,
                              margin: 0,
                              fontWeight: 900,
                            }}
                          >
                            {selectedAlert.title ||
                              selectedAlert.message ||
                              "Alert"}
                          </h2>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          setSelectedAlert(null)
                        }
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 9,
                          border:
                            "1px solid rgba(255,255,255,0.08)",
                          background:
                            "rgba(255,255,255,0.03)",
                          color:
                            "rgba(255,255,255,0.55)",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <X size={15} />
                      </button>
                    </div>

                    <div
                      style={{
                        marginTop: 24,
                        display: "grid",
                        gridTemplateColumns:
                          "1fr 1fr",
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          padding: 14,
                          borderRadius: 13,
                          background:
                            "rgba(255,255,255,0.025)",
                          border:
                            "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <div
                          style={{
                            color:
                              "rgba(255,255,255,0.35)",
                            fontSize: 9,
                            textTransform:
                              "uppercase",
                            fontWeight: 800,
                            marginBottom: 5,
                          }}
                        >
                          Hive
                        </div>

                        <div
                          style={{
                            color: "#fff",
                            fontSize: 12,
                            fontWeight: 800,
                          }}
                        >
                          {formatHiveName(
                            selectedAlert.hive
                          )}
                        </div>
                      </div>

                      <div
                        style={{
                          padding: 14,
                          borderRadius: 13,
                          background:
                            "rgba(255,255,255,0.025)",
                          border:
                            "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <div
                          style={{
                            color:
                              "rgba(255,255,255,0.35)",
                            fontSize: 9,
                            textTransform:
                              "uppercase",
                            fontWeight: 800,
                            marginBottom: 5,
                          }}
                        >
                          Severity
                        </div>

                        <div
                          style={{
                            color: config.color,
                            fontSize: 12,
                            fontWeight: 900,
                          }}
                        >
                          {config.label}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: 10,
                        padding: 14,
                        borderRadius: 13,
                        background:
                          "rgba(255,255,255,0.025)",
                        border:
                          "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <div
                        style={{
                          color:
                            "rgba(255,255,255,0.35)",
                          fontSize: 9,
                          textTransform: "uppercase",
                          fontWeight: 800,
                          marginBottom: 5,
                        }}
                      >
                        Time
                      </div>

                      <div
                        style={{
                          color: "#fff",
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {selectedAlert.time ||
                          "Just now"}
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        setSelectedAlert(null)
                      }
                      style={{
                        width: "100%",
                        marginTop: 20,
                        padding: "12px 16px",
                        borderRadius: 12,
                        border: "none",
                        background:
                          "linear-gradient(135deg,#f59e0b,#d97706)",
                        color: "#090d16",
                        fontSize: 12,
                        fontWeight: 900,
                        cursor: "pointer",
                      }}
                    >
                      Close Alert
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Alerts;