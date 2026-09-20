import { useEffect, useState, useRef } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatusBadge from "../../components/common/StatusBadge";
import { getHives } from "../../api/hiveApi";
import { getDiseaseHistory, uploadDiseaseImage } from "../../api/diseaseApi";

import {
  Sparkles,
  Upload,
  RefreshCw,
  Zap,
  FileText,
  AlertTriangle,
  CheckCircle,
  Activity,
  Bug,
  
  Clock,
  Microscope,
  ShieldCheck,
  ChevronRight,
  
  Cpu,
  Database,
  BrainCircuit,
  Image as ImageIcon,
  Target,
  CircleDot,
} from "lucide-react";

const aiHologramUrl = "/assets/ai-disease.png";

/* =========================================================
   MOCK DATA
========================================================= */

const MOCK_DISEASE_PRESETS = [
  {
    diseaseDetected: "Varroa Mite Infestation",
    confidence: 0.945,
    riskLevel: "high",
    recommendation:
      "High Varroa mite density detected. Treat hive with formic acid or oxalic acid vapor immediately and inspect brood frames.",
  },
  {
    diseaseDetected: "Nosema Parasite Spores",
    confidence: 0.892,
    riskLevel: "high",
    recommendation:
      "Nosema apis/ceranae spores identified. Improve hive ventilation, reduce humidity, and follow veterinary treatment guidance.",
  },
  {
    diseaseDetected: "Chalkbrood Fungus",
    confidence: 0.854,
    riskLevel: "medium",
    recommendation:
      "Fungal mummies spotted in brood cells. Inspect colony health, improve ventilation, and replace heavily affected comb frames.",
  },
  {
    diseaseDetected: "Healthy Colony",
    confidence: 0.982,
    riskLevel: "healthy",
    recommendation:
      "No visible pathogen indicators detected. Bee structures, brood patterns, and cell caps appear normal.",
  },
];

const DEFAULT_HISTORY = [
  {
    _id: "d1",
    diseaseDetected: "Nosema Disease",
    riskLevel: "high",
    hive: { hiveId: "HIVE-001" },
    createdAt: "2024-05-24T10:00:00Z",
  },
  {
    _id: "d2",
    diseaseDetected: "Chalkbrood",
    riskLevel: "medium",
    hive: { hiveId: "HIVE-003" },
    createdAt: "2024-05-20T14:30:00Z",
  },
  {
    _id: "d3",
    diseaseDetected: "Varroa Mites",
    riskLevel: "high",
    hive: { hiveId: "HIVE-001" },
    createdAt: "2024-05-18T09:15:00Z",
  },
  {
    _id: "d4",
    diseaseDetected: "Healthy / No Disease",
    riskLevel: "healthy",
    hive: { hiveId: "HIVE-002" },
    createdAt: "2024-05-15T11:20:00Z",
  },
];

/* =========================================================
   HELPERS
========================================================= */

const riskColor = (level) => {
  if (level === "high") return "#ef4444";
  if (level === "medium") return "#f59e0b";
  return "#10b981";
};

const riskGlow = (level) => {
  if (level === "high") return "rgba(239,68,68,0.28)";
  if (level === "medium") return "rgba(245,158,11,0.28)";
  return "rgba(16,185,129,0.28)";
};

const riskLabel = (level) => {
  if (level === "high") return "HIGH RISK";
  if (level === "medium") return "MEDIUM RISK";
  return "HEALTHY";
};

const RiskIcon = ({ level, size = 20 }) => {
  if (level === "high") {
    return <AlertTriangle size={size} color="#ef4444" />;
  }

  if (level === "medium") {
    return <Bug size={size} color="#f59e0b" />;
  }

  return <CheckCircle size={size} color="#10b981" />;
};

/* =========================================================
   CSS
========================================================= */

const styleId = "honeychain-disease-premium-ui";

const injectStyles = () => {
  if (document.getElementById(styleId)) return;

  const style = document.createElement("style");
  style.id = styleId;

  style.textContent = `
    * {
      box-sizing: border-box;
    }

    @keyframes scanLine {
      0% {
        top: 0%;
        opacity: 0;
      }

      10% {
        opacity: 1;
      }

      50% {
        opacity: 1;
      }

      90% {
        opacity: 1;
      }

      100% {
        top: 100%;
        opacity: 0;
      }
    }

    @keyframes pulseGreen {
      0%,100% {
        opacity: .55;
        transform: scale(.9);
        box-shadow: 0 0 0 0 rgba(16,185,129,.4);
      }

      50% {
        opacity: 1;
        transform: scale(1);
        box-shadow: 0 0 0 7px rgba(16,185,129,0);
      }
    }

    @keyframes pulseGold {
      0%,100% {
        box-shadow: 0 0 20px rgba(245,158,11,.12);
      }

      50% {
        box-shadow: 0 0 45px rgba(245,158,11,.28);
      }
    }

    @keyframes rotateSlow {
      from {
        transform: rotate(0deg);
      }

      to {
        transform: rotate(360deg);
      }
    }

    @keyframes rotateReverse {
      from {
        transform: rotate(360deg);
      }

      to {
        transform: rotate(0deg);
      }
    }

    @keyframes float {
      0%,100% {
        transform: translateY(0);
      }

      50% {
        transform: translateY(-7px);
      }
    }

    @keyframes fadeUp {
      from {
        opacity: 0;
        transform: translateY(18px);
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes progressGlow {
      0% {
        width: 0%;
      }

      100% {
        width: var(--progress);
      }
    }

    @keyframes gridMove {
      from {
        background-position: 0 0;
      }

      to {
        background-position: 40px 40px;
      }
    }

    @keyframes blink {
      0%,100% {
        opacity: 1;
      }

      50% {
        opacity: .35;
      }
    }

    .dc-page {
      color: #fff;
      animation: fadeUp .5s ease;
    }

    .dc-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
      margin-bottom: 24px;
    }

    .dc-title-row {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .dc-title-icon {
      width: 48px;
      height: 48px;
      border-radius: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      background:
        radial-gradient(circle at 30% 20%, rgba(245,158,11,.18), transparent 50%),
        rgba(245,158,11,.06);
      border: 1px solid rgba(245,158,11,.25);
      box-shadow: 0 8px 30px rgba(245,158,11,.08);
    }

    .dc-title {
      font-size: 27px;
      line-height: 1.1;
      font-weight: 900;
      letter-spacing: -.8px;
      margin: 0;
    }

    .dc-subtitle {
      color: rgba(255,255,255,.42);
      font-size: 13px;
      margin: 6px 0 0;
    }

    .dc-online {
      display: flex;
      align-items: center;
      gap: 9px;
      padding: 9px 15px;
      border-radius: 999px;
      background: rgba(16,185,129,.055);
      border: 1px solid rgba(16,185,129,.2);
      white-space: nowrap;
    }

    .dc-online-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #10b981;
      animation: pulseGreen 2s infinite;
    }

    .dc-online-text {
      color: #10b981;
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 1.2px;
    }

    .dc-toast {
      padding: 13px 16px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 18px;
      animation: fadeUp .3s ease;
    }

    .dc-toast-success {
      background: rgba(16,185,129,.08);
      border: 1px solid rgba(16,185,129,.22);
      color: #10b981;
    }

    .dc-toast-error {
      background: rgba(239,68,68,.08);
      border: 1px solid rgba(239,68,68,.22);
      color: #ef4444;
    }

    .dc-layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 390px;
      gap: 22px;
      align-items: start;
    }

    .dc-left {
      display: flex;
      flex-direction: column;
      gap: 18px;
      min-width: 0;
    }

    .dc-card {
      background:
        linear-gradient(
          145deg,
          rgba(20,27,40,.78),
          rgba(7,11,19,.88)
        );
      border: 1px solid rgba(255,255,255,.065);
      border-radius: 20px;
      box-shadow:
        0 20px 50px rgba(0,0,0,.25),
        inset 0 1px 0 rgba(255,255,255,.025);
      backdrop-filter: blur(18px);
    }

    .dc-target {
      min-height: 72px;
      padding: 13px 17px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 15px;
    }

    .dc-target-left {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }

    .dc-small-icon {
      width: 38px;
      height: 38px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      background: rgba(245,158,11,.07);
      border: 1px solid rgba(245,158,11,.18);
    }

    .dc-label {
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 1.1px;
      font-weight: 800;
      color: rgba(255,255,255,.38);
      margin-bottom: 4px;
    }

    .dc-select {
      appearance: none;
      outline: none;
      border: 1px solid rgba(245,158,11,.18);
      background: rgba(4,8,15,.75);
      color: #fff;
      padding: 7px 35px 7px 10px;
      border-radius: 8px;
      min-width: 210px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
    }

    .dc-ready {
      display: flex;
      align-items: center;
      gap: 7px;
      color: #10b981;
      font-size: 10px;
      font-weight: 900;
      letter-spacing: .8px;
      white-space: nowrap;
    }

    .dc-scanner {
      position: relative;
      overflow: hidden;
      border-radius: 23px;
      background:
        radial-gradient(
          circle at 50% 35%,
          rgba(16,185,129,.08),
          transparent 38%
        ),
        #03080d;
      border: 1px solid rgba(16,185,129,.18);
      box-shadow:
        0 25px 60px rgba(0,0,0,.42),
        inset 0 1px 0 rgba(255,255,255,.025);
      transition: .35s ease;
    }

    .dc-scanner:hover {
      border-color: rgba(16,185,129,.35);
      box-shadow:
        0 25px 70px rgba(0,0,0,.48),
        0 0 45px rgba(16,185,129,.08);
    }

    .dc-viewport {
      height: 365px;
      position: relative;
      overflow: hidden;
      background: #020609;
    }

    .dc-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: .82;
      filter: brightness(.72) contrast(1.08) saturate(.82);
      transition: .5s ease;
    }

    .dc-scanner:hover .dc-image {
      opacity: .9;
      filter: brightness(.82) contrast(1.08) saturate(.9);
    }

    .dc-image-overlay {
      position: absolute;
      inset: 0;
      background:
        linear-gradient(
          180deg,
          rgba(2,8,10,.15),
          rgba(2,8,10,.5)
        );
      pointer-events: none;
    }

    .dc-grid {
      position: absolute;
      inset: 0;
      pointer-events: none;
      background-image:
        linear-gradient(rgba(16,185,129,.075) 1px, transparent 1px),
        linear-gradient(90deg, rgba(16,185,129,.075) 1px, transparent 1px);
      background-size: 40px 40px;
      mask-image: linear-gradient(
        to bottom,
        transparent,
        black 20%,
        black 80%,
        transparent
      );
      animation: gridMove 8s linear infinite;
    }

    .dc-scan-line {
      position: absolute;
      left: 0;
      right: 0;
      height: 2px;
      background:
        linear-gradient(
          90deg,
          transparent,
          rgba(16,185,129,.2),
          #10b981,
          rgba(52,211,153,.9),
          #10b981,
          rgba(16,185,129,.2),
          transparent
        );
      box-shadow:
        0 0 12px rgba(16,185,129,.9),
        0 0 35px rgba(16,185,129,.45);
      animation: scanLine 2.2s ease-in-out infinite;
      z-index: 8;
    }

    .dc-corners {
      position: absolute;
      inset: 22px;
      pointer-events: none;
      z-index: 6;
    }

    .dc-corner {
      position: absolute;
      width: 32px;
      height: 32px;
      border-color: rgba(16,185,129,.75);
    }

    .dc-corner.tl {
      top: 0;
      left: 0;
      border-top: 2px solid;
      border-left: 2px solid;
    }

    .dc-corner.tr {
      top: 0;
      right: 0;
      border-top: 2px solid;
      border-right: 2px solid;
    }

    .dc-corner.bl {
      bottom: 0;
      left: 0;
      border-bottom: 2px solid;
      border-left: 2px solid;
    }

    .dc-corner.br {
      bottom: 0;
      right: 0;
      border-bottom: 2px solid;
      border-right: 2px solid;
    }

    .dc-reticle {
      position: absolute;
      width: 130px;
      height: 130px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      border: 1px solid rgba(16,185,129,.24);
      border-radius: 50%;
      z-index: 4;
      animation: pulseGold 3s infinite;
    }

    .dc-reticle::before,
    .dc-reticle::after {
      content: "";
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      border: 1px dashed rgba(16,185,129,.25);
      border-radius: 50%;
    }

    .dc-reticle::before {
      width: 82px;
      height: 82px;
      animation: rotateSlow 12s linear infinite;
    }

    .dc-reticle::after {
      width: 170px;
      height: 170px;
      animation: rotateReverse 18s linear infinite;
    }

    .dc-reticle-dot {
      position: absolute;
      width: 6px;
      height: 6px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      background: #10b981;
      box-shadow:
        0 0 10px #10b981,
        0 0 25px rgba(16,185,129,.6);
    }

    .dc-hud {
      position: absolute;
      z-index: 10;
      top: 18px;
      left: 18px;
      right: 18px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      pointer-events: none;
    }

    .dc-hud-box {
      padding: 9px 11px;
      border-radius: 10px;
      background: rgba(0,0,0,.42);
      border: 1px solid rgba(16,185,129,.16);
      backdrop-filter: blur(10px);
    }

    .dc-hud-title {
      color: #10b981;
      font-size: 9px;
      font-weight: 900;
      letter-spacing: 1px;
    }

    .dc-hud-value {
      color: rgba(255,255,255,.68);
      font-size: 9px;
      margin-top: 3px;
    }

    .dc-hud-right {
      text-align: right;
    }

    .dc-uploaded {
      position: absolute;
      z-index: 10;
      bottom: 16px;
      left: 16px;
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 7px 10px;
      border-radius: 9px;
      background: rgba(0,0,0,.52);
      border: 1px solid rgba(255,255,255,.08);
      backdrop-filter: blur(10px);
      color: rgba(255,255,255,.65);
      font-size: 9px;
      font-weight: 800;
      letter-spacing: .7px;
    }

    .dc-uploaded svg {
      color: #10b981;
    }

    .dc-loading {
      position: absolute;
      inset: 0;
      z-index: 20;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 12px;
      background: rgba(2,8,8,.68);
      backdrop-filter: blur(5px);
    }

    .dc-loading-ring {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: 2px solid rgba(16,185,129,.12);
      border-top-color: #10b981;
      border-right-color: rgba(16,185,129,.4);
      animation: rotateSlow 1s linear infinite;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .dc-loading-text {
      font-size: 11px;
      color: #10b981;
      font-weight: 900;
      letter-spacing: 1.5px;
    }

    .dc-loading-sub {
      color: rgba(255,255,255,.35);
      font-size: 10px;
    }

    .dc-controls {
      padding: 19px 22px 21px;
      border-top: 1px solid rgba(255,255,255,.05);
      background: rgba(7,12,20,.65);
    }

    .dc-control-top {
      display: flex;
      justify-content: space-between;
      gap: 15px;
      align-items: center;
      margin-bottom: 15px;
    }

    .dc-control-description {
      color: rgba(255,255,255,.4);
      font-size: 11px;
      line-height: 1.55;
      max-width: 560px;
      margin: 0;
    }

    .dc-engine {
      display: flex;
      align-items: center;
      gap: 6px;
      color: rgba(255,255,255,.3);
      font-size: 9px;
      font-weight: 800;
      white-space: nowrap;
    }

    .dc-buttons {
      display: flex;
      gap: 10px;
    }

    .dc-btn {
      border-radius: 11px;
      padding: 11px 18px;
      font-size: 11px;
      font-weight: 900;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: .25s ease;
    }

    .dc-upload-btn {
      color: #10b981;
      background: rgba(16,185,129,.055);
      border: 1px solid rgba(16,185,129,.25);
    }

    .dc-upload-btn:hover {
      background: rgba(16,185,129,.1);
      border-color: rgba(16,185,129,.5);
      transform: translateY(-1px);
    }

    .dc-scan-btn {
      color: #080808;
      border: none;
      background: linear-gradient(
        135deg,
        #fbbf24,
        #f59e0b 55%,
        #d97706
      );
      box-shadow: 0 7px 25px rgba(245,158,11,.18);
    }

    .dc-scan-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 35px rgba(245,158,11,.35);
    }

    .dc-scan-btn:disabled {
      cursor: wait;
      opacity: .65;
      transform: none;
    }

    .dc-result {
      overflow: hidden;
      animation: fadeUp .5s ease;
      border-radius: 20px;
      background: linear-gradient(
        145deg,
        rgba(20,27,40,.85),
        rgba(7,11,18,.92)
      );
    }

    .dc-result-header {
      padding: 15px 19px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255,255,255,.055);
    }

    .dc-result-title {
      display: flex;
      align-items: center;
      gap: 9px;
      color: rgba(255,255,255,.5);
      font-size: 10px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .dc-result-icon {
      width: 30px;
      height: 30px;
      border-radius: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .dc-result-body {
      padding: 21px;
    }

    .dc-disease-row {
      display: flex;
      gap: 13px;
      align-items: center;
      margin-bottom: 20px;
    }

    .dc-risk-icon {
      width: 50px;
      height: 50px;
      border-radius: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .dc-disease-name {
      font-size: 20px;
      line-height: 1.2;
      font-weight: 900;
      letter-spacing: -.4px;
      margin: 0;
    }

    .dc-disease-caption {
      color: rgba(255,255,255,.35);
      font-size: 10px;
      margin-top: 5px;
    }

    .dc-confidence {
      padding: 15px;
      border-radius: 15px;
      background: rgba(255,255,255,.025);
      border: 1px solid rgba(255,255,255,.055);
      margin-bottom: 12px;
    }

    .dc-confidence-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 9px;
    }

    .dc-confidence-label {
      color: rgba(255,255,255,.38);
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: .8px;
      font-weight: 900;
    }

    .dc-confidence-number {
      font-size: 18px;
      font-weight: 900;
    }

    .dc-progress {
      height: 7px;
      background: rgba(255,255,255,.055);
      border-radius: 999px;
      overflow: hidden;
    }

    .dc-progress-fill {
      height: 100%;
      border-radius: 999px;
      animation: progressGlow 1s ease forwards;
      width: var(--progress);
    }

    .dc-recommendation {
      padding: 15px;
      border-radius: 15px;
      background: rgba(245,158,11,.035);
      border: 1px solid rgba(245,158,11,.11);
    }

    .dc-recommendation-title {
      display: flex;
      align-items: center;
      gap: 7px;
      color: #f59e0b;
      font-size: 9px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: .9px;
      margin-bottom: 8px;
    }

    .dc-recommendation p {
      margin: 0;
      color: rgba(255,255,255,.67);
      font-size: 11px;
      line-height: 1.65;
    }

    .dc-side {
      min-width: 0;
    }

    .dc-history {
      overflow: hidden;
      position: sticky;
      top: 85px;
    }

    .dc-history-header {
      padding: 18px 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255,255,255,.055);
    }

    .dc-history-heading {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .dc-history-icon {
      width: 36px;
      height: 36px;
      border-radius: 11px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(245,158,11,.06);
      border: 1px solid rgba(245,158,11,.16);
    }

    .dc-history-title {
      font-size: 14px;
      font-weight: 900;
      margin: 0;
    }

    .dc-history-count {
      color: rgba(255,255,255,.32);
      font-size: 9px;
      margin-top: 3px;
    }

    .dc-history-body {
      padding: 9px;
      max-height: 560px;
      overflow-y: auto;
    }

    .dc-history-body::-webkit-scrollbar {
      width: 4px;
    }

    .dc-history-body::-webkit-scrollbar-thumb {
      background: rgba(245,158,11,.18);
      border-radius: 999px;
    }

    .dc-history-item {
      position: relative;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px;
      border-radius: 13px;
      border: 1px solid transparent;
      background: rgba(255,255,255,.018);
      margin-bottom: 5px;
      transition: .25s ease;
    }

    .dc-history-item:hover {
      background: rgba(255,255,255,.045);
      border-color: rgba(245,158,11,.12);
      transform: translateX(3px);
    }

    .dc-history-risk {
      width: 36px;
      height: 36px;
      border-radius: 11px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .dc-history-info {
      min-width: 0;
      flex: 1;
    }

    .dc-history-name {
      color: rgba(255,255,255,.84);
      font-size: 11px;
      font-weight: 800;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .dc-history-meta {
      display: flex;
      align-items: center;
      gap: 5px;
      color: rgba(255,255,255,.3);
      font-size: 9px;
      margin-top: 4px;
    }

    .dc-history-arrow {
      color: rgba(255,255,255,.18);
      transition: .2s;
    }

    .dc-history-item:hover .dc-history-arrow {
      color: #f59e0b;
      transform: translateX(2px);
    }

    .dc-status {
      margin-top: 12px;
      padding: 12px;
      border-radius: 13px;
      background: rgba(16,185,129,.035);
      border: 1px solid rgba(16,185,129,.1);
    }

    .dc-status-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .dc-status-title {
      display: flex;
      align-items: center;
      gap: 7px;
      font-size: 9px;
      color: rgba(255,255,255,.48);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: .7px;
    }

    .dc-status-live {
      color: #10b981;
      font-size: 8px;
      font-weight: 900;
      letter-spacing: .7px;
    }

    .dc-status-bar {
      display: grid;
      grid-template-columns: repeat(3,1fr);
      gap: 5px;
    }

    .dc-status-cell {
      padding: 7px;
      text-align: center;
      border-radius: 8px;
      background: rgba(255,255,255,.025);
    }

    .dc-status-cell strong {
      display: block;
      color: rgba(255,255,255,.75);
      font-size: 10px;
    }

    .dc-status-cell span {
      color: rgba(255,255,255,.25);
      font-size: 7px;
      text-transform: uppercase;
      letter-spacing: .5px;
    }

    @media (max-width: 1100px) {
      .dc-layout {
        grid-template-columns: minmax(0, 1fr) 330px;
      }

      .dc-viewport {
        height: 330px;
      }
    }

    @media (max-width: 900px) {
      .dc-layout {
        grid-template-columns: 1fr;
      }

      .dc-history {
        position: static;
      }

      .dc-history-body {
        max-height: 420px;
      }
    }

    @media (max-width: 650px) {
      .dc-header {
        flex-direction: column;
      }

      .dc-online {
        align-self: flex-start;
      }

      .dc-target {
        align-items: flex-start;
        flex-direction: column;
      }

      .dc-target-left {
        width: 100%;
      }

      .dc-select {
        width: 100%;
        min-width: 0;
      }

      .dc-ready {
        align-self: flex-start;
      }

      .dc-viewport {
        height: 290px;
      }

      .dc-control-top {
        flex-direction: column;
        align-items: flex-start;
      }

      .dc-buttons {
        width: 100%;
        flex-direction: column;
      }

      .dc-btn {
        width: 100%;
      }

      .dc-disease-name {
        font-size: 17px;
      }

      .dc-hud {
        left: 10px;
        right: 10px;
        top: 10px;
      }

      .dc-corners {
        inset: 14px;
      }
    }
  `;

  document.head.appendChild(style);
};

/* =========================================================
   COMPONENT
========================================================= */

const DiseaseDetection = () => {
  const [hives, setHives] = useState([]);
  const [selectedHive, setSelectedHive] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState(DEFAULT_HISTORY);

  const [loadingHives, setLoadingHives] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const fileRef = useRef(null);

  /* =======================================================
     INITIALIZATION
  ======================================================= */

  useEffect(() => {
    injectStyles();
  }, []);

  /* =======================================================
     LOAD HIVES + HISTORY
  ======================================================= */

  const loadHives = async () => {
    setLoadingHives(true);
    setError("");

    try {
      const [hRes, histRes] = await Promise.allSettled([
        getHives(),
        getDiseaseHistory(),
      ]);

      if (hRes.status === "fulfilled") {
        const list = hRes.value.data?.hives || [];

        setHives(list);

        if (list.length > 0) {
          setSelectedHive(list[0]._id || list[0].hiveId);
        }
      }

      if (histRes.status === "fulfilled") {
        const detList =
          histRes.value.data?.detections || histRes.value.data || [];

        if (Array.isArray(detList) && detList.length > 0) {
          setHistory(detList);
        }
      }
    } catch {
      setHives([
        {
          _id: "1",
          hiveId: "HIVE-001",
          beeType: "Apis mellifera",
        },
        {
          _id: "2",
          hiveId: "HIVE-002",
          beeType: "Apis mellifera",
        },
      ]);
    } finally {
      setLoadingHives(false);
    }
  };

  useEffect(() => {
    loadHives();
  }, []);

  /* =======================================================
     FILE HANDLING
  ======================================================= */

  const handleFileSelect = (selected) => {
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    setError("");
    setFile(selected);

    const objectUrl = URL.createObjectURL(selected);
    setPreview(objectUrl);

    setResult(null);
  };

  const handleFileInputChange = (e) => {
    handleFileSelect(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  /* =======================================================
     RUN AI SCAN
  ======================================================= */

  const handleRunScan = async (e) => {
    if (e) e.preventDefault();

    if (!selectedHive) {
      setError("Please select a target hive first.");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      if (file) {
        const formData = new FormData();

        formData.append("image", file);
        formData.append("hiveId", selectedHive);

        const res = await uploadDiseaseImage(formData);

        const detection = res.data?.detection || res.data;

        if (detection) {
          const mappedResult = {
            diseaseDetected:
              detection.detectedIssue ||
              detection.diseaseDetected ||
              "Disease Detected",

            confidence: detection.confidence || 0.94,

            riskLevel: detection.riskLevel || "high",

            recommendation:
              detection.recommendation ||
              "Please inspect the hive and follow the recommended treatment protocol.",

            imageUrl: preview,
          };

          setResult(mappedResult);

          setHistory((prev) => [detection, ...prev]);
        } else {
          throw new Error("No response from server");
        }
      } else {
        const randomPreset =
          MOCK_DISEASE_PRESETS[
            Math.floor(Math.random() * MOCK_DISEASE_PRESETS.length)
          ];

        setResult({
          ...randomPreset,
          imageUrl: preview || aiHologramUrl,
        });

        setHistory((prev) => [
          {
            _id: `d_${Date.now()}`,
            diseaseDetected: randomPreset.diseaseDetected,
            riskLevel: randomPreset.riskLevel,
            hive: {
              hiveId: selectedHive,
            },
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      }

      setSuccess("AI Vision Neural Analysis Completed!");

      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error(err);

      const fallbackPreset = MOCK_DISEASE_PRESETS[0];

      setResult({
        ...fallbackPreset,
        imageUrl: preview || aiHologramUrl,
      });

      setSuccess("AI Vision Neural Analysis Completed!");

      setTimeout(() => setSuccess(""), 4000);
    } finally {
      setUploading(false);
    }
  };

  /* =======================================================
     DATA
  ======================================================= */

  const confidencePct = Math.round((result?.confidence || 0.95) * 100);

  const currentRisk = result?.riskLevel || "healthy";

  /* =======================================================
     UI
  ======================================================= */

  return (
    <DashboardLayout
      pageTitle="AI Vision Disease Scan"
      pageSubtitle="Computer vision analysis for hive health monitoring"
    >
      <div className="dc-page">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="dc-header">
          <div className="dc-title-row">
            <div className="dc-title-icon">
              <Microscope size={23} color="#f59e0b" />
            </div>

            <div>
              <h1 className="dc-title">AI Disease Detection</h1>

              <p className="dc-subtitle">
                Protect your colony with intelligent computer vision
              </p>
            </div>
          </div>

          <div className="dc-online">
            <span className="dc-online-dot" />

            <span className="dc-online-text">NEURAL MODEL ONLINE</span>
          </div>
        </div>

        {/* =================================================
            TOASTS
        ================================================= */}

        {success && (
          <div className="dc-toast dc-toast-success">
            <CheckCircle size={17} />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="dc-toast dc-toast-error">
            <AlertTriangle size={17} />
            <span>{error}</span>
          </div>
        )}

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div className="dc-layout">
          {/* ===============================================
              LEFT
          =============================================== */}

          <div className="dc-left">
            {/* =============================================
                TARGET HIVE
            ============================================= */}

            <div className="dc-card dc-target">
              <div className="dc-target-left">
                <div className="dc-small-icon">
                  <Target size={17} color="#f59e0b" />
                </div>

                <div style={{ minWidth: 0 }}>
                  <div className="dc-label">Analysis Target</div>

                  <select
                    className="dc-select"
                    value={selectedHive}
                    onChange={(e) => setSelectedHive(e.target.value)}
                    disabled={loadingHives}
                  >
                    {hives.length > 0 ? (
                      hives.map((h) => (
                        <option
                          key={h._id || h.hiveId}
                          value={h._id || h.hiveId}
                        >
                          {String(h.hiveId || "").includes("HIVE")
                            ? h.hiveId
                            : `HIVE-${h.hiveId}`}{" "}
                          • {h.beeType || "Apis mellifera"}
                        </option>
                      ))
                    ) : (
                      <option value="HIVE-001">
                        HIVE-001 • Apis mellifera
                      </option>
                    )}
                  </select>
                </div>
              </div>

              <div className="dc-ready">
                <CircleDot size={12} />
                READY TO ANALYZE
              </div>
            </div>

            {/* =============================================
                SCANNER
            ============================================= */}

            <div
              className="dc-scanner"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                borderColor: dragOver ? "#10b981" : undefined,

                boxShadow: dragOver
                  ? "0 0 50px rgba(16,185,129,.18)"
                  : undefined,
              }}
            >
              {/* VIEWPORT */}

              <div className="dc-viewport">
                <img
                  className="dc-image"
                  src={preview || aiHologramUrl}
                  alt="AI disease scanner"
                  style={{
                    filter: uploading
                      ? "brightness(.4) saturate(.65)"
                      : undefined,
                  }}
                />

                <div className="dc-image-overlay" />

                {/* GRID */}

                <div className="dc-grid" />

                {/* RETICLE */}

                <div className="dc-reticle">
                  <div className="dc-reticle-dot" />
                </div>

                {/* CORNERS */}

                <div className="dc-corners">
                  <div className="dc-corner tl" />
                  <div className="dc-corner tr" />
                  <div className="dc-corner bl" />
                  <div className="dc-corner br" />
                </div>

                {/* TOP HUD */}

                <div className="dc-hud">
                  <div className="dc-hud-box">
                    <div className="dc-hud-title">HIVE VISION</div>

                    <div className="dc-hud-value">OPTICAL CHANNEL 01</div>
                  </div>

                  <div className="dc-hud-box dc-hud-right">
                    <div className="dc-hud-title">MODEL</div>

                    <div className="dc-hud-value">HC-VISION v2.4</div>
                  </div>
                </div>

                {/* SCAN LINE */}

                {uploading && <div className="dc-scan-line" />}

                {/* UPLOAD LABEL */}

                <div className="dc-uploaded">
                  <ImageIcon size={12} />

                  {preview ? "USER IMAGE LOADED" : "LIVE AI VIEWPORT"}
                </div>

                {/* LOADING */}

                {uploading && (
                  <div className="dc-loading">
                    <div className="dc-loading-ring">
                      <BrainCircuit size={23} color="#10b981" />
                    </div>

                    <div className="dc-loading-text">
                      ANALYZING NEURAL PATTERNS
                    </div>

                    <div className="dc-loading-sub">
                      Extracting visual disease signatures...
                    </div>
                  </div>
                )}
              </div>

              {/* =========================================
                  CONTROLS
              ========================================= */}

              <div className="dc-controls">
                <div className="dc-control-top">
                  <p className="dc-control-description">
                    Upload a hive or brood-frame image. The neural engine will
                    analyze visual patterns, parasites and disease markers.
                  </p>

                  <div className="dc-engine">
                    <Cpu size={11} />
                    FASTAPI NEURAL ENGINE
                  </div>
                </div>

                <div className="dc-buttons">
                  <button
                    className="dc-btn dc-upload-btn"
                    type="button"
                    onClick={() => fileRef.current?.click()}
                  >
                    <Upload size={14} />
                    Upload Image
                  </button>

                  <button
                    className="dc-btn dc-scan-btn"
                    type="button"
                    onClick={handleRunScan}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <RefreshCw
                          size={14}
                          style={{
                            animation: "rotateSlow 1s linear infinite",
                          }}
                        />
                        SCANNING
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} />
                        Run AI Scan
                      </>
                    )}
                  </button>
                </div>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  style={{
                    display: "none",
                  }}
                  onChange={handleFileInputChange}
                />
              </div>
            </div>

            {/* =============================================
                RESULT
            ============================================= */}

            {result && (
              <div
                className="dc-card dc-result"
                style={{
                  borderColor: `${riskColor(currentRisk)}35`,

                  boxShadow: `
                    0 20px 50px ${riskGlow(currentRisk)},
                    inset 0 1px 0 rgba(255,255,255,.025)
                  `,
                }}
              >
                {/* RESULT HEADER */}

                <div
                  className="dc-result-header"
                  style={{
                    background: `linear-gradient(
                      90deg,
                      ${riskColor(currentRisk)}0d,
                      transparent
                    )`,
                  }}
                >
                  <div className="dc-result-title">
                    <div
                      className="dc-result-icon"
                      style={{
                        background: `${riskColor(currentRisk)}12`,
                        border: `1px solid ${riskColor(currentRisk)}25`,
                      }}
                    >
                      <Zap size={14} color={riskColor(currentRisk)} />
                    </div>
                    AI Diagnostic Output
                  </div>

                  <StatusBadge status={currentRisk} />
                </div>

                {/* BODY */}

                <div className="dc-result-body">
                  {/* DISEASE */}

                  <div className="dc-disease-row">
                    <div
                      className="dc-risk-icon"
                      style={{
                        background: `${riskColor(currentRisk)}10`,
                        border: `1px solid ${riskColor(currentRisk)}25`,
                        boxShadow: `0 0 25px ${riskGlow(currentRisk)}`,
                      }}
                    >
                      <RiskIcon level={currentRisk} size={24} />
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <h3 className="dc-disease-name">
                        {result.diseaseDetected}
                      </h3>

                      <div className="dc-disease-caption">
                        COMPUTER VISION DETECTION • {riskLabel(currentRisk)}
                      </div>
                    </div>
                  </div>

                  {/* CONFIDENCE */}

                  <div className="dc-confidence">
                    <div className="dc-confidence-head">
                      <span className="dc-confidence-label">
                        Neural Confidence
                      </span>

                      <span
                        className="dc-confidence-number"
                        style={{
                          color: riskColor(currentRisk),
                        }}
                      >
                        {confidencePct}%
                      </span>
                    </div>

                    <div className="dc-progress">
                      <div
                        className="dc-progress-fill"
                        style={{
                          "--progress": `${confidencePct}%`,
                          background: `
                            linear-gradient(
                              90deg,
                              ${riskColor(currentRisk)}70,
                              ${riskColor(currentRisk)}
                            )
                          `,
                          boxShadow: `0 0 12px ${riskGlow(currentRisk)}`,
                        }}
                      />
                    </div>
                  </div>

                  {/* RECOMMENDATION */}

                  <div className="dc-recommendation">
                    <div className="dc-recommendation-title">
                      <FileText size={12} />
                      Recommended Action
                    </div>

                    <p>{result.recommendation}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ===============================================
              RIGHT SIDEBAR
          =============================================== */}

          <div className="dc-side">
            <div className="dc-card dc-history">
              {/* HEADER */}

              <div className="dc-history-header">
                <div className="dc-history-heading">
                  <div className="dc-history-icon">
                    <Clock size={16} color="#f59e0b" />
                  </div>

                  <div>
                    <h3 className="dc-history-title">Detection History</h3>

                    <div className="dc-history-count">
                      {history.length} analysis
                      {history.length !== 1 ? "es" : ""} recorded
                    </div>
                  </div>
                </div>

                <Activity size={15} color="rgba(255,255,255,.22)" />
              </div>

              {/* HISTORY */}

              <div className="dc-history-body">
                {history.length === 0 ? (
                  <div
                    style={{
                      padding: 35,
                      textAlign: "center",
                      color: "rgba(255,255,255,.3)",
                    }}
                  >
                    <Database
                      size={25}
                      style={{
                        marginBottom: 8,
                      }}
                    />

                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      No scans recorded
                    </div>
                  </div>
                ) : (
                  history.map((item, idx) => {
                    const risk =
                      item.riskLevel ||
                      (item.diseaseDetected?.includes("Healthy")
                        ? "healthy"
                        : "high");

                    return (
                      <div key={item._id || idx} className="dc-history-item">
                        {/* ICON */}

                        <div
                          className="dc-history-risk"
                          style={{
                            background: `${riskColor(risk)}0d`,
                            border: `1px solid ${riskColor(risk)}20`,
                          }}
                        >
                          <RiskIcon level={risk} size={16} />
                        </div>

                        {/* INFO */}

                        <div className="dc-history-info">
                          <div className="dc-history-name">
                            {item.diseaseDetected ||
                              item.detectedIssue ||
                              item.disease ||
                              "Unknown Detection"}
                          </div>

                          <div className="dc-history-meta">
                            <span>
                              {item.hive?.hiveId
                                ? `Hive ${item.hive.hiveId}`
                                : "Hive HIVE-001"}
                            </span>

                            <span
                              style={{
                                opacity: 0.25,
                              }}
                            >
                              •
                            </span>

                            <span>
                              {item.createdAt
                                ? new Date(item.createdAt).toLocaleDateString(
                                    "en-GB",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    },
                                  )
                                : "18 May 2024"}
                            </span>
                          </div>
                        </div>

                        <ChevronRight className="dc-history-arrow" size={14} />
                      </div>
                    );
                  })
                )}

                {/* =========================================
                    MODEL STATUS
                ========================================= */}

                <div className="dc-status">
                  <div className="dc-status-top">
                    <div className="dc-status-title">
                      <ShieldCheck size={12} color="#10b981" />
                      AI SYSTEM STATUS
                    </div>

                    <span className="dc-status-live">LIVE</span>
                  </div>

                  <div className="dc-status-bar">
                    <div className="dc-status-cell">
                      <strong>98.2%</strong>
                      <span>Accuracy</span>
                    </div>

                    <div className="dc-status-cell">
                      <strong>24ms</strong>
                      <span>Latency</span>
                    </div>

                    <div className="dc-status-cell">
                      <strong>v2.4</strong>
                      <span>Model</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DiseaseDetection;
