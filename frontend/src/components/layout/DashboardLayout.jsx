import { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getUnreadAlerts } from "../../api/alertApi";
import {
  LayoutDashboard,
  MapPin,
  Grid3X3,
  Activity,
  Heart,
  Microscope,
  ShoppingBag,
  Package,
  Link2,
  Bell,
  User,
  LogOut,
  ShoppingCart,
  Search,
  Menu,
  ChevronDown,
} from "lucide-react";

const sidebarJarUrl = "/assets/honey-jar-product.png";

const BEEKEEPER_NAV = [
  { name: "Dashboard", path: "/beekeeper/dashboard", icon: LayoutDashboard },
  { name: "Apiaries", path: "/beekeeper/apiaries", icon: MapPin },
  { name: "Hives", path: "/beekeeper/hives", icon: Grid3X3 },
  { name: "IoT Sensors", path: "/beekeeper/iot", icon: Activity },
  { name: "Hive Health", path: "/beekeeper/health", icon: Heart },
  { name: "AI Disease Det.", path: "/beekeeper/disease", icon: Microscope },
  { name: "Products", path: "/beekeeper/products", icon: ShoppingBag },
  { name: "Orders", path: "/beekeeper/orders", icon: Package },
  { name: "Traceability", path: "/beekeeper/traceability", icon: Link2 },
  { name: "Alerts", path: "/beekeeper/alerts", icon: Bell },
  { name: "Profile", path: "/beekeeper/profile", icon: User },
];

const CUSTOMER_NAV = [
  { name: "Dashboard", path: "/customer/dashboard", icon: LayoutDashboard },
  { name: "Marketplace", path: "/customer/products", icon: ShoppingBag },
  { name: "Cart", path: "/customer/cart", icon: ShoppingCart },
  { name: "My Orders", path: "/customer/orders", icon: Package },
  { name: "Verify Honey", path: "/qr-scanner", icon: Search },
  { name: "Profile", path: "/customer/profile", icon: User },
];

const DashboardLayout = ({ children, role }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2); // Match reference mock badge if empty

  const currentRole = role || user?.role || "beekeeper";
  const links = currentRole === "beekeeper" ? BEEKEEPER_NAV : CUSTOMER_NAV;

  useEffect(() => {
    if (currentRole === "beekeeper") {
      getUnreadAlerts()
        .then((res) => {
          const count = res.data?.count ?? (res.data?.alerts?.length || 0);
          if (typeof count === "number" && count > 0) {
            setUnreadCount(count);
          }
        })
        .catch(() => {});
    }
  }, [currentRole]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const userName = user?.name;
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div
      className="dashboard-wrapper honeycomb-pattern"
      style={{
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100%",
        display: "flex",
        background: "#080c14",
        color: "#e2e8f0",
        overflowX: "hidden",
      }}
    >
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="mobile-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 49,
          }}
        />
      )}

      {/* 3D DARK GLASS SIDEBAR */}
      <aside
        className={`sidebar ${sidebarOpen ? "open" : ""}`}
        style={{
          width: 260,
          height: "100vh",
          position: "sticky",
          top: 0,
          background: "linear-gradient(180deg, #0b101b 0%, #060910 100%)",
          borderRight: "1px solid rgba(255, 255, 255, 0.08)",
          display: "flex",
          flexDirection: "column",
          padding: "20px 16px",
          zIndex: 50,
          flexShrink: 0,
          overflowY: "auto",
          overflowX: "hidden",
          boxSizing: "border-box",
        }}
      >
        {/* Brand Header */}
        <div style={{ marginBottom: 18, padding: "0 6px" }}>
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                boxShadow: "0 0 15px rgba(245,158,11,0.5)",
                flexShrink: 0,
              }}
            >
              🐝
            </div>
            <div>
              <div
                style={{
                  fontSize: 19,
                  fontWeight: 900,
                  color: "#fff",
                  letterSpacing: "-0.5px",
                  lineHeight: 1.1,
                }}
              >
                Honey Chain
              </div>
              <p
                style={{
                  color: "rgba(255,255,255,0.45)",
                  fontSize: 9.5,
                  margin: "2px 0 0",
                  fontWeight: 600,
                  letterSpacing: 0.1,
                }}
              >
                Smart Hives • Pure Honey • Traceability
              </p>
            </div>
          </Link>
        </div>

        {/* User Profile Card */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.04)",
            borderRadius: 14,
            padding: "10px 14px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              color: "#fff",
              fontWeight: 900,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
              boxShadow: "0 0 12px rgba(245,158,11,0.4)",
              flexShrink: 0,
            }}
          >
            {userInitial}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                color: "#fff",
                fontWeight: 800,
                fontSize: 13,
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {userName}
            </div>
            <div
              style={{
                color: "#f59e0b",
                fontSize: 10,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 4,
                marginTop: 1,
              }}
            >
              👑 {currentRole === "beekeeper" ? "BEEKEEPER" : "CUSTOMER"}
            </div>
          </div>
          <ChevronDown size={14} color="rgba(255,255,255,0.5)" />
        </div>

        {/* Navigation Menu Header */}
        <div
          style={{
            fontSize: 10,
            fontWeight: 800,
            color: "rgba(255,255,255,0.35)",
            padding: "0 8px 8px",
            textTransform: "uppercase",
            letterSpacing: 1.2,
            flexShrink: 0,
          }}
        >
          MENU
        </div>

        {/* Nav Links */}
        <nav
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 4,
            overflowY: "auto",
          }}
        >
          {links.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 14px",
                borderRadius: 12,
                fontSize: 13,
                fontWeight: isActive ? 800 : 500,
                color: isActive ? "#ffffff" : "rgba(255,255,255,0.65)",
                background: isActive
                  ? "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)"
                  : "transparent",
                boxShadow: isActive
                  ? "0 4px 20px rgba(245,158,11,0.4)"
                  : "none",
                textDecoration: "none",
                transition: "all 0.2s ease",
              })}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={17} />
              <span style={{ flex: 1 }}>{name}</span>
              {name === "Alerts" && unreadCount > 0 && (
                <span
                  style={{
                    background: "#f59e0b",
                    color: "#000",
                    fontSize: 11,
                    fontWeight: 900,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Sidebar Honey Jar Promo Box */}
        <div
          style={{
            marginTop: 16,
            background:
              "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(15,23,42,0.85))",
            borderRadius: 16,
            padding: 14,
            border: "1px solid rgba(245,158,11,0.25)",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: "#fff",
                marginBottom: 2,
              }}
            >
              Honey Chain
            </div>
            <p
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.6)",
                margin: 0,
                lineHeight: 1.3,
              }}
            >
              Connecting Nature,
              <br />
              Technology & Trust.
            </p>
          </div>
          <img
            src={sidebarJarUrl}
            alt="Honey Jar"
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              objectFit: "cover",
            }}
          />
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            marginTop: 12,
            width: "100%",
            background: "rgba(239, 68, 68, 0.12)",
            color: "#f87171",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            padding: "10px",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <LogOut size={16} /> Logout
        </button>
      </aside>

      {/* MAIN VIEWPORT */}
      <main
        style={{
          flex: 1,
          minWidth: 0,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        {/* TOPBAR */}
        <header
          style={{
            height: 70,
            width: "100%",
            padding: "0 32px",
            background: "rgba(11, 16, 27, 0.85)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 40,
            boxSizing: "border-box",
          }}
        >
          {/* Mobile Toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              display: "none",
              background: "none",
              color: "#fff",
              padding: 8,
              cursor: "pointer",
              border: "none",
            }}
          >
            <Menu size={20} />
          </button>

          {/* Search Input */}
          <div style={{ position: "relative", width: 380, maxWidth: "100%" }}>
            <Search
              size={16}
              color="rgba(255,255,255,0.4)"
              style={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
            <input
              placeholder="Search anything..."
              style={{
                width: "100%",
                padding: "9px 16px 9px 42px",
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: 99,
                color: "#ffffff",
                fontSize: 13,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Right Action Icons */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Notification Bell with Badge */}
            <Link
              to={
                currentRole === "beekeeper"
                  ? "/beekeeper/alerts"
                  : "/qr-scanner"
              }
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                textDecoration: "none",
              }}
            >
              <Bell size={18} />
              <span
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "#f59e0b",
                  color: "#000",
                  fontSize: 10,
                  fontWeight: 900,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                2
              </span>
            </Link>

            {/* User Profile Pill */}
            <Link
              to={
                currentRole === "beekeeper"
                  ? "/beekeeper/profile"
                  : "/customer/profile"
              }
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "rgba(255, 255, 255, 0.06)",
                padding: "4px 14px 4px 4px",
                borderRadius: 99,
                border: "1px solid rgba(255, 255, 255, 0.12)",
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #f59e0b, #d97706)",
                  color: "#fff",
                  fontWeight: 900,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                }}
              >
                {userInitial}
              </div>
              <span style={{ fontSize: 13, fontWeight: 800, color: "#ffffff" }}>
                {userName}
              </span>
              <ChevronDown size={14} color="rgba(255,255,255,0.5)" />
            </Link>
          </div>
        </header>

        {/* Page Content Viewport */}
        <div
          className="dashboard-content-viewport"
          style={{
            padding: 28,
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
