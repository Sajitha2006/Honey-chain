import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import { QrCode, Search, ShieldCheck, Zap, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";

const qrAssetUrl = "/assets/honey-jar-qr.png";
const honeyJarAssetUrl = "/assets/honey-jar-product.png";
const SAMPLE_BATCHES = ["HB-2024-005", "HB-2024-001", "HB-2024-012", "HB-ORGANIC-88"];

const QRScanner = () => {
  const navigate = useNavigate();
  const [batchId, setBatchId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const scanner = new Html5QrcodeScanner(
        "public-reader",
        { fps: 10, qrbox: { width: 220, height: 220 } },
        false
      );

      scanner.render(
        (decodedText) => {
          let code = decodedText;
          if (code.includes("/verify/")) {
            const parts = code.split("/verify/");
            code = parts[parts.length - 1];
          }
          scanner.clear().catch(() => {});
          navigate(`/verify/${code}`);
        },
        () => {}
      );

      return () => {
        scanner.clear().catch(() => {});
      };
    } catch {
      // Fallback
    }
  }, [navigate]);

  const handleManualVerify = (e) => {
    e.preventDefault();
    if (!batchId.trim()) {
      setError("Please enter a valid batch ID.");
      return;
    }
    navigate(`/verify/${batchId.trim()}`);
  };

  const handleQuickTest = (id) => {
    navigate(`/verify/${id}`);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #090d16 0%, #05080f 100%)", color: "#ffffff" }}>
      <Navbar />

      <div style={{ paddingTop: 110, paddingBottom: 60, paddingLeft: 20, paddingRight: 20, display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 880, display: "grid", gridTemplateColumns: "1fr 340px", gap: 32, alignItems: "start" }}>
          
          {/* Main 3D Dark Glass Scanner Card */}
          <div 
            className="card-3d" 
            style={{ 
              background: "rgba(15, 23, 42, 0.9)", 
              backdropFilter: "blur(24px)", 
              borderRadius: 28, 
              padding: 36, 
              border: "1px solid rgba(245, 158, 11, 0.35)", 
              boxShadow: "0 25px 60px rgba(0,0,0,0.7)" 
            }}
          >
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 99, background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.35)", color: "#10b981", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>
              <Zap size={14} /> AI Camera Vision Ready
            </div>

            <h1 style={{ fontSize: 30, fontWeight: 900, color: "#ffffff", margin: "0 0 10px 0", letterSpacing: "-0.5px" }}>
              Verify Your Honey Purity
            </h1>
            <p style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.6, margin: "0 0 28px 0" }}>
              Scan the QR code on your honey package to discover its complete 3D journey from hive to bottle — including IoT telemetry, AI health scores, and Beekeeper verification.
            </p>

            {/* Camera Viewport with Scanner */}
            <div style={{ position: "relative", marginBottom: 24 }}>
              <div 
                style={{ 
                  width: "100%", 
                  minHeight: 280, 
                  borderRadius: 24, 
                  background: "#04090d", 
                  border: "2px solid #10b981", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  position: "relative", 
                  overflow: "hidden", 
                  boxShadow: "0 0 35px rgba(16, 185, 129, 0.3)" 
                }}
              >
                {/* Laser Overlay Line */}
                <div 
                  style={{ 
                    position: "absolute", 
                    top: "25%", 
                    left: "10%", 
                    right: "10%", 
                    height: "2px", 
                    background: "linear-gradient(90deg, transparent, #10b981, #34d399, transparent)", 
                    boxShadow: "0 0 15px #10b981", 
                    zIndex: 10, 
                    pointerEvents: "none" 
                  }} 
                />

                <div id="public-reader" style={{ width: "100%", height: "100%" }} />
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 10, textAlign: "center", fontWeight: 600 }}>
                📸 Point your phone camera directly at the QR label on the bottle
              </div>
            </div>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "24px 0" }}>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.12)" }} />
              <span style={{ fontSize: 11, fontWeight: 900, color: "rgba(255,255,255,0.4)", letterSpacing: 1 }}>OR ENTER CODE</span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.12)" }} />
            </div>

            {/* Manual Form */}
            {error && <div className="auth-error" style={{ marginBottom: 12 }}>{error}</div>}

            <form onSubmit={handleManualVerify} style={{ display: "flex", gap: 12 }}>
              <input
                type="text"
                value={batchId}
                onChange={(e) => { setBatchId(e.target.value); setError(""); }}
                placeholder="e.g. HB-2024-005"
                style={{ flex: 1, borderRadius: 14, padding: "12px 18px", background: "#0b101b", border: "1px solid rgba(245, 158, 11, 0.35)", color: "#ffffff", fontWeight: 800, fontFamily: "monospace", fontSize: 14 }}
              />
              <button 
                type="submit" 
                className="btn-primary" 
                style={{ padding: "12px 26px", borderRadius: 14, background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", boxShadow: "0 4px 20px rgba(245, 158, 11, 0.4)", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 8 }}
              >
                <ShieldCheck size={16} /> Verify Batch
              </button>
            </form>

            {/* Sample Chips */}
            <div style={{ marginTop: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                Quick Test Samples:
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {SAMPLE_BATCHES.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleQuickTest(id)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 10,
                      background: "rgba(245, 158, 11, 0.12)",
                      border: "1px solid rgba(245, 158, 11, 0.3)",
                      color: "#f59e0b",
                      fontSize: 12,
                      fontWeight: 800,
                      fontFamily: "monospace",
                      cursor: "pointer"
                    }}
                  >
                    {id} →
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Info Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* 3D Honey Jar Graphic Card */}
            <div className="card-3d" style={{ background: "rgba(15, 23, 42, 0.85)", borderRadius: 24, padding: 24, border: "1px solid rgba(245, 158, 11, 0.3)", textAlign: "center" }}>
              <div style={{ width: "100%", height: 200, borderRadius: 16, overflow: "hidden", background: "linear-gradient(135deg, #1f1406 0%, #362205 100%)", border: "1px solid rgba(245,158,11,0.2)", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img 
                  src={qrAssetUrl} 
                  alt="Verified Honey Jar" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = honeyJarAssetUrl;
                  }}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 900, color: "#ffffff", marginBottom: 6 }}>100% Immutable Verification</h3>
              <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.65)", lineHeight: 1.5, margin: 0 }}>
                Verifiable QR code linked directly to IoT sensor readings, AI disease scans, and harvest batch certificates.
              </p>
            </div>

            {/* Security Badges */}
            <div className="card-3d" style={{ background: "rgba(15, 23, 42, 0.85)", borderRadius: 24, padding: 24, border: "1px solid rgba(16, 185, 129, 0.3)" }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#10b981", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <ShieldCheck size={16} /> Certified Authenticity Guarantee
              </div>
              <ul style={{ paddingLeft: 18, margin: 0, fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
                <li>No sugar adulteration or corn syrup</li>
                <li>Single-origin apiary tracking</li>
                <li>Real-time hive health monitoring</li>
                <li>Direct support for local beekeepers</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default QRScanner;
