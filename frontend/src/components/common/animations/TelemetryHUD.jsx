import React, { useEffect, useState } from "react";
import { Activity, ShieldCheck, Wifi, Thermometer, Droplets, Scale } from "lucide-react";

const TelemetryHUD = () => {
  // Gentle dynamic telemetry updates
  const [telemetry, setTelemetry] = useState({
    temp: 32.5,
    humidity: 65,
    weight: 18.4,
    healthScore: 92,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => ({
        temp: +(32.3 + Math.random() * 0.4).toFixed(1),
        humidity: Math.floor(64 + Math.random() * 3),
        weight: +(18.35 + Math.random() * 0.1).toFixed(1),
        healthScore: Math.min(99, Math.max(90, Math.floor(92 + (Math.random() * 3 - 1)))),
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 360, zIndex: 20 }}>
      {/* Floating Top AI Badge */}
      <div
        style={{
          position: "absolute",
          top: -24,
          right: 0,
          background: "rgba(15, 23, 42, 0.85)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(245, 158, 11, 0.4)",
          borderRadius: 99,
          padding: "6px 14px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
          color: "#fff",
          fontSize: 12,
          fontWeight: 700,
          zIndex: 30,
        }}
      >
        <span style={{ fontSize: 14 }}>🤖</span>
        <span>AI Health Score: <strong style={{ color: "var(--honey-gold, #f59e0b)" }}>{telemetry.healthScore}/100</strong></span>
      </div>

      {/* Main Glassmorphism Card */}
      <div
        className="telemetry-glass-card"
        style={{
          background: "rgba(11, 17, 31, 0.8)",
          backdropFilter: "blur(24px)",
          borderRadius: 24,
          padding: "24px 24px 20px 24px",
          border: "1px solid rgba(245, 158, 11, 0.25)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(245, 158, 11, 0.1)",
        }}
      >
        {/* Card Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#10b981",
                  boxShadow: "0 0 12px #10b981",
                }}
              />
              <div
                className="animate-ping"
                style={{
                  position: "absolute",
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  border: "2px solid #10b981",
                  opacity: 0.75,
                }}
              />
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 14, letterSpacing: "-0.2px" }}>
                Hive Monitor — HV-2024
              </div>
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, fontWeight: 600 }}>
                SMART HIVE #HV-001 TELEMETRY
              </div>
            </div>
          </div>

          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: "#10b981",
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              padding: "4px 10px",
              borderRadius: 99,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span style={{ fontSize: 8 }}>●</span> Live
          </div>
        </div>

        {/* Sensor Rows with Sparkline SVGs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          {/* Temperature */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              borderRadius: 14,
              padding: "12px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 16 }}>🌡️</span>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 500 }}>Temperature</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <svg width="48" height="20" viewBox="0 0 48 20" fill="none">
                <path d="M 0 14 Q 12 6 24 12 T 48 4" stroke="#f59e0b" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
              <strong style={{ color: "#f59e0b", fontSize: 16, fontWeight: 800 }}>{telemetry.temp}°C</strong>
            </div>
          </div>

          {/* Humidity */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              borderRadius: 14,
              padding: "12px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 16 }}>💧</span>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 500 }}>Humidity</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <svg width="48" height="20" viewBox="0 0 48 20" fill="none">
                <path d="M 0 10 Q 12 16 24 8 T 48 12" stroke="#3b82f6" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
              <strong style={{ color: "#60a5fa", fontSize: 16, fontWeight: 800 }}>{telemetry.humidity}%</strong>
            </div>
          </div>

          {/* Hive Weight */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              borderRadius: 14,
              padding: "12px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 16 }}>⚖️</span>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 500 }}>Hive Weight</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <svg width="48" height="20" viewBox="0 0 48 20" fill="none">
                <path d="M 0 16 Q 16 4 32 10 T 48 2" stroke="#10b981" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
              <strong style={{ color: "#34d399", fontSize: 16, fontWeight: 800 }}>{telemetry.weight} kg</strong>
            </div>
          </div>

          {/* Device Connectivity */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              borderRadius: 14,
              padding: "12px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 16 }}>📡</span>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 500 }}>Device Node</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <svg width="48" height="20" viewBox="0 0 48 20" fill="none">
                <path d="M 0 12 Q 12 8 24 10 T 48 4" stroke="#a855f7" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
              <strong style={{ color: "#c084fc", fontSize: 14, fontWeight: 800 }}>Online</strong>
            </div>
          </div>
        </div>

        {/* Colony Health Status Banner */}
        <div
          style={{
            padding: "12px 16px",
            borderRadius: 14,
            background: "linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(16,185,129,0.08) 100%)",
            color: "#6ee7b7",
            fontWeight: 800,
            fontSize: 13,
            textAlign: "center",
            border: "1px solid rgba(16,185,129,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            boxShadow: "0 4px 15px rgba(16,185,129,0.15)",
          }}
        >
          <ShieldCheck size={18} color="#34d399" />
          <span>✓ Hive Status: OPTIMAL COLONY HEALTH</span>
        </div>

        <div style={{ textAlign: "right", marginTop: 8, color: "rgba(255,255,255,0.35)", fontSize: 10, fontWeight: 500 }}>
          Last updated: Just now
        </div>
      </div>
    </div>
  );
};

export default TelemetryHUD;
