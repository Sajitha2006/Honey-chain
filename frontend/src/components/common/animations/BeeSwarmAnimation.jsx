import React from "react";
import AnimatedBee from "./AnimatedBee";

const BeeSwarmAnimation = () => {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 12 }}>
      {/* Bee 1 - Near Hero Banner */}
      <AnimatedBee
        style={{
          top: "12%",
          right: "22%",
          animation: "beeFlyPath 8s ease-in-out infinite",
        }}
        size={34}
      />

      {/* Bee 2 - Top Left */}
      <AnimatedBee
        style={{
          top: "20%",
          left: "8%",
          animation: "beeFlyPath2 10s ease-in-out infinite",
          animationDelay: "1s"
        }}
        size={28}
      />

      {/* Bee 3 - Middle Cards */}
      <AnimatedBee
        style={{
          top: "55%",
          right: "12%",
          animation: "beeFlyPath3 12s ease-in-out infinite",
          animationDelay: "2s"
        }}
        size={30}
      />

      {/* Bee 4 - Bottom AI & Traceability Cards */}
      <AnimatedBee
        style={{
          bottom: "10%",
          left: "40%",
          animation: "beeFlyPath 9s ease-in-out infinite",
          animationDelay: "3s"
        }}
        size={26}
      />
    </div>
  );
};

export default BeeSwarmAnimation;
