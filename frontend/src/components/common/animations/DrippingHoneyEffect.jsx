import React from "react";

const DrippingHoneyEffect = () => {
  return (
    <div className="dripping-honey-container" style={{ position: "absolute", bottom: -20, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 600, height: 180, pointerEvents: "none", zIndex: 12 }}>
      <svg viewBox="0 0 800 200" width="100%" height="100%" style={{ overflow: "visible" }}>
        <defs>
          {/* Honey Liquid Metallic Amber Gradient */}
          <linearGradient id="honeyLiquidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#F59E0B" stopOpacity="0.95" />
            <stop offset="75%" stopColor="#D97706" stopOpacity="1" />
            <stop offset="100%" stopColor="#92400E" stopOpacity="0.9" />
          </linearGradient>

          {/* Golden Surface Glow */}
          <radialGradient id="honeyPoolGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FCD34D" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.4" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          {/* Specular Highlight Gradient */}
          <linearGradient id="honeyHighlightGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.3)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>

        {/* Ambient Honey Pool Glow on Ground */}
        <ellipse cx="400" cy="160" rx="280" ry="35" fill="url(#honeyPoolGlow)" />

        {/* Flowing Main Stream */}
        <path
          d="M 390 0 C 390 40 375 80 385 120 C 390 140 370 155 400 160 C 430 155 410 140 415 120 C 425 80 410 40 410 0 Z"
          fill="url(#honeyLiquidGrad)"
          filter="drop-shadow(0 4px 15px rgba(245,158,11,0.6))"
        >
          <animate
            attributeName="d"
            dur="4s"
            repeatCount="indefinite"
            values="
              M 390 0 C 390 40 375 80 385 120 C 390 140 370 155 400 160 C 430 155 410 140 415 120 C 425 80 410 40 410 0 Z;
              M 388 0 C 392 45 370 75 388 122 C 395 142 365 158 400 160 C 435 158 405 142 412 122 C 430 75 408 45 412 0 Z;
              M 390 0 C 390 40 375 80 385 120 C 390 140 370 155 400 160 C 430 155 410 140 415 120 C 425 80 410 40 410 0 Z
            "
          />
        </path>

        {/* Glossy Surface Specular Highlight */}
        <path
          d="M 395 5 C 394 40 385 80 392 120"
          stroke="url(#honeyHighlightGrad)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />

        {/* Falling Dripping Droplet 1 */}
        <circle cx="400" cy="40" r="6" fill="url(#honeyLiquidGrad)">
          <animate attributeName="cy" from="10" to="160" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="r" values="4; 7; 3; 8; 1" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0; 1; 1; 0.8; 0" dur="2.4s" repeatCount="indefinite" />
        </circle>

        {/* Falling Dripping Droplet 2 */}
        <circle cx="385" cy="20" r="5" fill="url(#honeyLiquidGrad)">
          <animate attributeName="cy" from="0" to="155" dur="3.1s" begin="0.8s" repeatCount="indefinite" />
          <animate attributeName="r" values="3; 6; 2; 7; 1" dur="3.1s" begin="0.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0; 1; 1; 0.7; 0" dur="3.1s" begin="0.8s" repeatCount="indefinite" />
        </circle>

        {/* Honey Pool Ripple Effect */}
        <ellipse cx="400" cy="160" rx="40" ry="8" fill="none" stroke="#FCD34D" strokeWidth="1.5" opacity="0.6">
          <animate attributeName="rx" values="10; 90" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="ry" values="2; 18" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8; 0" dur="2.4s" repeatCount="indefinite" />
        </ellipse>
      </svg>
    </div>
  );
};

export default DrippingHoneyEffect;
