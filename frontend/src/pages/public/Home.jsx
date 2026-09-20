import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Activity,
  QrCode,
  ShoppingBag,
  Bell,
  Cpu,
  HeartPulse,
  ChevronDown,
  Play,
  Globe,
  Users,
  Award,
} from "lucide-react";

import SmartHive3D from "../../components/common/animations/SmartHive3D";
import DrippingHoneyEffect from "../../components/common/animations/DrippingHoneyEffect";
import TelemetryHUD from "../../comFponents/common/animations/TelemetryHUD";
import FloatingParticles from "../../components/common/animations/FloatingParticles";

const Home = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const user = auth?.user;

  const handleGetStarted = () => {
    if (user) {
      if (user.role === "beekeeper") {
        navigate("/beekeeper/dashboard");
      } else if (user.role === "customer") {
        navigate("/customer/dashboard");
      } else {
        navigate("/login");
      }
    } else {
      navigate("/register");
    }
  };

  const featureCards = [
    {
      icon: <Cpu size={28} color="#f59e0b" />,
      title: "IoT Telemetry Stream",
      desc: "Monitor temperature, humidity, and weight in real-time with smart ESP32 nodes.",
      badge: "Real-Time 24/7",
    },
    {
      icon: <Activity size={28} color="#c084fc" />,
      title: "AI Disease Vision",
      desc: "Upload honeycomb macro images to detect Varroa Mites & Foulbrood automatically.",
      badge: "FastAPI Vision AI",
    },
    {
      icon: <HeartPulse size={28} color="#10b981" />,
      title: "Colony Stress Analytics",
      desc: "Evaluate environmental stress shifts before colony collapse or swarm risk.",
      badge: "Predictive Analytics",
    },
    {
      icon: <Bell size={28} color="#f43f5e" />,
      title: "Instant Threshold Alerts",
      desc: "Receive real-time notifications whenever hive parameters breach safe thresholds.",
      badge: "Instant Push/SMS",
    },
    {
      icon: <ShoppingBag size={28} color="#fbbf24" />,
      title: "Pure Honey Marketplace",
      desc: "Beekeepers sell authentic honey products directly to conscious consumers.",
      badge: "Direct Farmer Sale",
    },
    {
      icon: <QrCode size={28} color="#38bdf8" />,
      title: "Public QR Traceability",
      desc: "Customers scan QR codes to verify harvest source, beekeeper, and hive health.",
      badge: "Chain of Custody",
    },
  ];

  const journeySteps = [
    {
      num: "01",
      icon: "🐝",
      title: "Bee & Hive",
      desc: "Natural collection by our bees",
    },
    {
      num: "02",
      icon: "👨‍🌾",
      title: "Beekeeper",
      desc: "Harvested with care by local farmers",
    },
    {
      num: "03",
      icon: "⚗️",
      title: "Processing",
      desc: "Cleaned and tested for quality",
    },
    {
      num: "04",
      icon: "⛓️",
      title: "Blockchain",
      desc: "Every batch recorded and immutable",
    },
    {
      num: "05",
      icon: "🛍️",
      title: "Marketplace",
      desc: "Available to consumers",
    },
    {
      num: "06",
      icon: "🏠",
      title: "Your Home",
      desc: "Pure, safe honey delivered to you",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#070a11",
        color: "#e2e8f0",
        position: "relative",
        overflowX: "hidden",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Background Radial Ambient Glows */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          right: "5%",
          width: 700,
          height: 700,
          background:
            "radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.05) 50%, transparent 80%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "-10%",
          width: 600,
          height: 600,
          background:
            "radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Floating Ambient Particles */}
      <FloatingParticles count={50} />

      {/* ==================================================
          1. HERO SECTION
      ================================================== */}
      <section
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "60px 24px 100px 24px",
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: 40,
          alignItems: "center",
          position: "relative",
          zIndex: 10,
        }}
        className="hero-grid-responsive"
      >
        {/* HERO LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "7px 18px",
              borderRadius: 99,
              background: "rgba(245, 158, 11, 0.1)",
              border: "1px solid rgba(245, 158, 11, 0.3)",
              color: "#f59e0b",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              marginBottom: 24,
              boxShadow: "0 0 20px rgba(245, 158, 11, 0.15)",
            }}
          >
            <span style={{ fontSize: 14 }}>🐝</span> AI + IoT SMART BEEKEEPING
            ECOSYSTEM
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: "clamp(38px, 5vw, 60px)",
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1.12,
              marginBottom: 24,
              letterSpacing: "-1.5px",
            }}
          >
            From Hive to Home,
            <br />
            Every Drop Has a{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #fef08a 0%, #f59e0b 50%, #d97706 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 0 40px rgba(245, 158, 11, 0.4)",
              }}
            >
              Story.
            </span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 17,
              color: "rgba(255, 255, 255, 0.72)",
              lineHeight: 1.7,
              marginBottom: 36,
              maxWidth: 560,
              fontWeight: 400,
            }}
          >
            Monitor your bee colonies using IoT micro-climate sensors, detect
            diseases using Computer Vision, and provide transparent QR
            authenticity from hive to jar.
          </p>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              marginBottom: 50,
            }}
          >
            <button
              onClick={handleGetStarted}
              style={{
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                color: "#ffffff",
                padding: "16px 36px",
                borderRadius: 16,
                fontWeight: 800,
                fontSize: 16,
                border: "none",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                boxShadow:
                  "0 10px 30px rgba(245, 158, 11, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2) inset",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 15px 40px rgba(245, 158, 11, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 10px 30px rgba(245, 158, 11, 0.4)";
              }}
            >
              Start Free Today <ArrowRight size={18} />
            </button>

            <button
              onClick={() => navigate("/login")}
              style={{
                background: "rgba(15, 23, 42, 0.8)",
                backdropFilter: "blur(12px)",
                color: "#ffffff",
                padding: "16px 32px",
                borderRadius: 16,
                fontWeight: 700,
                fontSize: 16,
                border: "1px solid rgba(255, 255, 255, 0.15)",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(245, 158, 11, 0.4)";
                e.currentTarget.style.background = "rgba(245, 158, 11, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
                e.currentTarget.style.background = "rgba(15, 23, 42, 0.8)";
              }}
            >
              Member Login
            </button>
          </div>

          {/* Stats Counters */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 16,
              paddingTop: 24,
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            }}
            className="stats-responsive-grid"
          >
            <div>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>
                500<span style={{ color: "#f59e0b" }}>+</span>
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.5)",
                  fontWeight: 600,
                }}
              >
                Active Beekeepers
              </div>
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>
                10K<span style={{ color: "#f59e0b" }}>+</span>
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.5)",
                  fontWeight: 600,
                }}
              >
                Hives Connected
              </div>
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>
                100<span style={{ color: "#f59e0b" }}>%</span>
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.5)",
                  fontWeight: 600,
                }}
              >
                Traceable Honey
              </div>
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>
                25<span style={{ color: "#f59e0b" }}>+</span>
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.5)",
                  fontWeight: 600,
                }}
              >
                Locations
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginTop: 32,
              opacity: 0.6,
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ChevronDown size={14} color="#f59e0b" />
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              Scroll to explore
            </span>
          </div>
        </motion.div>

        {/* HERO RIGHT 3D SCENE & HUD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{
            position: "relative",
            minHeight: 480,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Volumetric Soft Golden Glow behind hive */}
          <div
            style={{
              position: "absolute",
              width: 380,
              height: 380,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(245, 158, 11, 0.35) 0%, rgba(217, 119, 6, 0.1) 60%, transparent 100%)",
              filter: "blur(40px)",
              pointerEvents: "none",
            }}
          />

          {/* Calligraphy Accents */}
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 0,
              fontFamily: "'Georgia', serif",
              fontStyle: "italic",
              color: "rgba(253, 224, 71, 0.7)",
              fontSize: 16,
              letterSpacing: 0.5,
              pointerEvents: "none",
              zIndex: 15,
              textShadow: "0 0 10px rgba(245, 158, 11, 0.4)",
            }}
          >
            "Healthier Bees, Brighter Tomorrows"
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 10,
              right: -10,
              fontFamily: "'Georgia', serif",
              fontStyle: "italic",
              color: "rgba(253, 224, 71, 0.7)",
              fontSize: 15,
              letterSpacing: 0.5,
              pointerEvents: "none",
              zIndex: 15,
              textShadow: "0 0 10px rgba(245, 158, 11, 0.4)",
            }}
          >
            "Nature Monitored, Purity Delivered."
          </div>

          {/* 3D Smart Hive Canvas */}
          <div style={{ width: "100%", height: 480, position: "relative" }}>
            <SmartHive3D />
            <DrippingHoneyEffect />
          </div>

          {/* Floating Glass Telemetry HUD Card */}
          <div
            style={{ position: "absolute", bottom: -20, right: -10 }}
            className="hud-responsive-pos"
          >
            <TelemetryHUD />
          </div>
        </motion.div>
      </section>

      {/* ==================================================
          2. FEATURES SECTION
      ================================================== */}
      <section
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "100px 24px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 60,
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                color: "#f59e0b",
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              ✦ PLATFORM FEATURES
            </div>
            <h2
              style={{
                fontSize: "clamp(30px, 4vw, 44px)",
                fontWeight: 900,
                color: "#fff",
                lineHeight: 1.2,
                letterSpacing: "-1px",
              }}
            >
              Everything You Need for
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #fef08a 0%, #f59e0b 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Smart Beekeeping
              </span>
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: 16,
                maxWidth: 540,
                marginTop: 12,
              }}
            >
              From IoT monitoring to AI disease detection, manage your entire
              beekeeping operation in one powerful platform.
            </p>
          </div>

          <button
            onClick={() => navigate("/customer/products")}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(245,158,11,0.3)",
              color: "#f59e0b",
              padding: "12px 24px",
              borderRadius: 99,
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.2s ease",
            }}
          >
            View All Features <ArrowRight size={16} />
          </button>
        </div>

        {/* 6 Features Glass Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: 28,
          }}
        >
          {featureCards.map((feat, index) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{
                background: "rgba(15, 23, 42, 0.75)",
                backdropFilter: "blur(20px)",
                borderRadius: 24,
                padding: 32,
                border: "1px solid rgba(255, 255, 255, 0.08)",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              className="feature-glass-card"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.borderColor = "rgba(245, 158, 11, 0.4)";
                e.currentTarget.style.boxShadow =
                  "0 20px 40px rgba(0,0,0,0.5), 0 0 25px rgba(245,158,11,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Badge */}
              <div
                style={{
                  position: "absolute",
                  top: 24,
                  right: 24,
                  fontSize: 10,
                  fontWeight: 800,
                  color: "#f59e0b",
                  background: "rgba(245,158,11,0.12)",
                  padding: "4px 12px",
                  borderRadius: 99,
                  border: "1px solid rgba(245,158,11,0.25)",
                }}
              >
                {feat.badge}
              </div>

              {/* Icon Container */}
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: "rgba(245,158,11,0.1)",
                  border: "1px solid rgba(245,158,11,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 24,
                }}
              >
                {feat.icon}
              </div>

              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#fff",
                  marginBottom: 12,
                  letterSpacing: "-0.3px",
                }}
              >
                {feat.title}
              </h3>

              <p
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.65)",
                  lineHeight: 1.6,
                  margin: 0,
                  marginBottom: 24,
                }}
              >
                {feat.desc}
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: "#f59e0b",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                <span>Explore capability</span>
                <ArrowRight size={14} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==================================================
          3. A TRANSPARENT JOURNEY (HOW IT WORKS)
      ================================================== */}
      <section
        id="how-it-works"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "80px 24px 100px 24px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              color: "#f59e0b",
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            ✦ END-TO-END PROCESS
          </div>
          <h2
            style={{
              fontSize: "clamp(30px, 4vw, 44px)",
              fontWeight: 900,
              color: "#fff",
              marginBottom: 16,
            }}
          >
            A <span style={{ color: "#f59e0b" }}>Transparent</span> Journey
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: 16,
              maxWidth: 560,
              margin: "0 auto",
            }}
          >
            Every jar of honey has a story. We make it visible.
          </p>
        </div>

        {/* Horizontal Node Steps */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 20,
            position: "relative",
          }}
          className="journey-grid-responsive"
        >
          {journeySteps.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              style={{
                background: "rgba(15, 23, 42, 0.6)",
                backdropFilter: "blur(16px)",
                borderRadius: 20,
                padding: 24,
                border: "1px solid rgba(255, 255, 255, 0.08)",
                textAlign: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "rgba(245, 158, 11, 0.15)",
                  border: "1px solid rgba(245, 158, 11, 0.4)",
                  color: "#f59e0b",
                  fontSize: 12,
                  fontWeight: 900,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px auto",
                }}
              >
                {step.num}
              </div>

              <div style={{ fontSize: 36, marginBottom: 12 }}>{step.icon}</div>
              <h4
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#fff",
                  marginBottom: 8,
                }}
              >
                {step.title}
              </h4>
              <p
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.6)",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==================================================
          4. TRUST & BEEKEEPER TESTIMONIAL STORY
      ================================================== */}
      <section
        id="about"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "80px 24px 120px 24px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr 1fr",
            gap: 28,
            alignItems: "center",
          }}
          className="trust-responsive-grid"
        >
          {/* Story Card */}
          <div
            style={{
              background: "rgba(15, 23, 42, 0.8)",
              borderRadius: 24,
              padding: 24,
              border: "1px solid rgba(245, 158, 11, 0.2)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: 180,
                borderRadius: 16,
                background:
                  "linear-gradient(135deg, rgba(245,158,11,0.3) 0%, rgba(120,53,15,0.8) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  background: "#f59e0b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 25px rgba(245,158,11,0.8)",
                  cursor: "pointer",
                }}
              >
                <Play
                  size={20}
                  color="#fff"
                  fill="#fff"
                  style={{ marginLeft: 3 }}
                />
              </div>
              <span
                style={{
                  color: "#fff",
                  fontWeight: 800,
                  marginTop: 14,
                  fontSize: 14,
                }}
              >
                Watch Our Story
              </span>
            </div>
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.7)",
                margin: "16px 0 0 0",
                textAlign: "center",
              }}
            >
              See how IoT micro-sensors protect vulnerable bee colonies across
              regions.
            </p>
          </div>

          {/* Beekeeper Testimonial Quote */}
          <div style={{ textAlign: "center", padding: "0 20px" }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: "#f59e0b",
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              TRUSTED BY BEEKEEPERS & CONSUMERS
            </div>
            <blockquote
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1.5,
                margin: "0 0 24px 0",
                fontStyle: "italic",
              }}
            >
              “HoneyChain has transformed how we manage our hives and reach
              customers. Truly a game changer!”
            </blockquote>
            <div style={{ fontWeight: 800, color: "#fff", fontSize: 16 }}>
              Ramesh Kumar
            </div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
              Master Beekeeper, Tamil Nadu Apiary
            </div>
          </div>

          {/* Empowered Stats Card */}
          <div
            style={{
              background: "rgba(15, 23, 42, 0.8)",
              borderRadius: 24,
              padding: 30,
              border: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: "rgba(245,158,11,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Users size={20} color="#f59e0b" />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>
                  500+
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                  Beekeepers Empowered
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: "rgba(59,130,246,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Cpu size={20} color="#60a5fa" />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>
                  10K+
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                  Hives Monitored
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: "rgba(16,185,129,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Award size={20} color="#34d399" />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>
                  100%
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                  Traceable Honey
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: "rgba(168,85,247,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Globe size={20} color="#c084fc" />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>
                  25+
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                  Cities & Rural Locations
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          5. CTA BANNER
      ================================================== */}
      <section
        style={{
          maxWidth: 1240,
          margin: "0 auto 100px auto",
          padding: "0 24px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(180,83,9,0.3) 100%)",
            backdropFilter: "blur(20px)",
            borderRadius: 32,
            padding: "60px 40px",
            textAlign: "center",
            border: "1px solid rgba(245,158,11,0.4)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 900,
              color: "#fff",
              marginBottom: 16,
            }}
          >
            Start Your Honey Chain Journey Today
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.8)",
              maxWidth: 580,
              margin: "0 auto 36px auto",
            }}
          >
            Join as a beekeeper to monitor your hives and sell verified honey,
            or as a customer to buy traceable, authentic honey.
          </p>

          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={handleGetStarted}
              style={{
                background: "#ffffff",
                color: "#78350f",
                padding: "16px 36px",
                borderRadius: 16,
                fontWeight: 800,
                fontSize: 16,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
              }}
            >
              🐝 Join as Beekeeper
            </button>

            <button
              onClick={() => navigate("/customer/products")}
              style={{
                background: "rgba(255,255,255,0.15)",
                color: "#ffffff",
                padding: "16px 36px",
                borderRadius: 16,
                fontWeight: 700,
                fontSize: 16,
                border: "1px solid rgba(255,255,255,0.3)",
                cursor: "pointer",
              }}
            >
              🛒 Shop as Customer
            </button>
          </div>
        </div>
      </section>

      {/* ==================================================
          6. FOOTER
      ================================================== */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(7, 10, 17, 0.95)",
          padding: "60px 24px 40px 24px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 28 }}>🍯</span>
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>
                Honey <span style={{ color: "#f59e0b" }}>Chain</span>
              </div>
              <p
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: 11,
                  margin: 0,
                }}
              >
                Smart Beekeeping & Traceability Ecosystem
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 24,
              fontSize: 14,
              color: "rgba(255,255,255,0.6)",
            }}
          >
            <Link to="/" style={{ color: "#fff" }}>
              Home
            </Link>
            <a href="#about" style={{ color: "inherit" }}>
              About
            </a>
            <a href="#how-it-works" style={{ color: "inherit" }}>
              How It Works
            </a>
            <Link to="/customer/products" style={{ color: "inherit" }}>
              Marketplace
            </Link>
            <Link to="/qr-scanner" style={{ color: "inherit" }}>
              Verify Honey
            </Link>
          </div>

          <p
            style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, margin: 0 }}
          >
            © 2026 Honey Chain. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
