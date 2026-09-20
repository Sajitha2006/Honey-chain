import React from "react";
import AnimatedBee from "./AnimatedBee";

const AnimatedHoneyJar = () => {
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
      <AnimatedBee style={{ top: -10, right: -10 }} size={28} />

      <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ filter: "drop-shadow(0 12px 28px rgba(245, 158, 11, 0.5))" }}>
        {/* Jar Glass Outline */}
        <rect x="25" y="25" width="50" height="65" rx="14" fill="rgba(255, 255, 255, 0.2)" stroke="#f59e0b" strokeWidth="3" />
        {/* Lid */}
        <rect x="20" y="15" width="60" height="12" rx="4" fill="#d97706" stroke="#b45309" strokeWidth="2" />
        {/* Golden Honey Liquid */}
        <path d="M 27 45 Q 50 52 73 45 L 73 83 A 10 10 0 0 1 63 88 L 37 88 A 10 10 0 0 1 27 83 Z" fill="url(#honeyGradient)" />
        {/* QR Code Label */}
        <rect x="35" y="52" width="30" height="26" rx="4" fill="#FFFFFF" stroke="#d97706" strokeWidth="1" />
        <path d="M 40 57 h 6 v 6 h -6 z M 54 57 h 6 v 6 h -6 z M 40 71 h 6 v 6 h -6 z M 50 67 h 4 v 4 h -4 z" fill="#1E293B" />

        {/* Honey Drip Gradient Definition */}
        <defs>
          <linearGradient id="honeyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default AnimatedHoneyJar;
