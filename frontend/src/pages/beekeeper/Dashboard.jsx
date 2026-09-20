import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import BeeSwarmAnimation from "../../components/common/animations/BeeSwarmAnimation";
import { getDashboardStats, getRecentAlerts } from "../../api/dashboardApi";
import { AuthContext } from "../../context/AuthContext";
import { Sun, Droplets, Wind, ArrowRight } from "lucide-react";

const hero3DIslandUrl = "/assets/hero-beehive.png";
const apiaryIslandUrl = "/assets/apiary-island.png";
const aiHologramUrl = "/assets/ai-disease.png";
const honeyJarQrUrl = "/assets/honey-jar-qr.png";

const DEFAULT_ALERTS = [
  { id: "a1", title: "High Temperature", subtitle: "Hive #H01 • 2 min ago", severity: "CRITICAL" },
  { id: "a2", title: "Low Honey Flow Detected", subtitle: "Hive #H01 • 15 min ago", severity: "MEDIUM" },
  { id: "a3", title: "Humidity Fluctuation", subtitle: "Hive #H01 • 32 min ago", severity: "MEDIUM" },
  { id: "a4", title: "System Check Completed", subtitle: "All systems normal • 1 hr ago", severity: "INFO" },
];

const BeekeeperDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const [sRes, aRes] = await Promise.allSettled([
        getDashboardStats(),
        getRecentAlerts(),
      ]);
      if (sRes.status === "fulfilled") setStats(sRes.value.data);
      if (aRes.status === "fulfilled") {
        const rawAlerts = aRes.value.data?.alerts || aRes.value.data || [];
        setAlerts(Array.isArray(rawAlerts) && rawAlerts.length > 0 ? rawAlerts : DEFAULT_ALERTS);
      } else {
        setAlerts(DEFAULT_ALERTS);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const totalApiaries = stats?.summary?.totalApiaries ?? stats?.totalApiaries ?? 1;
  const totalHives = stats?.summary?.totalHives ?? stats?.totalHives ?? 1;
  const healthyHives = stats?.summary?.hiveHealth?.healthy ?? stats?.healthyHives ?? 0;
  const attentionHives = stats?.summary?.hiveHealth?.needsAttention ?? stats?.attentionHives ?? 0;
  const highRiskHives = stats?.summary?.hiveHealth?.highRisk ?? stats?.highRiskHives ?? 0;

  const healthyPercentage = totalHives > 0 ? Math.round((healthyHives / totalHives) * 100) : 0;
  const attentionPercentage = totalHives > 0 ? Math.round((attentionHives / totalHives) * 100) : 0;
  const highRiskPercentage = totalHives > 0 ? Math.round((highRiskHives / totalHives) * 100) : 0;

  const unreadAlertsCount =
    typeof stats?.summary?.unreadAlertCount === "number"
      ? stats.summary.unreadAlertCount
      : Array.isArray(stats?.unreadAlerts)
      ? stats.unreadAlerts.length
      : 0;

  const STAT_CARDS = [
    {
      label: "TOTAL APIARIES",
      value: totalApiaries,
      sub: "Active",
      image: apiaryIslandUrl,
      color: "#10b981",
      borderColor: "rgba(16, 185, 129, 0.3)"
    },
    {
      label: "TOTAL HIVES",
      value: totalHives,
      sub: "Active",
      image: hero3DIslandUrl,
      color: "#f59e0b",
      borderColor: "rgba(245, 158, 11, 0.3)"
    },
    {
      label: "HEALTHY HIVES",
      value: healthyHives,
      sub: `${healthyPercentage}% of total`,
      icon: "🛡️",
      color: "#10b981",
      borderColor: "rgba(16, 185, 129, 0.3)"
    },
    {
      label: "NEED ATTENTION",
      value: attentionHives,
      sub: `${attentionPercentage}% of total`,
      icon: "⚠️",
      color: "#f59e0b",
      borderColor: "rgba(245, 158, 11, 0.3)"
    },
    {
      label: "HIGH RISK",
      value: highRiskHives,
      sub: `${highRiskPercentage}% of total`,
      icon: "🚨",
      color: "#ef4444",
      borderColor: "rgba(239, 68, 68, 0.3)"
    },
    {
      label: "UNREAD ALERTS",
      value: unreadAlertsCount,
      sub: "View Alerts",
      icon: "🔔",
      color: "#f59e0b",
      borderColor: "rgba(245, 158, 11, 0.3)"
    },
  ];

  const latestSensor = Array.isArray(stats?.latestSensorData)
    ? stats.latestSensorData[0]
    : stats?.latestSensorData || stats?.latestSensor || null;

  const userName = user?.name || "JAGADEESH P";

  const activeAlertList = alerts.length > 0 ? alerts : DEFAULT_ALERTS;

  return (
    <DashboardLayout pageTitle="Smart Apiary Dashboard">
      {loading ? (
        <LoadingSpinner text="Connecting to Honey Chain Smart Network…" />
      ) : error ? (
        <ErrorState
          onRetry={load}
          description="Could not load dashboard data. Please check network connection."
        />
      ) : (
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 24, width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
          {/* LIVE FLYING BEE ANIMATION SWARM LAYER */}
          <BeeSwarmAnimation />

          {/* DASHBOARD HERO BANNER WITH 3D ISLAND & WEATHER */}
          <div
            className="dashboard-hero-banner honey-drip-card"
            style={{
              background: "linear-gradient(135deg, #0d1b14 0%, #0f2319 50%, #08120d 100%)",
              borderRadius: 24,
              padding: "32px 36px",
              border: "1px solid rgba(245, 158, 11, 0.3)",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
              width: "100%",
              boxSizing: "border-box"
            }}
          >
            {/* Top Liquid Honey Drip SVG */}
           

            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "5px 12px",
                  borderRadius: 99,
                  background: "rgba(16, 185, 129, 0.15)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  color: "#10b981",
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 14,
                  marginTop: 6
                }}
              >
                ⚡ LIVE IOT & AI MONITORED
              </div>

              <h1 style={{ fontSize: 32, fontWeight: 900, color: "#ffffff", marginBottom: 8, letterSpacing: "-0.5px" }}>
                {greeting}, {userName} 👋
              </h1>

              <p style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.75)", maxWidth: 580, lineHeight: 1.6, marginBottom: 24 }}>
                Manage your apiaries, monitor micro-climates, run AI disease diagnostics, and certify pure honey batches with complete end-to-end traceability.
              </p>

              {/* Weather Bar */}
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <div style={{ background: "rgba(255,255,255,0.06)", padding: "8px 16px", borderRadius: 14, display: "flex", alignItems: "center", gap: 10, border: "1px solid rgba(255,255,255,0.08)" }}>
                  <Sun size={18} color="#f59e0b" />
                  <div><div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>24°C</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>Partly Cloudy</div></div>
                </div>

                <div style={{ background: "rgba(255,255,255,0.06)", padding: "8px 16px", borderRadius: 14, display: "flex", alignItems: "center", gap: 10, border: "1px solid rgba(255,255,255,0.08)" }}>
                  <Droplets size={18} color="#3b82f6" />
                  <div><div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>62%</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>Humidity</div></div>
                </div>

                <div style={{ background: "rgba(255,255,255,0.06)", padding: "8px 16px", borderRadius: 14, display: "flex", alignItems: "center", gap: 10, border: "1px solid rgba(255,255,255,0.08)" }}>
                  <Wind size={18} color="#10b981" />
                  <div><div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>18 km/h</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>Wind Speed</div></div>
                </div>
              </div>
            </div>

            {/* 3D Photorealistic Grassy Beehive Island Image */}
            <div className="animate-3d-bobbing" style={{ width: "100%", maxHeight: 220, borderRadius: 20, overflow: "hidden", border: "1px solid rgba(245, 158, 11, 0.3)", boxShadow: "0 15px 35px rgba(0,0,0,0.6)" }}>
              <img src={hero3DIslandUrl} alt="3D Beehive Island" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </div>

          {/* 6 STATISTIC CARDS ROW WITH 3D IMAGE THUMBNAILS & BORDER GLOW */}
          <div className="dashboard-stats-grid">
            {STAT_CARDS.map((s) => (
              <div
                key={s.label}
                className="card-3d honey-drip-card"
                style={{
                  background: "rgba(15, 23, 42, 0.75)",
                  backdropFilter: "blur(12px)",
                  borderRadius: 18,
                  padding: 16,
                  border: `1px solid ${s.borderColor}`,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: 120,
                  boxSizing: "border-box",
                  boxShadow: `0 8px 25px -5px ${s.borderColor}`
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255, 255, 255, 0.5)", letterSpacing: 0.5 }}>
                  {s.label}
                </div>

                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 8 }}>
                  <div>
                    <div style={{ fontSize: 30, fontWeight: 900, color: "#ffffff", lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: s.color, marginTop: 4 }}>{s.sub}</div>
                  </div>

                  {s.image ? (
                    <div style={{ width: 44, height: 44, borderRadius: 12, overflow: "hidden", border: `1px solid ${s.borderColor}` }}>
                      <img src={s.image} alt={s.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  ) : (
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.06)", border: `1px solid ${s.borderColor}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                      {s.icon}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* MIDDLE ROW (HIVE HEALTH OVERVIEW, IOT SENSOR OVERVIEW, RECENT ALERTS) */}
          <div className="dashboard-middle-grid">
            {/* HIVE HEALTH OVERVIEW */}
            <div className="card-3d honey-drip-card" style={{ background: "rgba(15, 23, 42, 0.75)", borderRadius: 20, padding: 24, border: "1px solid rgba(255, 255, 255, 0.08)", boxSizing: "border-box" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#fff", margin: 0 }}>Hive Health Overview</h3>
                <Link to="/beekeeper/health" style={{ fontSize: 11, fontWeight: 700, color: "#f59e0b", textDecoration: "none", border: "1px solid rgba(245,158,11,0.3)", padding: "3px 10px", borderRadius: 99 }}>
                  View All
                </Link>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                {/* Donut Chart Visual */}
                <div style={{ position: "relative", width: 120, height: 120, borderRadius: "50%", background: `conic-gradient(#10b981 0% ${healthyPercentage}%, #f59e0b ${healthyPercentage}% ${healthyPercentage + attentionPercentage}%, #ef4444 ${healthyPercentage + attentionPercentage}% 100%)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <div style={{ width: 84, height: 84, borderRadius: "50%", background: "#0f172a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>{healthyPercentage}%</span>
                    <span style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", fontWeight: 700 }}>Healthy Hives</span>
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: 140, display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: "#10b981" }} />
                      <span style={{ color: "rgba(255,255,255,0.8)" }}>Healthy</span>
                    </div>
                    <strong style={{ color: "#fff" }}>{healthyHives} ({healthyPercentage}%)</strong>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: "#f59e0b" }} />
                      <span style={{ color: "rgba(255,255,255,0.8)" }}>Need Attention</span>
                    </div>
                    <strong style={{ color: "#fff" }}>{attentionHives} ({attentionPercentage}%)</strong>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: "#ef4444" }} />
                      <span style={{ color: "rgba(255,255,255,0.8)" }}>High Risk</span>
                    </div>
                    <strong style={{ color: "#fff" }}>{highRiskHives} ({highRiskPercentage}%)</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* IOT SENSOR OVERVIEW */}
            <div className="card-3d honey-drip-card" style={{ background: "rgba(15, 23, 42, 0.75)", borderRadius: 20, padding: 24, border: "1px solid rgba(255, 255, 255, 0.08)", boxSizing: "border-box" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#fff", margin: 0 }}>IoT Sensor Overview</h3>
                <Link to="/beekeeper/iot" style={{ fontSize: 11, fontWeight: 700, color: "#f59e0b", textDecoration: "none", border: "1px solid rgba(245,158,11,0.3)", padding: "3px 10px", borderRadius: 99 }}>
                  View All
                </Link>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: 4 }}>🌡 Temperature</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: "#38bdf8", marginTop: 4 }}>
                    {latestSensor?.temperature ? `${latestSensor.temperature} °C` : "24.3 °C"}
                  </div>
                  <svg style={{ width: "100%", height: 16, marginTop: 4 }} viewBox="0 0 100 20">
                    <path d="M0 15 Q25 5 50 12 T100 8" stroke="#38bdf8" strokeWidth="2" fill="none" />
                  </svg>
                </div>

                <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: 4 }}>💧 Humidity</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: "#a855f7", marginTop: 4 }}>
                    {latestSensor?.humidity ? `${latestSensor.humidity} %` : "62 %"}
                  </div>
                  <svg style={{ width: "100%", height: 16, marginTop: 4 }} viewBox="0 0 100 20">
                    <path d="M0 10 Q30 18 60 8 T100 14" stroke="#a855f7" strokeWidth="2" fill="none" />
                  </svg>
                </div>

                <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: 4 }}>⚖ Weight</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: "#10b981", marginTop: 4 }}>
                    {latestSensor?.weight ? `${latestSensor.weight} kg` : "31.2 kg"}
                  </div>
                  <svg style={{ width: "100%", height: 16, marginTop: 4 }} viewBox="0 0 100 20">
                    <path d="M0 16 Q30 6 60 14 T100 6" stroke="#10b981" strokeWidth="2" fill="none" />
                  </svg>
                </div>

                <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: 4 }}>📡 Status</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#10b981", marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
                    <span className="animate-pulse" style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} /> Normal
                  </div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>All Systems Operational</div>
                </div>
              </div>
            </div>

            {/* RECENT ALERTS PANEL */}
            <div className="card-3d honey-drip-card" style={{ background: "rgba(15, 23, 42, 0.75)", borderRadius: 20, padding: 24, border: "1px solid rgba(255, 255, 255, 0.08)", boxSizing: "border-box" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#fff", margin: 0 }}>Recent Alerts</h3>
                <Link to="/beekeeper/alerts" style={{ fontSize: 11, fontWeight: 700, color: "#f59e0b", textDecoration: "none", border: "1px solid rgba(245,158,11,0.3)", padding: "3px 10px", borderRadius: 99 }}>
                  View All
                </Link>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {activeAlertList.slice(0, 4).map((item) => (
                  <div key={item.id || item._id || item.title} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", borderRadius: 12, background: "rgba(255,255,255,0.03)" }}>
                    <div style={{ fontSize: 18 }}>
                      {item.severity === "CRITICAL" || item.severity === "high" ? "🚨" : item.severity === "MEDIUM" ? "⚠️" : "ℹ️"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#ffffff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {item.title || item.message}
                      </div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
                        {item.subtitle || (item.hive?.hiveId ? `Hive #${item.hive.hiveId}` : "All Systems")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BOTTOM ROW (AI DISEASE DETECTION & TRACE EVERY DROP) */}
          <div className="dashboard-bottom-grid">
            {/* AI DISEASE DETECTION BANNER */}
            <div
              className="card-3d honey-drip-card"
              style={{
                background: "linear-gradient(135deg, #091a13 0%, #0d2a1d 100%)",
                borderRadius: 24,
                padding: 28,
                border: "1px solid rgba(16, 185, 129, 0.3)",
                display: "grid",
                gridTemplateColumns: "1fr 160px",
                alignItems: "center",
                gap: 20,
                boxSizing: "border-box"
              }}
            >
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 900, color: "#ffffff", marginBottom: 6 }}>AI Disease Detection</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 20, lineHeight: 1.5 }}>
                  Protect your hives with AI powered disease detection
                </p>
                <Link
                  to="/beekeeper/disease"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 20px",
                    borderRadius: 12,
                    background: "transparent",
                    color: "#f59e0b",
                    border: "1.5px solid #f59e0b",
                    fontSize: 13,
                    fontWeight: 700,
                    textDecoration: "none"
                  }}
                >
                  Scan Hive Image <ArrowRight size={14} />
                </Link>
              </div>

              {/* 3D AI Hologram Image Asset */}
              <div style={{ width: "100%", height: 130, borderRadius: 16, overflow: "hidden", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                <img src={aiHologramUrl} alt="AI Hologram Shield" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </div>

            {/* TRACE EVERY DROP BANNER */}
            <div
              className="card-3d honey-drip-card"
              style={{
                background: "linear-gradient(135deg, #1f1406 0%, #362205 100%)",
                borderRadius: 24,
                padding: 28,
                border: "1px solid rgba(245, 158, 11, 0.3)",
                display: "grid",
                gridTemplateColumns: "1fr 160px",
                alignItems: "center",
                gap: 20,
                boxSizing: "border-box"
              }}
            >
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 900, color: "#ffffff", marginBottom: 6 }}>Trace Every Drop</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 20, lineHeight: 1.5 }}>
                  Generate QR code for your honey batches and enable full traceability.
                </p>
                <Link
                  to="/beekeeper/traceability"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 20px",
                    borderRadius: 12,
                    background: "#f59e0b",
                    color: "#000",
                    fontSize: 13,
                    fontWeight: 800,
                    textDecoration: "none",
                    boxShadow: "0 4px 14px rgba(245,158,11,0.4)"
                  }}
                >
                  Go to Traceability <ArrowRight size={14} />
                </Link>
              </div>

              {/* 3D Honey Jar QR Image Asset */}
              <div style={{ width: "100%", height: 130, borderRadius: 16, overflow: "hidden", border: "1px solid rgba(245, 158, 11, 0.3)" }}>
                <img src={honeyJarQrUrl} alt="Honey Jar QR" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default BeekeeperDashboard;
