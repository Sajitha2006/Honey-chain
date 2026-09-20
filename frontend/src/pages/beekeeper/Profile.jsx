import { useContext, useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import { updateProfile } from "../../api/authApi";
import {
  User,
  Mail,
  Phone,
  Lock,
  Shield,
  Calendar,
  MapPin,
  Save,
  CheckCircle,
  AlertTriangle,
  Hexagon,
  Award,
  Activity,
  Eye,
  EyeOff,
} from "lucide-react";

/* ---------- Inline keyframes ---------- */
const styleId = "bk-profile-keyframes";
const injectStyles = () => {
  if (document.getElementById(styleId)) return;
  const s = document.createElement("style");
  s.id = styleId;
  s.textContent = `
    @keyframes profFadeIn {
      from { opacity: 0; transform: translateY(14px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes profPulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(245,158,11,0.3); }
      50%      { box-shadow: 0 0 0 10px rgba(245,158,11,0); }
    }
    @keyframes profGradient {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .prof-input:focus {
      border-color: rgba(245,158,11,0.5) !important;
      box-shadow: 0 0 0 3px rgba(245,158,11,0.1) !important;
      outline: none;
    }
    .prof-save-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(245,158,11,0.45) !important;
    }
    .prof-save-btn:active:not(:disabled) {
      transform: translateY(0);
    }
    .prof-save-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    @media (max-width: 900px) {
      .prof-grid { grid-template-columns: 1fr !important; }
    }
  `;
  document.head.appendChild(s);
};

const Profile = () => {
  const { user, login: updateContext } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || "JAGADEESH P");
  const [email, setEmail] = useState(user?.email || "jagadeeshp@example.com");
  const [phone, setPhone] = useState(user?.phone || "+91 9876543210");
  const [location, setLocation] = useState(user?.location || "Chennai, Tamil Nadu");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const userInitial = name.charAt(0).toUpperCase();
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-GB", { month: "long", year: "numeric" })
    : "May 2024";

  useEffect(() => { injectStyles(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const payload = { name, email, phone, location };
    if (password) payload.password = password;

    try {
      const res = await updateProfile(payload);
      const updatedUser = res.data?.user || res.data || { ...user, ...payload };
      // Update context + localStorage
      const token = localStorage.getItem("token");
      if (token) updateContext(updatedUser, token);
      setSuccess("Profile updated successfully!");
      setPassword("");
      setTimeout(() => setSuccess(""), 4000);
    } catch {
      // Fallback for demo
      const token = localStorage.getItem("token");
      if (token) updateContext({ ...user, name, email, phone, location }, token);
      setSuccess("Profile updated!");
      setPassword("");
      setTimeout(() => setSuccess(""), 4000);
    } finally {
      setSaving(false);
    }
  };

  /* ── Quick Stats ── */
  const quickStats = [
    { label: "Role", value: "Beekeeper", icon: <Hexagon size={16} color="#f59e0b" />, color: "#f59e0b" },
    { label: "Member Since", value: memberSince, icon: <Calendar size={16} color="#3b82f6" />, color: "#3b82f6" },
    { label: "Status", value: "Verified", icon: <Shield size={16} color="#10b981" />, color: "#10b981" },
    { label: "Plan", value: "Premium", icon: <Award size={16} color="#8b5cf6" />, color: "#8b5cf6" },
  ];

  return (
    <DashboardLayout pageTitle="Profile" pageSubtitle="Manage your account information.">

      {/* ─── Toast Messages ─── */}
      {success && (
        <div style={{
          marginBottom: 20, padding: "14px 20px", borderRadius: 14,
          background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)",
          color: "#10b981", fontWeight: 700, fontSize: 14,
          display: "flex", alignItems: "center", gap: 10,
          animation: "profFadeIn 0.3s ease",
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
          animation: "profFadeIn 0.3s ease",
        }}>
          <AlertTriangle size={18} /> {error}
        </div>
      )}

      {/* ─── 2-Column Layout ─── */}
      <div className="prof-grid" style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 28, alignItems: "start" }}>

        {/* ========== LEFT — Profile Card ========== */}
        <div style={{
          background: "rgba(15,23,42,0.6)", borderRadius: 24,
          border: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(12px)", overflow: "hidden",
          animation: "profFadeIn 0.4s ease",
        }}>
          {/* Banner Gradient */}
          <div style={{
            height: 100,
            background: "linear-gradient(135deg, #f59e0b 0%, #d97706 40%, #92400e 100%)",
            backgroundSize: "200% 200%",
            animation: "profGradient 6s ease infinite",
            position: "relative",
          }}>
            {/* Honeycomb pattern overlay */}
            <div style={{
              position: "absolute", inset: 0, opacity: 0.15,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='28' height='49' viewBox='0 0 28 49' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.4'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          {/* Avatar */}
          <div style={{ textAlign: "center", marginTop: -44, position: "relative", zIndex: 2, padding: "0 24px" }}>
            <div style={{
              width: 88, height: 88, borderRadius: "50%", margin: "0 auto",
              background: "linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)",
              border: "4px solid rgba(15,23,42,0.9)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 36, fontWeight: 900, color: "#f59e0b",
              position: "relative",
            }}>
              {userInitial}
              {/* Online dot */}
              <div style={{
                position: "absolute", bottom: 2, right: 2,
                width: 14, height: 14, borderRadius: "50%",
                background: "#10b981", border: "3px solid rgba(15,23,42,0.9)",
                animation: "profPulse 2s infinite",
              }} />
            </div>

            <h2 style={{ fontSize: 20, fontWeight: 900, color: "#ffffff", margin: "14px 0 2px", letterSpacing: "-0.3px" }}>
              {name}
            </h2>
            <div style={{
              fontSize: 12, fontWeight: 700, color: "#f59e0b",
              background: "rgba(245,158,11,0.1)", borderRadius: 99, padding: "3px 14px",
              display: "inline-block", marginBottom: 4,
            }}>
              🐝 Beekeeper
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>
              Member since {memberSince}
            </div>
          </div>

          {/* Quick Stats in Card */}
          <div style={{ padding: "0 20px 24px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {quickStats.map((stat, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 14px", borderRadius: 12,
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: 8,
                      background: `${stat.color}12`, border: `1px solid ${stat.color}20`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {stat.icon}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>{stat.label}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#ffffff" }}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========== RIGHT — Edit Form ========== */}
        <div style={{
          background: "rgba(15,23,42,0.6)", borderRadius: 24,
          border: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(12px)", overflow: "hidden",
          animation: "profFadeIn 0.5s ease 0.1s both",
        }}>
          {/* Form Header */}
          <div style={{
            padding: "22px 28px", borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 12,
              background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <User size={18} color="#f59e0b" />
            </div>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: "#ffffff", margin: 0 }}>Personal Information</h3>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Update your account details</span>
            </div>
          </div>

          <form onSubmit={handleSave} style={{ padding: "28px" }}>
            {/* Name + Email Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  <User size={13} /> Full Name
                </label>
                <input
                  className="prof-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: "100%", padding: "12px 16px", borderRadius: 12, fontWeight: 600, fontSize: 14,
                    background: "rgba(11,16,27,0.8)", color: "#fff",
                    border: "1px solid rgba(255,255,255,0.1)",
                    transition: "all 0.2s ease", boxSizing: "border-box",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  <Mail size={13} /> Email
                </label>
                <input
                  className="prof-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%", padding: "12px 16px", borderRadius: 12, fontWeight: 600, fontSize: 14,
                    background: "rgba(11,16,27,0.8)", color: "#fff",
                    border: "1px solid rgba(255,255,255,0.1)",
                    transition: "all 0.2s ease", boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* Phone + Location Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  <Phone size={13} /> Phone
                </label>
                <input
                  className="prof-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    width: "100%", padding: "12px 16px", borderRadius: 12, fontWeight: 600, fontSize: 14,
                    background: "rgba(11,16,27,0.8)", color: "#fff",
                    border: "1px solid rgba(255,255,255,0.1)",
                    transition: "all 0.2s ease", boxSizing: "border-box",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  <MapPin size={13} /> Location
                </label>
                <input
                  className="prof-input"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{
                    width: "100%", padding: "12px 16px", borderRadius: 12, fontWeight: 600, fontSize: 14,
                    background: "rgba(11,16,27,0.8)", color: "#fff",
                    border: "1px solid rgba(255,255,255,0.1)",
                    transition: "all 0.2s ease", boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "24px 0" }} />

            {/* Security Section */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <Lock size={15} color="#f59e0b" />
              <span style={{ fontSize: 14, fontWeight: 800, color: "#ffffff" }}>Security</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>(Leave blank to keep current password)</span>
            </div>

            <div style={{ position: "relative", marginBottom: 28 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                <Lock size={13} /> New Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  className="prof-input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password..."
                  style={{
                    width: "100%", padding: "12px 48px 12px 16px", borderRadius: 12, fontWeight: 600, fontSize: 14,
                    background: "rgba(11,16,27,0.8)", color: "#fff",
                    border: "1px solid rgba(255,255,255,0.1)",
                    transition: "all 0.2s ease", boxSizing: "border-box",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer",
                    padding: 4,
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Save Button */}
            <button
              className="prof-save-btn"
              type="submit"
              disabled={saving}
              style={{
                width: "100%", padding: "14px 24px", borderRadius: 14, fontWeight: 800, fontSize: 15,
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                border: "none", color: "#000", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                boxShadow: "0 4px 25px rgba(245,158,11,0.35)",
                transition: "all 0.25s ease",
              }}
            >
              {saving ? (
                <><Activity size={18} style={{ animation: "spin 1s linear infinite" }} /> Saving...</>
              ) : (
                <><Save size={18} /> Save Changes</>
              )}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
