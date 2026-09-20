

const AnimatedAIShield = () => {
  return (
    <div
      className="animate-3d-bobbing"
      style={{
        position: "relative",
        width: 140,
        height: 140,
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Outer Hologram Shield Container */}
      <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ filter: "drop-shadow(0 0 25px rgba(16, 185, 129, 0.6))" }}>
        {/* Hexagon Shield */}
        <polygon
          points="50,5 90,25 90,75 50,95 10,75 10,25"
          fill="rgba(16, 185, 129, 0.12)"
          stroke="#10b981"
          strokeWidth="3"
          strokeDasharray="6 3"
        />
        {/* Inner Core Shield */}
        <polygon
          points="50,15 80,30 80,70 50,85 20,70 20,30"
          fill="rgba(245, 158, 11, 0.15)"
          stroke="#f59e0b"
          strokeWidth="2"
        />
        {/* AI Text Core */}
        <text
          x="50"
          y="58"
          fill="#10b981"
          fontSize="24"
          fontWeight="900"
          textAnchor="middle"
          letterSpacing="1"
        >
          AI
        </text>
      </svg>

      {/* Live Laser Scan Beam */}
      <div
        className="animate-laser-scan"
        style={{
          position: "absolute",
          left: 10,
          right: 10,
          height: 3,
          background: "linear-gradient(90deg, transparent, #10b981, #f59e0b, transparent)",
          boxShadow: "0 0 12px #10b981, 0 0 24px #10b981"
        }}
      />
    </div>
  );
};

export default AnimatedAIShield;
