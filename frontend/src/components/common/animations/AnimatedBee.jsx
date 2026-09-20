import React from "react";

const AnimatedBee = ({ style, size = 36 }) => {
  return (
    <div
      className="animate-bee"
      style={{
        position: "absolute",
        width: size,
        height: size,
        filter: "drop-shadow(0 10px 20px rgba(245, 158, 11, 0.75))",
        pointerEvents: "none",
        zIndex: 10,
        ...style,
      }}
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <defs>
          {/* Photorealistic Abdomen Radial Gradient */}
          <radialGradient id="beeBodyGrad" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="35%" stopColor="#F59E0B" />
            <stop offset="70%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </radialGradient>

          {/* Wing Translucent Glass Gradient */}
          <linearGradient id="wingGlassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.95)" />
            <stop offset="50%" stopColor="rgba(245, 158, 11, 0.4)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.1)" />
          </linearGradient>
        </defs>

        {/* Left Translucent Glass Wing */}
        <g className="animate-wing-flutter" style={{ transformOrigin: "38px 32px" }}>
          <ellipse
            cx="38"
            cy="28"
            rx="20"
            ry="11"
            fill="url(#wingGlassGrad)"
            stroke="rgba(245, 158, 11, 0.8)"
            strokeWidth="1.5"
          />
          {/* Wing Vein Details */}
          <path d="M 38 28 Q 28 24 22 28 M 38 28 Q 32 34 26 34" stroke="rgba(217, 119, 6, 0.6)" strokeWidth="0.8" fill="none" />
        </g>

        {/* Right Translucent Glass Wing */}
        <g className="animate-wing-flutter" style={{ transformOrigin: "62px 32px", animationDelay: "0.04s" }}>
          <ellipse
            cx="62"
            cy="28"
            rx="20"
            ry="11"
            fill="url(#wingGlassGrad)"
            stroke="rgba(245, 158, 11, 0.8)"
            strokeWidth="1.5"
          />
          {/* Wing Vein Details */}
          <path d="M 62 28 Q 72 24 78 28 M 62 28 Q 68 34 74 34" stroke="rgba(217, 119, 6, 0.6)" strokeWidth="0.8" fill="none" />
        </g>

        {/* Photorealistic Golden Body Abdomen */}
        <ellipse cx="50" cy="56" rx="22" ry="28" fill="url(#beeBodyGrad)" />

        {/* Realistic Dark Chitin Stripes */}
        <path d="M 30 46 Q 50 40 70 46" stroke="#1E1B18" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M 29 56 Q 50 50 71 56" stroke="#1E1B18" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M 32 66 Q 50 60 68 66" stroke="#1E1B18" strokeWidth="4" strokeLinecap="round" fill="none" />

        {/* Head with Metallic Sheen */}
        <circle cx="50" cy="28" r="12" fill="#1E1B18" />
        <ellipse cx="44" cy="26" rx="3.5" ry="4.5" fill="#FFF" opacity="0.9" />
        <ellipse cx="56" cy="26" rx="3.5" ry="4.5" fill="#FFF" opacity="0.9" />
      </svg>
    </div>
  );
};

export default AnimatedBee;
