import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { QrCode, Search, Camera, ShieldCheck, Sparkles, ArrowRight, CheckCircle2, Zap } from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";

const qrAssetUrl = "/assets/honey-jar-qr.png";
const honeyJarAssetUrl = "/assets/honey-jar-product.png";

const SAMPLE_BATCHES = ["HB-2024-005", "HB-2024-001", "HB-2024-012", "HB-ORGANIC-88"];

const QRScanner = () => {
  const navigate = useNavigate();
  const [manualBatchId, setManualBatchId] = useState("");
  const [cameraActive, setCameraActive] = useState(true);

  useEffect(() => {
    try {
      const scanner = new Html5QrcodeScanner("reader", {
        fps: 10,
        qrbox: { width: 220, height: 220 },
      }, false);

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
      setCameraActive(false);
    }
  }, [navigate]);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualBatchId.trim()) return;
    navigate(`/verify/${manualBatchId.trim()}`);
  };

  const handleQuickTest = (batchId) => {
    navigate(`/verify/${batchId}`);
  };

  return (
    <DashboardLayout pageTitle="QR Authenticity Scanner" pageSubtitle="Instant 3D supply chain verification & hive harvest certificate">
      <div style={{ maxWidth: 860, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 340px", gap: 28, alignItems: "start" }}>
        
        {/* Main 3D Scanner Column */}
        <div className="card-3d" style={{ background: "rgba(15, 23, 42, 0.9)", borderRadius: 28, padding: 32, border: "1px solid rgba(16, 185, 129, 0.35)", boxShadow: "0 20px 50px rgba(0,0,0,0.6)", backdropFilter: "blur(20px)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 800, color: "#10b981", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
                <Zap size={14} /> AI Camera Vision Active
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: "#ffffff", margin: 0, letterSpacing: "-0.5px" }}>Scan Honey Jar QR Code</h2>
            </div>
            <div style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.4)", padding: "6px 14px", borderRadius: 99, fontSize: 12, fontWeight: 800, color: "#10b981", display: "flex", alignItems: "center", gap: 6 }}>
              <span className="animate-pulse" style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} /> Live Ready
            </div>
          </div>

          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", marginBottom: 24, lineHeight: 1.6 }}>
            Position your honey jar's QR code within the frame below to verify 100% purity, harvest date, and Beekeeper identity.
          </p>

          {/* Futuristic Scanner Viewport Frame */}
          <div style={{ position: "relative", marginBottom: 24 }}>
            <div 
              style={{ 
                width: "100%", 
                minHeight: 280, 
                borderRadius: 24, 
                background: "#04090d", 
                border: "2px solid rgba(16, 185, 129, 0.5)", 
                display: "flex", 
                flexDirection: "column",
                alignItems: "center", 
                justifyContent: "center", 
                position: "relative", 
                overflow: "hidden", 
                boxShadow: "0 0 40px rgba(16,185,129,0.25)" 
              }}
            >
              {/* Animated Laser Scanning Line Overlay */}
              <div 
                style={{ 
                  position: "absolute", 
                  top: "20%", 
                  left: "10%", 
                  right: "10%", 
                  height: "2px", 
                  background: "linear-gradient(90deg, transparent, #10b981, #34d399, transparent)", 
                  boxShadow: "0 0 15px #10b981", 
                  zIndex: 10, 
                  pointerEvents: "none" 
                }} 
              />
              
              <div id="reader" style={{ width: "100%", height: "100%" }} />
            </div>

            <div style={{ textAlign: "center", marginTop: 12, fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>
              📸 Automatic detection active • Ensure good lighting
            </div>
          </div>

          {/* Manual Entry Form */}
          <div style={{ background: "rgba(255, 255, 255, 0.03)", borderRadius: 20, padding: 20, border: "1px solid rgba(255,255,255,0.08)" }}>
            <label className="form-label" style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#f59e0b" }}>
              <Search size={14} /> Manual Batch ID Lookup
            </label>
            <form onSubmit={handleManualSubmit} style={{ display: "flex", gap: 12 }}>
              <input
                className="form-input"
                value={manualBatchId}
                onChange={(e) => setManualBatchId(e.target.value)}
                placeholder="e.g. HB-2024-005"
                style={{ flex: 1, borderRadius: 14, padding: "12px 18px", fontWeight: 800, fontFamily: "monospace", fontSize: 14, background: "#0b101b", border: "1px solid rgba(245,158,11,0.3)", color: "#ffffff" }}
              />
              <button 
                type="submit" 
                className="btn-primary" 
                style={{ padding: "12px 24px", borderRadius: 14, background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", boxShadow: "0 4px 20px rgba(245,158,11,0.4)", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 8 }}
              >
                <ShieldCheck size={16} /> Verify
              </button>
            </form>

            {/* Quick Test Batch Chips */}
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>
                Quick Test Samples:
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {SAMPLE_BATCHES.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => handleQuickTest(b)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 10,
                      background: "rgba(245,158,11,0.12)",
                      border: "1px solid rgba(245,158,11,0.3)",
                      color: "#f59e0b",
                      fontSize: 12,
                      fontWeight: 800,
                      fontFamily: "monospace",
                      cursor: "pointer"
                    }}
                  >
                    {b} →
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Info Column with 3D Jar Asset Graphic */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* 3D Honey Jar Graphic Card */}
          <div className="card-3d" style={{ background: "rgba(15, 23, 42, 0.85)", borderRadius: 24, padding: 24, border: "1px solid rgba(245, 158, 11, 0.3)", textAlignment: "center" }}>
            <div style={{ width: "100%", height: 190, borderRadius: 16, overflow: "hidden", background: "linear-gradient(135deg, #1f1406 0%, #362205 100%)", border: "1px solid rgba(245,158,11,0.2)", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img 
                src={qrAssetUrl} 
                alt="QR Authenticity Tag" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = honeyJarAssetUrl;
                }}
                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
              />
            </div>

            <h3 style={{ fontSize: 17, fontWeight: 900, color: "#ffffff", marginBottom: 6 }}>100% Immutable Verification</h3>
            <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.65)", lineHeight: 1.5, margin: 0 }}>
              Every jar features a tamper-proof QR code tied to apiary harvest logs, lab tests, and hive telemetry.
            </p>
          </div>

          {/* How It Works Steps */}
          <div className="card-3d" style={{ background: "rgba(15, 23, 42, 0.85)", borderRadius: 24, padding: 24, border: "1px solid rgba(255, 255, 255, 0.08)" }}>
            <h4 style={{ fontSize: 15, fontWeight: 900, color: "#ffffff", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <Sparkles size={16} color="#f59e0b" /> How Verification Works
            </h4>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { step: "1", title: "Scan Jar QR", desc: "Align camera box over the QR code on your honey bottle." },
                { step: "2", title: "Extract Batch ID", desc: "System decodes the batch serial number instantly." },
                { step: "3", title: "View Certificate", desc: "Inspect origin apiary, harvest date, and lab purity report." }
              ].map((s) => (
                <div key={s.step} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", color: "#f59e0b", fontSize: 12, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {s.step}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#ffffff" }}>{s.title}</div>
                    <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default QRScanner;
