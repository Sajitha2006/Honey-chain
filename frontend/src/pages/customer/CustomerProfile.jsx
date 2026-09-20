import { useContext, useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import { updateProfile } from "../../api/authApi";

import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  ShieldCheck,
  Calendar,
  Award,
  Save,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  ShoppingBag,
  QrCode,
  Activity,
} from "lucide-react";

const CustomerProfile = () => {
  const { user, login: updateContext } = useContext(AuthContext);

  const [name, setName] = useState(user?.name || "JAGADEESH P");
  const [email, setEmail] = useState(
    user?.email || "jagadeeshp@example.com"
  );
  const [phone, setPhone] = useState(
    user?.phone || "+91 9876543210"
  );
  const [location, setLocation] = useState(
    user?.location || "Chennai, Tamil Nadu"
  );

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  /* =========================================================
     ANIMATION STYLES
  ========================================================= */

  useEffect(() => {
    const styleId = "customer-profile-styles";

    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;

    style.innerHTML = `
      @keyframes customerFadeUp {
        from {
          opacity: 0;
          transform: translateY(18px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes customerFadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes customerGradient {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }

      @keyframes customerPulse {
        0%,
        100% {
          box-shadow:
            0 0 0 0 rgba(16, 185, 129, 0.35);
        }

        50% {
          box-shadow:
            0 0 0 8px rgba(16, 185, 129, 0);
        }
      }

      @keyframes goldPulse {
        0%,
        100% {
          box-shadow:
            0 0 0 0 rgba(245, 158, 11, 0.15);
        }

        50% {
          box-shadow:
            0 0 0 8px rgba(245, 158, 11, 0);
        }
      }

      @keyframes spinCustomer {
        from {
          transform: rotate(0deg);
        }

        to {
          transform: rotate(360deg);
        }
      }

      .customer-profile-card {
        transition:
          transform 0.3s ease,
          border-color 0.3s ease,
          box-shadow 0.3s ease;
      }

      .customer-profile-card:hover {
        transform: translateY(-3px);
        border-color: rgba(245, 158, 11, 0.25) !important;
        box-shadow:
          0 20px 50px rgba(0, 0, 0, 0.28),
          0 0 35px rgba(245, 158, 11, 0.05);
      }

      .customer-stat {
        transition:
          transform 0.25s ease,
          background 0.25s ease,
          border-color 0.25s ease;
      }

      .customer-stat:hover {
        transform: translateX(4px);
        background: rgba(245, 158, 11, 0.06) !important;
        border-color: rgba(245, 158, 11, 0.18) !important;
      }

      .customer-input {
        transition:
          border-color 0.2s ease,
          box-shadow 0.2s ease,
          background 0.2s ease;
      }

      .customer-input:focus {
        outline: none;
        border-color: rgba(245, 158, 11, 0.65) !important;
        background: rgba(15, 23, 42, 0.95) !important;
        box-shadow:
          0 0 0 3px rgba(245, 158, 11, 0.09),
          0 0 20px rgba(245, 158, 11, 0.05);
      }

      .customer-save-btn {
        transition:
          transform 0.2s ease,
          box-shadow 0.2s ease,
          filter 0.2s ease;
      }

      .customer-save-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        filter: brightness(1.06);
        box-shadow:
          0 10px 35px rgba(245, 158, 11, 0.42) !important;
      }

      .customer-save-btn:active:not(:disabled) {
        transform: translateY(0);
      }

      .customer-save-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      @media (max-width: 900px) {
        .customer-profile-grid {
          grid-template-columns: 1fr !important;
        }

        .customer-form-row {
          grid-template-columns: 1fr !important;
        }
      }

      @media (max-width: 600px) {
        .customer-profile-container {
          padding: 0 !important;
        }

        .customer-profile-card-inner {
          padding: 20px !important;
        }
      }
    `;

    document.head.appendChild(style);

    return () => {
      const existing = document.getElementById(styleId);
      if (existing) {
        existing.remove();
      }
    };
  }, []);

  /* =========================================================
     USER DATA
  ========================================================= */

  const userInitial = name?.charAt(0)?.toUpperCase() || "J";

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
      })
    : "May 2024";

  /* =========================================================
     SAVE PROFILE
  ========================================================= */

  const handleSave = async (e) => {
    e.preventDefault();

    setSaving(true);
    setSuccess("");
    setError("");

    const payload = {
      name,
      email,
      phone,
      location,
    };

    if (password) {
      payload.password = password;
    }

    try {
      const res = await updateProfile(payload);

      const updatedUser =
        res.data?.user ||
        res.data || {
          ...user,
          ...payload,
        };

      const token = localStorage.getItem("token");

      if (token) {
        updateContext(updatedUser, token);
      }

      setSuccess("Profile updated successfully!");
      setPassword("");

      setTimeout(() => {
        setSuccess("");
      }, 4000);
    } catch (err) {
      console.error("Profile update error:", err);

      // Preserve existing fallback behaviour
      const token = localStorage.getItem("token");

      if (token) {
        updateContext(
          {
            ...user,
            name,
            email,
            phone,
            location,
          },
          token
        );
      }

      setSuccess("Profile updated!");
      setPassword("");

      setTimeout(() => {
        setSuccess("");
      }, 4000);
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     QUICK STATS
  ========================================================= */

  const quickStats = [
    {
      label: "Role",
      value: "Customer",
      icon: <User size={16} />,
      color: "#f59e0b",
    },
    {
      label: "Member Since",
      value: memberSince,
      icon: <Calendar size={16} />,
      color: "#3b82f6",
    },
    {
      label: "Account Status",
      value: "Verified",
      icon: <ShieldCheck size={16} />,
      color: "#10b981",
    },
    {
      label: "Membership",
      value: "Premium",
      icon: <Award size={16} />,
      color: "#8b5cf6",
    },
  ];

  return (
    <DashboardLayout
      pageTitle="Profile"
      pageSubtitle="Manage your HoneyChain customer account."
    >
      <div
        className="customer-profile-container"
        style={{
          width: "100%",
          maxWidth: 1180,
          margin: "0 auto",
          padding: "4px 0 40px",
        }}
      >
        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <div
          style={{
            marginBottom: 24,
            animation: "customerFadeUp 0.45s ease both",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 12px",
              borderRadius: 99,
              background: "rgba(245,158,11,0.08)",
              border: "1px solid rgba(245,158,11,0.22)",
              color: "#f59e0b",
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: 1,
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            <span>🍯</span>
            HoneyChain Account
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
            My Profile
          </h1>

          <p
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.5)",
              margin: "6px 0 0",
            }}
          >
            Manage your personal information and account security.
          </p>
        </div>

        {/* =====================================================
            SUCCESS MESSAGE
        ===================================================== */}

        {success && (
          <div
            style={{
              marginBottom: 20,
              padding: "14px 18px",
              borderRadius: 14,
              background: "rgba(16,185,129,0.08)",
              border: "1px solid rgba(16,185,129,0.28)",
              color: "#6ee7b7",
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 13,
              fontWeight: 700,
              animation: "customerFadeUp 0.3s ease both",
            }}
          >
            <CheckCircle size={18} />
            {success}
          </div>
        )}

        {/* =====================================================
            ERROR MESSAGE
        ===================================================== */}

        {error && (
          <div
            style={{
              marginBottom: 20,
              padding: "14px 18px",
              borderRadius: 14,
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.28)",
              color: "#fca5a5",
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 13,
              fontWeight: 700,
              animation: "customerFadeUp 0.3s ease both",
            }}
          >
            <AlertTriangle size={18} />
            {error}
          </div>
        )}

        {/* =====================================================
            MAIN GRID
        ===================================================== */}

        <div
          className="customer-profile-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "330px minmax(0, 1fr)",
            gap: 24,
            alignItems: "start",
          }}
        >
          {/* ===================================================
              LEFT PROFILE CARD
          =================================================== */}

          <div
            className="customer-profile-card"
            style={{
              background: "rgba(8,14,21,0.78)",
              borderRadius: 24,
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(18px)",
              overflow: "hidden",
              animation: "customerFadeUp 0.5s ease both",
            }}
          >
            {/* GOLD BANNER */}

            <div
              style={{
                height: 105,
                position: "relative",
                overflow: "hidden",
                background:
                  "linear-gradient(135deg, #f59e0b 0%, #d97706 45%, #713f12 100%)",
                backgroundSize: "200% 200%",
                animation: "customerGradient 7s ease infinite",
              }}
            >
              {/* Honeycomb pattern */}

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0.18,
                  backgroundImage: `
                    radial-gradient(
                      circle at 25% 30%,
                      rgba(255,255,255,0.35) 0 2px,
                      transparent 3px
                    ),
                    radial-gradient(
                      circle at 70% 70%,
                      rgba(0,0,0,0.25) 0 2px,
                      transparent 3px
                    )
                  `,
                  backgroundSize: "32px 32px",
                }}
              />

              {/* Glow */}

              <div
                style={{
                  position: "absolute",
                  width: 180,
                  height: 180,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.15)",
                  filter: "blur(45px)",
                  right: -40,
                  top: -80,
                }}
              />
            </div>

            {/* AVATAR */}

            <div
              style={{
                textAlign: "center",
                marginTop: -48,
                position: "relative",
                zIndex: 2,
                padding: "0 24px",
              }}
            >
              <div
                style={{
                  width: 92,
                  height: 92,
                  borderRadius: "50%",
                  margin: "0 auto",
                  background:
                    "linear-gradient(145deg, #182235 0%, #070b12 100%)",
                  border: "4px solid #0b111a",
                  boxShadow:
                    "0 8px 30px rgba(0,0,0,0.55), 0 0 25px rgba(245,158,11,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 36,
                  fontWeight: 900,
                  color: "#f59e0b",
                  position: "relative",
                  animation: "goldPulse 3s infinite",
                }}
              >
                {userInitial}

                {/* Online indicator */}

                <div
                  style={{
                    position: "absolute",
                    right: 1,
                    bottom: 2,
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: "#10b981",
                    border: "3px solid #0b111a",
                    animation: "customerPulse 2s infinite",
                  }}
                />
              </div>

              <h2
                style={{
                  color: "#fff",
                  fontSize: 21,
                  fontWeight: 900,
                  margin: "15px 0 4px",
                  letterSpacing: "-0.4px",
                }}
              >
                {name}
              </h2>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 13px",
                  borderRadius: 99,
                  background: "rgba(245,158,11,0.1)",
                  border: "1px solid rgba(245,158,11,0.2)",
                  color: "#f59e0b",
                  fontSize: 11,
                  fontWeight: 800,
                  marginBottom: 5,
                }}
              >
                🍯 Customer
              </div>

              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.4)",
                  marginBottom: 22,
                }}
              >
                HoneyChain member since {memberSince}
              </div>
            </div>

            {/* QUICK STATS */}

            <div
              style={{
                padding: "0 20px 22px",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,0.35)",
                  fontWeight: 800,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Account Overview
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {quickStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="customer-stat"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "11px 13px",
                      borderRadius: 12,
                      background: "rgba(255,255,255,0.025)",
                      border: "1px solid rgba(255,255,255,0.055)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 9,
                      }}
                    >
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 9,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: `${stat.color}12`,
                          border: `1px solid ${stat.color}25`,
                          color: stat.color,
                        }}
                      >
                        {stat.icon}
                      </div>

                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: "rgba(255,255,255,0.48)",
                        }}
                      >
                        {stat.label}
                      </span>
                    </div>

                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 800,
                        color: "#fff",
                      }}
                    >
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CUSTOMER BENEFITS */}

            <div
              style={{
                margin: "0 20px 20px",
                padding: 16,
                borderRadius: 15,
                background:
                  "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.02))",
                border: "1px solid rgba(245,158,11,0.12)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  marginBottom: 8,
                }}
              >
                <ShoppingBag size={16} color="#f59e0b" />

                <span
                  style={{
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  HoneyChain Customer
                </span>
              </div>

              <p
                style={{
                  margin: 0,
                  color: "rgba(255,255,255,0.45)",
                  fontSize: 10,
                  lineHeight: 1.6,
                }}
              >
                Discover authentic honey, verify product origins and
                trace every drop from hive to jar.
              </p>
            </div>
          </div>

          {/* ===================================================
              RIGHT EDIT PROFILE CARD
          =================================================== */}

          <div
            className="customer-profile-card"
            style={{
              background: "rgba(8,14,21,0.78)",
              borderRadius: 24,
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(18px)",
              overflow: "hidden",
              animation: "customerFadeUp 0.55s ease 0.08s both",
            }}
          >
            {/* FORM HEADER */}

            <div
              style={{
                padding: "22px 28px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
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
                    width: 42,
                    height: 42,
                    borderRadius: 13,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(245,158,11,0.1)",
                    border: "1px solid rgba(245,158,11,0.22)",
                  }}
                >
                  <User size={19} color="#f59e0b" />
                </div>

                <div>
                  <h3
                    style={{
                      margin: 0,
                      color: "#fff",
                      fontSize: 17,
                      fontWeight: 850,
                    }}
                  >
                    Personal Information
                  </h3>

                  <span
                    style={{
                      fontSize: 11,
                      color: "rgba(255,255,255,0.38)",
                    }}
                  >
                    Update your HoneyChain account details
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: "#10b981",
                  fontSize: 10,
                  fontWeight: 800,
                  padding: "6px 10px",
                  borderRadius: 99,
                  background: "rgba(16,185,129,0.08)",
                  border: "1px solid rgba(16,185,129,0.18)",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#10b981",
                  }}
                />
                VERIFIED
              </div>
            </div>

            {/* FORM */}

            <form
              onSubmit={handleSave}
              className="customer-profile-card-inner"
              style={{
                padding: 28,
              }}
            >
              {/* NAME + EMAIL */}

              <div
                className="customer-form-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 18,
                  marginBottom: 18,
                }}
              >
                {/* NAME */}

                <div>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      color: "rgba(255,255,255,0.5)",
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: 0.5,
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    <User size={13} />
                    Full Name
                  </label>

                  <input
                    className="customer-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "13px 15px",
                      borderRadius: 12,
                      border: "1px solid rgba(255,255,255,0.09)",
                      background: "rgba(5,10,17,0.72)",
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  />
                </div>

                {/* EMAIL */}

                <div>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      color: "rgba(255,255,255,0.5)",
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: 0.5,
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    <Mail size={13} />
                    Email
                  </label>

                  <input
                    className="customer-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "13px 15px",
                      borderRadius: 12,
                      border: "1px solid rgba(255,255,255,0.09)",
                      background: "rgba(5,10,17,0.72)",
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  />
                </div>
              </div>

              {/* PHONE + LOCATION */}

              <div
                className="customer-form-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 18,
                  marginBottom: 22,
                }}
              >
                {/* PHONE */}

                <div>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      color: "rgba(255,255,255,0.5)",
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: 0.5,
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    <Phone size={13} />
                    Phone
                  </label>

                  <input
                    className="customer-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone"
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "13px 15px",
                      borderRadius: 12,
                      border: "1px solid rgba(255,255,255,0.09)",
                      background: "rgba(5,10,17,0.72)",
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  />
                </div>

                {/* LOCATION */}

                <div>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      color: "rgba(255,255,255,0.5)",
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: 0.5,
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    <MapPin size={13} />
                    Location
                  </label>

                  <input
                    className="customer-input"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, State"
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "13px 15px",
                      borderRadius: 12,
                      border: "1px solid rgba(255,255,255,0.09)",
                      background: "rgba(5,10,17,0.72)",
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  />
                </div>
              </div>

              {/* DIVIDER */}

              <div
                style={{
                  height: 1,
                  background: "rgba(255,255,255,0.06)",
                  margin: "8px 0 24px",
                }}
              />

              {/* SECURITY HEADER */}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  marginBottom: 15,
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(245,158,11,0.08)",
                    border: "1px solid rgba(245,158,11,0.18)",
                  }}
                >
                  <Lock size={15} color="#f59e0b" />
                </div>

                <div>
                  <div
                    style={{
                      color: "#fff",
                      fontSize: 14,
                      fontWeight: 800,
                    }}
                  >
                    Security
                  </div>

                  <div
                    style={{
                      color: "rgba(255,255,255,0.35)",
                      fontSize: 10,
                      marginTop: 2,
                    }}
                  >
                    Leave blank to keep your current password
                  </div>
                </div>
              </div>

              {/* PASSWORD */}

              <div
                style={{
                  position: "relative",
                  marginBottom: 26,
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "rgba(255,255,255,0.5)",
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  <Lock size={13} />
                  New Password
                </label>

                <div
                  style={{
                    position: "relative",
                  }}
                >
                  <input
                    className="customer-input"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password..."
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "13px 48px 13px 15px",
                      borderRadius: 12,
                      border: "1px solid rgba(255,255,255,0.09)",
                      background: "rgba(5,10,17,0.72)",
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      border: "none",
                      background: "transparent",
                      color: "rgba(255,255,255,0.4)",
                      cursor: "pointer",
                      padding: 5,
                    }}
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              {/* ACCOUNT SECURITY INFO */}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 14px",
                  borderRadius: 12,
                  background: "rgba(16,185,129,0.05)",
                  border: "1px solid rgba(16,185,129,0.12)",
                  marginBottom: 20,
                }}
              >
                <ShieldCheck size={17} color="#10b981" />

                <span
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.55)",
                    lineHeight: 1.5,
                  }}
                >
                  Your account information is protected by
                  HoneyChain security.
                </span>
              </div>

              {/* SAVE BUTTON */}

              <button
                type="submit"
                disabled={saving}
                className="customer-save-btn"
                style={{
                  width: "100%",
                  padding: "14px 22px",
                  borderRadius: 14,
                  border: "none",
                  background:
                    "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                  color: "#090d16",
                  fontSize: 14,
                  fontWeight: 900,
                  cursor: saving ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 9,
                  boxShadow:
                    "0 5px 25px rgba(245,158,11,0.28)",
                }}
              >
                {saving ? (
                  <>
                    <Activity
                      size={17}
                      style={{
                        animation:
                          "spinCustomer 1s linear infinite",
                      }}
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={17} />
                    Save Changes
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* =====================================================
            BOTTOM CUSTOMER INFO CARDS
        ===================================================== */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginTop: 20,
            animation: "customerFadeUp 0.6s ease 0.15s both",
          }}
        >
          <div
            className="customer-profile-card"
            style={{
              padding: 18,
              borderRadius: 18,
              background: "rgba(8,14,21,0.65)",
              border: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              alignItems: "center",
              gap: 13,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(245,158,11,0.09)",
                border: "1px solid rgba(245,158,11,0.18)",
              }}
            >
              <QrCode size={19} color="#f59e0b" />
            </div>

            <div>
              <div
                style={{
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                Honey Verification
              </div>

              <div
                style={{
                  color: "rgba(255,255,255,0.38)",
                  fontSize: 10,
                  marginTop: 3,
                }}
              >
                Verify every honey batch
              </div>
            </div>
          </div>

          <div
            className="customer-profile-card"
            style={{
              padding: 18,
              borderRadius: 18,
              background: "rgba(8,14,21,0.65)",
              border: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              alignItems: "center",
              gap: 13,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(16,185,129,0.08)",
                border: "1px solid rgba(16,185,129,0.18)",
              }}
            >
              <ShieldCheck size={19} color="#10b981" />
            </div>

            <div>
              <div
                style={{
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                Verified Account
              </div>

              <div
                style={{
                  color: "rgba(255,255,255,0.38)",
                  fontSize: 10,
                  marginTop: 3,
                }}
              >
                Your account is verified
              </div>
            </div>
          </div>

          <div
            className="customer-profile-card"
            style={{
              padding: 18,
              borderRadius: 18,
              background: "rgba(8,14,21,0.65)",
              border: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              alignItems: "center",
              gap: 13,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(139,92,246,0.08)",
                border: "1px solid rgba(139,92,246,0.18)",
              }}
            >
              <Award size={19} color="#8b5cf6" />
            </div>

            <div>
              <div
                style={{
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                Premium Member
              </div>

              <div
                style={{
                  color: "rgba(255,255,255,0.38)",
                  fontSize: 10,
                  marginTop: 3,
                }}
              >
                Exclusive HoneyChain access
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomerProfile;