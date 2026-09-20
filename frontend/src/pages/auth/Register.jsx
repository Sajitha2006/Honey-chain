import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { register } from "../../api/authApi";
import AnimatedBee from "../../components/common/animations/AnimatedBee";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const { login: authLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirmPassword: "", role: "customer",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: form.role,
      });
      const { token, user } = res.data;
      authLogin(user, token);
      if (user.role === "beekeeper") navigate("/beekeeper/dashboard");
      else navigate("/customer/dashboard");
    } catch (err) {
      const msg = err?.response?.data?.message || "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="honeycomb-pattern" style={{ minHeight: "100vh", background: "#090d16", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative" }}>
      <AnimatedBee style={{ top: "12%", right: "18%" }} size={32} />
      <AnimatedBee style={{ bottom: "15%", left: "15%" }} size={28} />

      <div className="card-3d" style={{ width: "100%", maxWidth: 520, background: "rgba(15, 23, 42, 0.85)", backdropFilter: "blur(20px)", borderRadius: 28, padding: 40, border: "1px solid rgba(245, 158, 11, 0.25)" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 44, marginBottom: 8, filter: "drop-shadow(0 6px 16px rgba(245,158,11,0.6))" }}>🍯</div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: "#fff", letterSpacing: "-0.5px" }}>
            Create Your <span style={{ color: "var(--honey-gold)" }}>Honey Chain</span> Account
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 4 }}>
            Join thousands of beekeepers and verified honey customers
          </p>
        </div>

        {error && <div className="auth-error" style={{ marginBottom: 20 }}>{error}</div>}

        {/* Role Selector */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
          {[
            { val: "beekeeper", icon: "🐝", label: "Beekeeper Portal" },
            { val: "customer",  icon: "🛒", label: "Customer Shop" },
          ].map(({ val, icon, label }) => (
            <div
              key={val}
              onClick={() => setForm((p) => ({ ...p, role: val }))}
              style={{
                background: form.role === val ? "linear-gradient(135deg, #d97706, #f59e0b)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${form.role === val ? "#f59e0b" : "rgba(255,255,255,0.12)"}`,
                borderRadius: 14,
                padding: "12px",
                textAlign: "center",
                cursor: "pointer",
                color: "#fff",
                fontWeight: 700,
                fontSize: 13,
                boxShadow: form.role === val ? "0 4px 15px rgba(217,119,6,0.4)" : "none",
                transition: "all 0.2s ease"
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
              {label}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ color: "rgba(255,255,255,0.8)" }}>Full Name *</label>
            <input
              type="text" name="name" value={form.name}
              onChange={handleChange} className="form-input"
              placeholder="Jagadeesh Beekeeper"
              style={{ borderRadius: 14, padding: "12px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="form-group">
              <label className="form-label" style={{ color: "rgba(255,255,255,0.8)" }}>Email *</label>
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange} className="form-input"
                placeholder="you@example.com"
                style={{ borderRadius: 14, padding: "12px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff" }}
              />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ color: "rgba(255,255,255,0.8)" }}>Phone</label>
              <input
                type="tel" name="phone" value={form.phone}
                onChange={handleChange} className="form-input"
                placeholder="+91 98765 43210"
                style={{ borderRadius: 14, padding: "12px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="form-group">
              <label className="form-label" style={{ color: "rgba(255,255,255,0.8)" }}>Password *</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  name="password" value={form.password}
                  onChange={handleChange} className="form-input"
                  placeholder="••••••••"
                  style={{ borderRadius: 14, padding: "12px 42px 12px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff" }}
                />
                <button
                  type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", color: "rgba(255,255,255,0.5)" }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" style={{ color: "rgba(255,255,255,0.8)" }}>Confirm *</label>
              <input
                type="password" name="confirmPassword" value={form.confirmPassword}
                onChange={handleChange} className="form-input"
                placeholder="••••••••"
                style={{ borderRadius: 14, padding: "12px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff" }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary btn-full btn-lg"
            disabled={loading}
            style={{ borderRadius: 14, padding: "14px", marginTop: 12 }}
          >
            {loading ? "Creating account…" : "Create Account →"}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--honey-gold)", fontWeight: 700, textDecoration: "none" }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;