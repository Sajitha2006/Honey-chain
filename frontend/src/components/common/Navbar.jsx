import { useContext, useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Menu, X,  } from "lucide-react";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const close = () => setMenuOpen(false);

  return (
    <nav
      className="public-navbar"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: scrolled
          ? "rgba(11, 8, 5, 0.95)"
          : "rgba(11, 8, 5, 0.75)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(245, 158, 11, 0.15)",
        transition: "all 0.3s ease",
        padding: "14px 0",
      }}
    >
      <div
        className="public-navbar-inner"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <Link to="/" className="nav-logo" onClick={close} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
          <div
            style={{
              width: 40,
              height: 40,
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              clipPath: "polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              boxShadow: "0 0 20px rgba(245, 158, 11, 0.5)",
            }}
          >
            
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#ffffff", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              HoneyChain
            </div>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, margin: 0, fontWeight: 600, letterSpacing: "1px" }}>
              Trace • Trust • Trade
            </p>
          </div>
        </Link>

        {/* Desktop Links */}
        <div
          className="nav-links"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 32,
          }}
        >
          <NavLink
            to="/"
            end
            style={({ isActive }) => ({
              color: isActive ? "#f59e0b" : "rgba(255,255,255,0.75)",
              fontWeight: 600,
              fontSize: 14,
              transition: "all 0.2s ease",
              position: "relative",
              paddingBottom: 4,
              borderBottom: isActive ? "2px solid #f59e0b" : "2px solid transparent",
            })}
          >
            Home
          </NavLink>
          <a
            href="/#how-it-works"
            style={{
              color: "rgba(255,255,255,0.75)",
              fontWeight: 600,
              fontSize: 14,
              transition: "all 0.2s ease",
            }}
          >
            How It Works
          </a>
          <Link
            to="/qr-scanner"
            style={{
              color: "rgba(255,255,255,0.75)",
              fontWeight: 600,
              fontSize: 14,
              transition: "all 0.2s ease",
            }}
          >
            Trace Honey
          </Link>
          <Link
            to="/customer/products"
            style={{
              color: "rgba(255,255,255,0.75)",
              fontWeight: 600,
              fontSize: 14,
              transition: "all 0.2s ease",
            }}
          >
            Marketplace
          </Link>
          <a
            href="/#about"
            style={{
              color: "rgba(255,255,255,0.75)",
              fontWeight: 600,
              fontSize: 14,
              transition: "all 0.2s ease",
            }}
          >
            About
          </a>
        </div>

        {/* Desktop CTA */}
        <div className="nav-cta" style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {isAuthenticated ? (
            <>
              <Link
                to={user?.role === "beekeeper" ? "/beekeeper/dashboard" : "/customer/dashboard"}
                style={{
                  background: "rgba(18, 14, 10, 0.8)",
                  border: "1px solid rgba(245,158,11,0.5)",
                  color: "#ffffff",
                  padding: "9px 22px",
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 14,
                  transition: "all 0.2s ease",
                  boxShadow: "0 0 15px rgba(245, 158, 11, 0.15)",
                }}
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                  color: "#ffffff",
                  padding: "9px 22px",
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 14,
                  boxShadow: "0 0 20px rgba(245, 158, 11, 0.4)",
                  transition: "all 0.2s ease",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  background: "rgba(18, 14, 10, 0.8)",
                  border: "1px solid rgba(245, 158, 11, 0.4)",
                  color: "#ffffff",
                  padding: "9px 20px",
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 14,
                  transition: "all 0.2s ease",
                }}
              >
                Dashboard
              </Link>
              <Link
                to="/login"
                style={{
                  background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                  color: "#ffffff",
                  padding: "9px 22px",
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 14,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  boxShadow: "0 0 20px rgba(245, 158, 11, 0.4)",
                  transition: "all 0.2s ease",
                }}
              >
                Login
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{ background: "transparent", color: "#fff", display: "none" }}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="mobile-nav"
          style={{
            background: "rgba(11, 8, 5, 0.98)",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            borderBottom: "1px solid rgba(245,158,11,0.2)",
          }}
        >
          <NavLink to="/" onClick={close} style={{ color: "#fff", fontWeight: 600, fontSize: 16 }}>
            Home
          </NavLink>
          <a href="/#how-it-works" onClick={close} style={{ color: "#fff", fontWeight: 600, fontSize: 16 }}>
            How It Works
          </a>
          <Link to="/qr-scanner" onClick={close} style={{ color: "#fff", fontWeight: 600, fontSize: 16 }}>
            Trace Honey
          </Link>
          <Link to="/customer/products" onClick={close} style={{ color: "#fff", fontWeight: 600, fontSize: 16 }}>
            Marketplace
          </Link>
          <a href="/#about" onClick={close} style={{ color: "#fff", fontWeight: 600, fontSize: 16 }}>
            About
          </a>

          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <Link
              to="/login"
              onClick={close}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "12px",
                borderRadius: 10,
                background: "rgba(255,255,255,0.1)",
                color: "#fff",
                fontWeight: 700,
              }}
            >
              Dashboard
            </Link>
            <Link
              to="/login"
              onClick={close}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "12px",
                borderRadius: 10,
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                color: "#fff",
                fontWeight: 700,
              }}
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;