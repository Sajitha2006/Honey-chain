import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Users,
  Lock,
  Droplet,
} from "lucide-react";
import Navbar from "../../components/common/Navbar";
import FloatingParticles from "../../components/common/animations/FloatingParticles";
import BeeSwarmAnimation from "../../components/common/animations/BeeSwarmAnimation";
import "./Landing.css";

const heroBgUrl = "/assets/hero_beekeeping_bg.png";
const beehiveUrl = "/assets/hero-beehive.png";

const FEATURE_HIGHLIGHTS = [
  {
    icon: ShieldCheck,
    title: "100% Transparent",
    desc: "Every transaction is recorded on blockchain",
  },
  {
    icon: Users,
    title: "Farmer Empowerment",
    desc: "Direct connections and fair value for farmers",
  },
  {
    icon: Droplet,
    title: "Quality Assured",
    desc: "Verified quality checks at every stage",
  },
  {
    icon: Lock,
    title: "Secure & Immutable",
    desc: "Data is tamper-proof and fully secure",
  },
];

const WORK_STEPS = [
  { icon: "🐝", title: "Bee & Hive", desc: "Natural collection by our bees" },
  { icon: "👨‍🌾", title: "Farmer", desc: "Harvested with care by our farmers" },
  {
    icon: "⚙️",
    title: "Processing",
    desc: "Quality checked & processed hygienically",
  },
  {
    icon: "🎲",
    title: "Blockchain",
    desc: "Every batch recorded on blockchain",
  },
  { icon: "🛒", title: "Buyer", desc: "Verified & trusted by buyers" },
  { icon: "👥", title: "Consumer", desc: "Pure honey delivered to your home" },
];

const Landing = () => {
  return (
    <div className="honey-landing">
      {/* Live Flying Bees Swarm Layer & Ambient Particles */}
      <BeeSwarmAnimation />
      <FloatingParticles count={25} />

      {/* Top Header Navbar */}
      <Navbar />

      {/* ─────────────────────────────────────────────────────────────
         1. HERO SECTION (Trust. Trace. Trade.)
      ───────────────────────────────────────────────────────────── */}
      <section
        className="hero-wrapper"
        style={{ paddingTop: 130, paddingBottom: 60 }}
      >
        <div className="landing-container">
          <div
            className="hero-content-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 48,
              alignItems: "center",
            }}
          >
            {/* Left Hero Column */}
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  color: "#f59e0b",
                  fontSize: 12,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  marginBottom: 20,
                }}
              >
                POWERED BY BLOCKCHAIN
              </div>

              <h1
                style={{
                  fontSize: 72,
                  fontWeight: 900,
                  lineHeight: 1.05,
                  color: "#ffffff",
                  margin: "0 0 24px 0",
                  letterSpacing: "-1.5px",
                }}
              >
                Trust.
                <br />
                Trace.
                <br />
                <span className="highlight-gold-text">Trade.</span>
              </h1>

              <p
                style={{
                  fontSize: 16,
                  color: "rgba(255, 255, 255, 0.75)",
                  maxWidth: 520,
                  lineHeight: 1.65,
                  margin: "0 0 32px 0",
                }}
              >
                HoneyChain brings transparency to the honey supply chain using
                blockchain technology. From hive to home, every drop is trusted.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 16,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Link
                  to="/customer/products"
                  className="btn-hero-amber"
                  style={{
                    padding: "14px 30px",
                    fontSize: 15,
                    fontWeight: 800,
                    borderRadius: 14,
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background:
                      "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                    boxShadow: "0 4px 25px rgba(245, 158, 11, 0.45)",
                    color: "#000000",
                  }}
                >
                  Explore Platform <ArrowRight size={18} />
                </Link>

              </div>
            </div>

            {/* Right Hero 3D Dripping Honey Dipper Graphic */}
            <div
              style={{
                position: "relative",
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: 460,
                  borderRadius: 32,
                  overflow: "hidden",
                  background:
                    "linear-gradient(135deg, #1f1406 0%, #362205 100%)",
                  border: "1px solid rgba(245, 158, 11, 0.3)",
                  boxShadow: "0 25px 60px rgba(0,0,0,0.8)",
                  position: "relative",
                }}
              >
                <img
                  src={heroBgUrl}
                  alt="3D Honey Dipper"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "radial-gradient(circle at 50% 50%, transparent 40%, rgba(11, 8, 5, 0.8) 100%)",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
             2. FOUR FEATURE HIGHLIGHTS CARDS BAR
          ───────────────────────────────────────────────────────────── */}
          <div
            className="card-3d"
            style={{
              marginTop: 60,
              background: "rgba(18, 14, 10, 0.85)",
              backdropFilter: "blur(20px)",
              borderRadius: 24,
              padding: "28px 36px",
              border: "1px solid rgba(245, 158, 11, 0.25)",
              boxShadow: "0 15px 40px rgba(0,0,0,0.6)",
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 24,
            }}
          >
            {FEATURE_HIGHLIGHTS.map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      background: "rgba(245, 158, 11, 0.12)",
                      border: "1px solid rgba(245, 158, 11, 0.3)",
                      color: "#f59e0b",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 14,
                    }}
                  >
                    <IconComp size={22} />
                  </div>
                  <h3
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      color: "#ffffff",
                      margin: "0 0 6px 0",
                    }}
                  >
                    {feat.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 12.5,
                      color: "rgba(255, 255, 255, 0.6)",
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
         3. HOW HONEYCHAIN WORKS (HEXAGONAL PROCESS FLOW)
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{ padding: "80px 0", position: "relative" }}
        id="how-it-works"
      >
        <div className="landing-container">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2
              style={{
                fontSize: 42,
                fontWeight: 900,
                color: "#ffffff",
                margin: "0 0 12px 0",
                letterSpacing: "-0.5px",
              }}
            >
              How <span className="highlight-gold-text">HoneyChain</span> Works
            </h2>
            <p
              style={{
                fontSize: 15,
                color: "rgba(255, 255, 255, 0.65)",
                margin: 0,
              }}
            >
              A transparent journey from hive to home
            </p>
          </div>

          {/* Hexagonal Process Flow Row */}
          <div
            style={{
              position: "relative",
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: 16,
              alignItems: "start",
            }}
          >
            {/* Connecting Glow Line */}
            <div
              style={{
                position: "absolute",
                top: 40,
                left: "8%",
                right: "8%",
                height: 2,
                background:
                  "linear-gradient(90deg, transparent 0%, #f59e0b 50%, transparent 100%)",
                boxShadow: "0 0 12px rgba(245,158,11,0.6)",
                zIndex: 1,
              }}
            />

            {WORK_STEPS.map((step, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  position: "relative",
                  zIndex: 2,
                }}
              >
                {/* Hexagon Node */}
                <div
                  style={{
                    width: 76,
                    height: 76,
                    background: "#16110c",
                    border: "2px solid rgba(245, 158, 11, 0.5)",
                    clipPath:
                      "polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                    marginBottom: 16,
                    boxShadow: "0 0 25px rgba(245, 158, 11, 0.35)",
                    transition: "transform 0.3s ease",
                  }}
                >
                  {step.icon}
                </div>

                <h4
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: "#ffffff",
                    margin: "0 0 6px 0",
                  }}
                >
                  {step.title}
                </h4>
                <p
                  style={{
                    fontSize: 12,
                    color: "rgba(255, 255, 255, 0.6)",
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
         4. TOGETHER FOR A TRANSPARENT AND SUSTAINABLE TOMORROW BANNER
      ───────────────────────────────────────────────────────────── */}
      <section style={{ padding: "40px 0 100px" }}>
        <div className="landing-container">
          <div
            className="card-3d"
            style={{
              background:
                "linear-gradient(135deg, rgba(20, 15, 10, 0.95) 0%, rgba(35, 24, 12, 0.85) 100%)",
              borderRadius: 32,
              padding: "40px 48px",
              border: "1px solid rgba(245, 158, 11, 0.35)",
              boxShadow: "0 25px 60px rgba(0,0,0,0.7)",
              display: "grid",
              gridTemplateColumns: "240px 1fr 240px",
              gap: 36,
              alignItems: "center",
            }}
          >
            {/* Left Honeycomb Macro Photo */}
            <div
              style={{
                width: "100%",
                height: 220,
                borderRadius: 24,
                overflow: "hidden",
                border: "1px solid rgba(245, 158, 11, 0.3)",
                boxShadow: "0 10px 30px rgba(245,158,11,0.2)",
              }}
            >
              <img
                src={beehiveUrl}
                alt="Honeycomb Macro"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            {/* Middle Content Column */}
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: "#f59e0b",
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  marginBottom: 12,
                }}
              >
                BUILDING A SWEETER FUTURE
              </div>
              <h2
                style={{
                  fontSize: 34,
                  fontWeight: 900,
                  color: "#ffffff",
                  margin: "0 0 20px 0",
                  lineHeight: 1.25,
                }}
              >
                Together for a{" "}
                <span className="highlight-gold-text">transparent</span> and{" "}
                <span className="highlight-gold-text">sustainable</span>{" "}
                tomorrow.
              </h2>
              <Link
                to="/customer/products"
                className="btn-hero-amber"
                style={{
                  padding: "12px 28px",
                  fontSize: 14,
                  fontWeight: 800,
                  borderRadius: 12,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background:
                    "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                  color: "#000",
                }}
              >
                Join the Movement 🛠
              </Link>
            </div>

            {/* Right Stats List */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 18,
                borderLeft: "1px solid rgba(255,255,255,0.1)",
                paddingLeft: 32,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ fontSize: 24 }}>🐝</div>
                <div>
                  <div
                    style={{ fontSize: 22, fontWeight: 900, color: "#ffffff" }}
                  >
                    500+
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.55)",
                      fontWeight: 600,
                    }}
                  >
                    Farmers Onboarded
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ fontSize: 24 }}>📦</div>
                <div>
                  <div
                    style={{ fontSize: 22, fontWeight: 900, color: "#f59e0b" }}
                  >
                    10K+
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.55)",
                      fontWeight: 600,
                    }}
                  >
                    Batches Verified
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ fontSize: 24 }}>🛡️</div>
                <div>
                  <div
                    style={{ fontSize: 22, fontWeight: 900, color: "#10b981" }}
                  >
                    98%
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.55)",
                      fontWeight: 600,
                    }}
                  >
                    Customer Trust
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
         5. FOOTER SECTION
      ───────────────────────────────────────────────────────────── */}
      <footer
        className="honey-footer"
        style={{
          borderTop: "1px solid rgba(245, 158, 11, 0.15)",
          background: "#060403",
          padding: "40px 0 24px",
        }}
      >
        <div className="landing-container">
          <div
            className="footer-top-row"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 28,
              flexWrap: "wrap",
              gap: 20,
            }}
          >
            {/* Logo */}
            <div
              className="footer-brand-logo"
              style={{ display: "flex", alignItems: "center", gap: 12 }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  background:
                    "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                  clipPath:
                    "polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                }}
              >
                🐝
              </div>
              <div>
                <div
                  style={{ fontSize: 18, fontWeight: 900, color: "#ffffff" }}
                >
                  HoneyChain
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
                  Trace • Trust • Trade
                </div>
              </div>
            </div>

            {/* Center Links */}
            <div
              style={{
                display: "flex",
                gap: 24,
                fontSize: 13,
                fontWeight: 600,
                color: "rgba(255,255,255,0.7)",
              }}
            >
              <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
                Home
              </Link>
              <a
                href="#about"
                style={{
                  color: "rgba(255,255,255,0.7)",
                  textDecoration: "none",
                }}
              >
                About
              </a>
              <a
                href="#how-it-works"
                style={{
                  color: "rgba(255,255,255,0.7)",
                  textDecoration: "none",
                }}
              >
                How It Works
              </a>
              <Link
                to="/customer/products"
                style={{
                  color: "rgba(255,255,255,0.7)",
                  textDecoration: "none",
                }}
              >
                Marketplace
              </Link>
              <a
                href="#about"
                style={{
                  color: "rgba(255,255,255,0.7)",
                  textDecoration: "none",
                }}
              >
                Contact
              </a>
            </div>

            {/* Right Launch App */}
            <Link
              to="/login"
              className="btn-primary"
              style={{
                padding: "8px 20px",
                borderRadius: 10,
                fontSize: 13,
                textDecoration: "none",
                background: "#f59e0b",
                color: "#000",
                fontWeight: 800,
              }}
            >
              Launch App
            </Link>
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: 20,
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12,
              color: "rgba(255,255,255,0.4)",
            }}
          >
            <div>© 2026 HoneyChain. All rights reserved.</div>
            <div>Built for Beekeepers & Conscious Honey Lovers.</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
