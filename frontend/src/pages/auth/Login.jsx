import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { login } from "../../api/authApi";
import AnimatedBee from "../../components/common/animations/AnimatedBee";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";

const Login = () => {
  const { login: authLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await login({ email: form.email, password: form.password });
      const { token, user } = res.data;
      authLogin(user, token);
      if (user.role === "beekeeper") navigate("/beekeeper/dashboard");
      else navigate("/customer/dashboard");
    } catch (err) {
      const msg = err?.response?.data?.message || "Invalid credentials. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="honeycomb-pattern" style={{ minHeight: "100vh", background: "#090d16", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative" }}>
      <AnimatedBee style={{ top: "15%", left: "20%" }} size={32} />
      <AnimatedBee style={{ bottom: "20%", right: "22%" }} size={28} />

      <div className="card-3d" style={{ width: "100%", maxWidth: 440, background: "rgba(15, 23, 42, 0.85)", backdropFilter: "blur(20px)", borderRadius: 28, padding: 40, border: "1px solid rgba(245, 158, 11, 0.25)" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 44, marginBottom: 8, filter: "drop-shadow(0 6px 16px rgba(245,158,11,0.6))" }}>🍯</div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: "#fff", letterSpacing: "-0.5px" }}>
            Honey <span style={{ color: "var(--honey-gold)" }}>Chain</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 4 }}>
            Sign in to your Smart Beekeeping Portal
          </p>
        </div>

        {error && <div className="auth-error" style={{ marginBottom: 20 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ color: "rgba(255,255,255,0.8)" }}>Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="form-input"
              placeholder="you@example.com"
              autoComplete="email"
              style={{ borderRadius: 14, padding: "12px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff" }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ color: "rgba(255,255,255,0.8)" }}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="form-input"
                placeholder="••••••••"
                autoComplete="current-password"
                style={{ borderRadius: 14, padding: "12px 46px 12px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff" }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute", right: 14, top: "50%",
                  transform: "translateY(-50%)", background: "none",
                  color: "rgba(255,255,255,0.5)", cursor: "pointer"
                }}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(255,255,255,0.7)", cursor: "pointer" }}>
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
              />
              Remember me
            </label>
          </div>

          <button
            type="submit"
            className="btn-primary btn-full btn-lg"
            disabled={loading}
            style={{ borderRadius: 14, padding: "14px", fontSize: 15 }}
          >
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "var(--honey-gold)", fontWeight: 700, textDecoration: "none" }}>
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
