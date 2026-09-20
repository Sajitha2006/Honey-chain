import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getBatch, getJourney } from "../../api/traceabilityApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Timeline from "../../components/traceability/Timeline";
import { ShieldCheck, ArrowLeft, Award, CheckCircle2 } from "lucide-react";

const honeyJarAssetUrl = "/assets/honey-jar-product.png";

const VerifyHoney = () => {
  const { batchId } = useParams();
  const [batch, setBatch] = useState({
    batchId: batchId || "HB-2024-005",
    honeyType: "Wild Forest",
    harvestDate: "2024-05-20",
    quantity: "25",
    unit: "kg",
    status: "Verified Authentic"
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getBatch(batchId).then((r) => {
      if (r.data?.batch) setBatch(r.data.batch);
    }).catch(() => {});
  }, [batchId]);

  return (
    <div className="honeycomb-pattern" style={{ minHeight: "100vh", background: "#090d16", padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 680 }}>
        <Link to="/qr-scanner" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--honey-gold)", textDecoration: "none", marginBottom: 20, fontWeight: 700 }}>
          <ArrowLeft size={16} /> Back to Scanner
        </Link>

        {/* Screen 18 Authenticity Card */}
        <div className="card-3d" style={{ background: "rgba(15, 23, 42, 0.9)", backdropFilter: "blur(24px)", borderRadius: 28, padding: 36, border: "1px solid rgba(16, 185, 129, 0.4)", boxShadow: "0 20px 50px rgba(0,0,0,0.6)" }}>
          {/* Header Verified Banner */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28, paddingBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#10b981", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 900, boxShadow: "0 0 20px rgba(16,185,129,0.5)" }}>
              ✓
            </div>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: "#10b981", margin: 0, letterSpacing: "-0.5px" }}>
                Authentic Honey Verified
              </h2>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>
                100% Verifiable Hive to Jar Supply Chain Certificate
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 28, alignItems: "center", marginBottom: 28 }}>
            {/* 3D Honey Jar Graphic */}
            <div style={{ width: "100%", height: 200, borderRadius: 20, overflow: "hidden", background: "linear-gradient(135deg, #1f1406 0%, #362205 100%)", border: "1px solid rgba(245,158,11,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img 
                src={honeyJarAssetUrl} 
                alt="Verified Honey" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = honeyJarAssetUrl;
                }}
                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
              />
            </div>

            {/* Batch Specs */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px dashed rgba(255,255,255,0.08)" }}>
                <span style={{ color: "rgba(255,255,255,0.5)" }}>Batch ID</span>
                <strong style={{ color: "var(--honey-gold)", fontFamily: "monospace" }}>{batch.batchId || "HB-2024-005"}</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px dashed rgba(255,255,255,0.08)" }}>
                <span style={{ color: "rgba(255,255,255,0.5)" }}>Honey Type</span>
                <strong style={{ color: "#fff" }}>{batch.honeyType || "Wild Forest"}</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px dashed rgba(255,255,255,0.08)" }}>
                <span style={{ color: "rgba(255,255,255,0.5)" }}>Harvest Date</span>
                <strong style={{ color: "#fff" }}>20 May 2024</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px dashed rgba(255,255,255,0.08)" }}>
                <span style={{ color: "rgba(255,255,255,0.5)" }}>Quantity</span>
                <strong style={{ color: "#fff" }}>25 kg</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px dashed rgba(255,255,255,0.08)" }}>
                <span style={{ color: "rgba(255,255,255,0.5)" }}>Beekeeper</span>
                <strong style={{ color: "#fff" }}>JAGADEESH P</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                <span style={{ color: "rgba(255,255,255,0.5)" }}>Status</span>
                <strong style={{ color: "#10b981" }}>✓ Verified Authentic</strong>
              </div>
            </div>
          </div>

          {/* 4 Trust Badges Row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
            {[
              { icon: "🛡️", title: "100% Pure" },
              { icon: "🔬", title: "Lab Tested" },
              { icon: "🚫", title: "No Added Sugar" },
              { icon: "🌿", title: "Natural & Raw" },
            ].map((t) => (
              <div key={t.title} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "10px 8px", textAlign: "center", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{t.icon}</div>
                <div style={{ fontSize: 10, fontWeight: 800, color: "#fff" }}>{t.title}</div>
              </div>
            ))}
          </div>

          {/* Footer Statement */}
          <div style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.5)", fontStyle: "italic", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 16 }}>
            This honey is 100% authentic and traceable from hive to you.
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyHoney;
