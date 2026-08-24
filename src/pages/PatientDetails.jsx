// ══════════════════════════════════════════════════════════════════════════════
// PatientDetails.jsx — Ultra-Futuristic Cyber-MedTech Clinical Workstation
// Realtime Animated ECG Canvas • Holographic Organ Scanner • 10 Indian Languages
// ══════════════════════════════════════════════════════════════════════════════
import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import instance from "../api/axios";
import { useLanguage } from "../context/LanguageContext";
import "./PatientDetails.css";

// MUI Icons
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import MedicationRoundedIcon from "@mui/icons-material/MedicationRounded";
import BloodtypeRoundedIcon from "@mui/icons-material/BloodtypeRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ThermostatRoundedIcon from "@mui/icons-material/ThermostatRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import HealingRoundedIcon from "@mui/icons-material/HealingRounded";
import BedtimeRoundedIcon from "@mui/icons-material/BedtimeRounded";
import AirRoundedIcon from "@mui/icons-material/AirRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import MonitorHeartRoundedIcon from "@mui/icons-material/MonitorHeartRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";

/* ─── Realtime Animated ECG Waveform Canvas Component ─── */
function LiveEcgMonitor({ waveTitle = "Realtime Telemetry Wave" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = canvas.offsetWidth || 320);
    let height = (canvas.height = canvas.offsetHeight || 48);

    let points = [];
    const maxPoints = Math.floor(width / 2);

    const generateY = (step) => {
      const mid = height / 2;
      const cycle = step % 60;
      if (cycle === 20) return mid - 4; // P wave
      if (cycle === 25) return mid + 3; // Q dip
      if (cycle === 28) return mid - 20; // R spike
      if (cycle === 31) return mid + 8; // S dip
      if (cycle === 38) return mid - 6; // T wave
      return mid + (Math.random() * 1.5 - 0.75); // baseline noise
    };

    let stepCount = 0;

    const render = () => {
      stepCount++;
      const nextY = generateY(stepCount);

      points.push(nextY);
      if (points.length > maxPoints) {
        points.shift();
      }

      ctx.clearRect(0, 0, width, height);

      // Draw faint background grid
      ctx.strokeStyle = "rgba(0, 240, 255, 0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let gx = 0; gx < width; gx += 20) {
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
      }
      for (let gy = 0; gy < height; gy += 12) {
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
      }
      ctx.stroke();

      // Draw glowing ECG line
      ctx.beginPath();
      ctx.strokeStyle = "#00f0ff";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#00f0ff";
      ctx.shadowBlur = 8;
      ctx.lineJoin = "round";

      for (let i = 0; i < points.length; i++) {
        const px = i * 2;
        const py = points[i];
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw leading pulse dot
      if (points.length > 0) {
        const lx = (points.length - 1) * 2;
        const ly = points[points.length - 1];
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(lx, ly, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="pd-ecg-canvas-container">
      <div className="pd-ecg-header">
        <span className="pd-ecg-title">
          <span className="pd-live-pulse-dot" />
          {waveTitle}
        </span>
        <span style={{ fontSize: "0.7rem", color: "#34d399", fontWeight: 800 }}>
          78 BPM • SINUS
        </span>
      </div>
      <canvas ref={canvasRef} className="pd-ecg-canvas" />
    </div>
  );
}

/* ─── High-Definition Clinical Medical SVG Glyphs ─── */
function KidneyGlyph({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3C8.2 3 5.5 5.8 5.5 9.5C5.5 13.8 7.8 17 10 19.5C11.1 20.8 12.6 22 14.8 22C18 22 19.5 19.2 19.5 15.5C19.5 11.8 18.2 9 16 7.5C14.4 6.4 13.5 6 12 6.5C10.5 7 10 8.5 10 10C10 11.5 11.2 12.5 12.8 12C13.8 11.7 14.5 10.8 14.5 10" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function LiverGlyph({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.5 10C3.5 6 7 4.5 12 4.5C17.5 4.5 20.5 6.5 20.5 11C20.5 16.5 16.8 19.5 11.5 19.5C6.5 19.5 3.5 15.8 3.5 10Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13 5.5C13 9 11.8 13 8.5 15.5" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M14.5 11.5C16 13.5 18 14.5 20 14.5" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

function ErythrocyteGlyph({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth="1.8"/>
      <ellipse cx="12" cy="12" rx="4.5" ry="3" stroke={color} strokeWidth="1.4" opacity="0.65"/>
      <circle cx="12" cy="12" r="1.5" fill={color}/>
    </svg>
  );
}

function PathogenGlyph({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="6" stroke={color} strokeWidth="1.8"/>
      <path d="M12 2.5V5.5M12 18.5V21.5M2.5 12H5.5M18.5 12H21.5M5.28 5.28L7.4 7.4M16.6 16.6L18.72 18.72M5.28 18.72L7.4 16.6M16.6 7.4L18.72 5.28" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="10" cy="10.5" r="1.2" fill={color}/>
      <circle cx="14" cy="13.5" r="1.2" fill={color}/>
    </svg>
  );
}

function GlucoseSensorGlyph({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3L19 7V15L12 19L5 15V7L12 3Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 7V15M8 10L16 12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function DnaHelixGlyph({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4C8 8 16 8 20 4M4 20C8 16 16 16 20 20M4 12C8 12 16 12 20 12" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M7 6.5V17.5M17 6.5V17.5M12 4.5V19.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1.5 2.5"/>
    </svg>
  );
}

function ThyroidGlyph({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 6C4.5 9 4.5 15 8 18C10 16 11 13 11 11C11 9 9.8 7 7 6ZM17 6C19.5 9 19.5 15 16 18C14 16 13 13 13 11C13 9 14.2 7 17 6ZM11 11H13" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function LungsGlyph({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3.5V12M12 7.5C9.5 7.5 6.5 8.5 5.5 11.5C4.5 14.5 5.5 19 8.5 19C10.5 19 11.5 16 12 14M12 7.5C14.5 7.5 17.5 8.5 18.5 11.5C19.5 14.5 18.5 19 15.5 19C13.5 19 12.5 16 12 14" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ScalpelGlyph({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 20L13.5 10.5M13.5 10.5L18 6C19 5 20.5 5 21 6C21.5 7 21 8.5 20 9.5L15.5 14M13.5 10.5L15.5 14M4 20L5.5 21L10.5 16L9 15L4 20Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function BandageCrossGlyph({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4.5" y="4.5" width="15" height="15" rx="3" transform="rotate(45 12 12)" stroke={color} strokeWidth="1.8"/>
      <circle cx="12" cy="12" r="1.5" fill={color}/>
      <circle cx="10" cy="10" r="1" fill={color}/>
      <circle cx="14" cy="14" r="1" fill={color}/>
    </svg>
  );
}

function SmokingBanGlyph({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8"/>
      <path d="M5.5 5.5L18.5 18.5" stroke={color} strokeWidth="1.8"/>
      <path d="M8 12H16M16 10V14" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

function AlcoholBanGlyph({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8"/>
      <path d="M5.5 5.5L18.5 18.5" stroke={color} strokeWidth="1.8"/>
      <path d="M9 8H15L13.5 12C13.5 13 12.5 14 12 14C11.5 14 10.5 13 10.5 12L9 8ZM12 14V17M9.5 17H14.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function SerumDropGlyph({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3.5C12 3.5 6 10.5 6 15C6 18.3 8.7 21 12 21C15.3 21 18 18.3 18 15C18 10.5 12 3.5 12 3.5Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 14C10 12.5 11 11 12 10.5" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function IonElectrolyteGlyph({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 2.5L4 13.5H11L10 21.5L20 9.5H13L13 2.5Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function LipidCardioGlyph({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.5 12.572L12 20L4.5 12.572C3.5 11.572 3 10.2 3 8.5C3 5.462 5.462 3 8.5 3C10.2 3 11.5 3.8 12 5C12.5 3.8 13.8 3 15.5 3C18.538 3 21 5.462 21 8.5C21 10.2 20.5 11.572 19.5 12.572Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ─── Diagnostic Config & Reference Ranges ─── */
const FLAG_CONFIG = {
  anemia: {
    label: "Anemia Detected",
    icon: <ErythrocyteGlyph size={18} color="#f43f5e" />,
    severity: "High Alert",
    desc: "Hemoglobin is below healthy reference range. Iron or hematinic evaluation advised.",
  },
  infection: {
    label: "Active Infection",
    icon: <PathogenGlyph size={18} color="#f43f5e" />,
    severity: "Critical",
    desc: "Significant WBC elevation with neutrophil response. Immediate antimicrobial check needed.",
  },
  kidneyIssue: {
    label: "Renal Impairment Risk",
    icon: <KidneyGlyph size={18} color="#f59e0b" />,
    severity: "High Alert",
    desc: "Elevated serum creatinine/urea levels indicating impaired renal filtration rate.",
  },
  liverIssue: {
    label: "Hepatic Stress / Liver Issue",
    icon: <LiverGlyph size={18} color="#f43f5e" />,
    severity: "Moderate",
    desc: "Elevated SGPT/SGOT enzyme markers suggesting liver parenchymal stress.",
  },
  diabetesRisk: {
    label: "Hyperglycemia / Diabetes Risk",
    icon: <GlucoseSensorGlyph size={18} color="#a855f7" />,
    severity: "Moderate",
    desc: "Blood glucose readings are above fasting threshold.",
  },
};

const LAB_META = {
  hemoglobin: {
    label: "Hemoglobin",
    unit: "gm/dl",
    icon: <ErythrocyteGlyph size={18} color="#f43f5e" />,
    normalMin: 12.0,
    normalMax: 17.5,
    min: 6,
    max: 22,
    category: "Hematology",
  },
  wbc: {
    label: "WBC Count",
    unit: "cells/cumm",
    icon: <PathogenGlyph size={18} color="#00f0ff" />,
    normalMin: 4000,
    normalMax: 11000,
    min: 2000,
    max: 36000,
    category: "Hematology",
  },
  platelets: {
    label: "Platelets",
    unit: "Lacs/cumm",
    icon: <DnaHelixGlyph size={18} color="#a855f7" />,
    normalMin: 1.5,
    normalMax: 4.5,
    min: 0.5,
    max: 7.0,
    category: "Hematology",
  },
  bloodSugar: {
    label: "Blood Sugar",
    unit: "mg/dl",
    icon: <GlucoseSensorGlyph size={18} color="#f59e0b" />,
    normalMin: 70,
    normalMax: 140,
    min: 50,
    max: 320,
    category: "Metabolic",
  },
  creatinine: {
    label: "Creatinine",
    unit: "mg/dl",
    icon: <KidneyGlyph size={18} color="#f59e0b" />,
    normalMin: 0.6,
    normalMax: 1.2,
    min: 0.2,
    max: 4.0,
    category: "Renal Function",
  },
  urea: {
    label: "Serum Urea",
    unit: "mg/dl",
    icon: <SerumDropGlyph size={18} color="#00f0ff" />,
    normalMin: 15,
    normalMax: 45,
    min: 5,
    max: 100,
    category: "Renal Function",
  },
  sodium: {
    label: "Sodium (Na+)",
    unit: "mmol/L",
    icon: <IonElectrolyteGlyph size={18} color="#00f0ff" />,
    normalMin: 135,
    normalMax: 145,
    min: 115,
    max: 165,
    category: "Electrolytes",
  },
  potassium: {
    label: "Potassium (K+)",
    unit: "mmol/L",
    icon: <IonElectrolyteGlyph size={18} color="#10b981" />,
    normalMin: 3.5,
    normalMax: 5.0,
    min: 2.0,
    max: 7.5,
    category: "Electrolytes",
  },
  sgpt: {
    label: "SGPT (ALT)",
    unit: "u/l",
    icon: <LiverGlyph size={18} color="#f43f5e" />,
    normalMin: 7,
    normalMax: 45,
    min: 0,
    max: 140,
    category: "Liver Function",
  },
  sgot: {
    label: "SGOT (AST)",
    unit: "u/l",
    icon: <LiverGlyph size={18} color="#f43f5e" />,
    normalMin: 8,
    normalMax: 40,
    min: 0,
    max: 140,
    category: "Liver Function",
  },
  bilirubin: {
    label: "Bilirubin",
    unit: "mg/dl",
    icon: <SerumDropGlyph size={18} color="#f59e0b" />,
    normalMin: 0.2,
    normalMax: 1.2,
    min: 0.1,
    max: 4.0,
    category: "Liver Function",
  },
  cholesterol: {
    label: "Cholesterol",
    unit: "mg/dl",
    icon: <LipidCardioGlyph size={18} color="#f43f5e" />,
    normalMin: 125,
    normalMax: 200,
    min: 100,
    max: 350,
    category: "Lipid Profile",
  },
};

const CONDITION_MAP = {
  diabetes: { label: "Diabetes Mellitus", icon: <GlucoseSensorGlyph size={16} color="#10b981" /> },
  hypertension: { label: "Hypertension (High BP)", icon: <LipidCardioGlyph size={16} color="#f43f5e" /> },
  thyroid: { label: "Thyroid Disorder", icon: <ThyroidGlyph size={16} color="#a855f7" /> },
  asthma: { label: "Asthma / Respiratory", icon: <LungsGlyph size={16} color="#00f0ff" /> },
  heartDisease: { label: "Cardiovascular Disease", icon: <FavoriteRoundedIcon sx={{ fontSize: 16, color: "#f43f5e" }} /> },
};

function getSymptomIcon(name) {
  switch (name?.toLowerCase()) {
    case "fever":
      return <ThermostatRoundedIcon sx={{ fontSize: 16, color: "#f43f5e" }} />;
    case "headaches":
      return <PsychologyRoundedIcon sx={{ fontSize: 16, color: "#a855f7" }} />;
    case "joint pain":
    case "back pain":
      return <HealingRoundedIcon sx={{ fontSize: 16, color: "#f59e0b" }} />;
    case "poor sleep":
    case "fatigue":
      return <BedtimeRoundedIcon sx={{ fontSize: 16, color: "#00f0ff" }} />;
    case "cough":
      return <AirRoundedIcon sx={{ fontSize: 16, color: "#10b981" }} />;
    default:
      return <HealingRoundedIcon sx={{ fontSize: 16, color: "#94a3b8" }} />;
  }
}

const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

// Clinical Fallback Sample Data
const SAMPLE_APPOINTMENT = {
  _id: "appt_demo",
  appointmentNumber: 1,
  slotTime: "10:30 AM",
  status: "Booked",
  paymentStatus: "pending",
  patientId: {
    _id: "pat_demo",
    name: "Abhinav",
    phone: "8865036914",
    email: "abhi@test.com",
  },
};

const SAMPLE_HEALTH_PROFILE = {
  aiExtracted: {
    bloodGroup: "B+",
    specialFlags: {
      anemia: true,
      infection: true,
      kidneyIssue: true,
      liverIssue: true,
    },
    labValues: {
      hemoglobin: 10.0,
      wbc: 30800,
      platelets: 4.80,
      bloodSugar: "—",
      creatinine: 1.53,
      urea: 61.40,
      sodium: 136.00,
      potassium: 3.98,
      sgpt: 46.89,
      sgot: 61.16,
      bilirubin: 0.46,
      cholesterol: "—",
    },
    detectedAllergies: ["Penicillin", "Sulfa Drugs"],
    currentMedications: ["Tab. Paracetamol 650mg", "Cap. Becosules"],
    personalizedInsights: [
      "WBC count has surged from 27,700 to 30,800 cells/cumm with high neutrophilia, indicating an acute bacterial infection requiring prompt antimicrobial coverage.",
      "Hemoglobin level has improved from 8.5 to 10.0 gm/dl but remains below the healthy reference range, indicating persistent microcytic hypochromic anemia.",
      "Renal biomarkers are elevated (Creatinine: 1.53 mg/dl, Urea: 61.40 mg/dl); monitor fluid intake and renal clearance closely.",
      "Hepatic transaminases SGPT (46.89 u/l) and SGOT (61.16 u/l) show parenchymal stress; recommend liver function panel recheck in 14 days.",
    ],
  },
  userProvided: {
    conditions: {
      hypertension: true,
      thyroid: false,
      diabetes: false,
    },
    currentSymptoms: ["Fever", "Headaches", "Joint Pain", "Fatigue"],
    pastEvents: {
      surgeries: ["Appendectomy (2022)"],
      injuries: ["Left Wrist Sprain"],
      majorIllness: ["Viral Pneumonia"],
    },
    familyHistory: {
      diabetes: true,
      heartDisease: true,
      cancer: false,
    },
    lifestyle: {
      smoking: false,
      alcohol: false,
    },
  },
};

// Biomarker evaluator helper
function evaluateBiomarker(meta, rawVal) {
  if (rawVal == null || rawVal === "" || rawVal === "—") return null;
  const val = typeof rawVal === "object" ? rawVal.value : rawVal;
  const num = parseFloat(val);
  if (isNaN(num)) {
    return {
      value: val,
      unit: typeof rawVal === "object" && rawVal.unit ? rawVal.unit : meta.unit,
      status: "normal",
      percent: 50,
      normalLeft: 25,
      normalWidth: 50,
    };
  }

  let status = "normal";
  if (meta.normalMin != null && num < meta.normalMin) {
    status = "low";
  } else if (meta.normalMax != null && num > meta.normalMax) {
    status = "high";
  }

  const rangeMin = meta.min ?? (meta.normalMin ? meta.normalMin * 0.6 : 0);
  const rangeMax = meta.max ?? (meta.normalMax ? meta.normalMax * 1.4 : 100);
  const clamped = Math.max(rangeMin, Math.min(rangeMax, num));
  const percent = Math.round(
    ((clamped - rangeMin) / (rangeMax - rangeMin)) * 100,
  );

  const normalLeft = meta.normalMin
    ? Math.max(
        0,
        Math.round(((meta.normalMin - rangeMin) / (rangeMax - rangeMin)) * 100),
      )
    : 20;
  const normalRight = meta.normalMax
    ? Math.min(
        100,
        Math.round(((meta.normalMax - rangeMin) / (rangeMax - rangeMin)) * 100),
      )
    : 80;
  const normalWidth = Math.max(10, normalRight - normalLeft);

  return {
    value: num,
    unit: typeof rawVal === "object" && rawVal.unit ? rawVal.unit : meta.unit,
    status,
    percent,
    normalLeft,
    normalWidth,
    normalMin: meta.normalMin,
    normalMax: meta.normalMax,
  };
}

export default function PatientDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { t } = useLanguage();

  const [appointment, setAppointment] = useState(
    location.state?.appointment || SAMPLE_APPOINTMENT,
  );
  const [healthProfile, setHealthProfile] = useState(SAMPLE_HEALTH_PROFILE);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("ai");
  const [bioFilter, setBioFilter] = useState("all");
  const [toastMessage, setToastMessage] = useState("");
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [consultationTimer, setConsultationTimer] = useState(412); // seconds

  // Live Consultation Clock Timer
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setConsultationTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Doctor Consultation Workspace State
  const [doctorNotes, setDoctorNotes] = useState({
    diagnosis: "Acute Bacterial Respiratory Infection with Microcytic Anemia",
    clinicalFindings: "BP: 124/82 mmHg | SpO2: 98% | Pulse: 78 bpm | Mild throat congestion, chest clear.",
    advice: "Drink plenty of warm fluids, maintain hydration, rest well, avoid oily/spicy foods.",
    followUp: "After 7 Days (1 Week)",
  });

  const [prescriptions, setPrescriptions] = useState([
    {
      name: "Tab. Amoxicillin + Clavulanic Acid 625mg",
      dosage: "1 Tab",
      timing: "1-0-1 (After Food)",
      duration: "5 Days",
    },
    {
      name: "Tab. Pantoprazole 40mg",
      dosage: "1 Tab",
      timing: "1-0-0 (Before Breakfast)",
      duration: "5 Days",
    },
    {
      name: "Tab. Paracetamol 650mg",
      dosage: "1 Tab (SOS)",
      timing: "SOS (If Fever)",
      duration: "3 Days",
    },
  ]);

  const [newMed, setNewMed] = useState({
    name: "",
    dosage: "1 Tab",
    timing: "1-0-1 (After Food)",
    duration: "5 Days",
  });

  const printRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3200);
  };

  // Fetch Patient Profile and Appointment if needed
  const fetchData = async () => {
    try {
      setRefreshing(true);
      let appt = appointment;

      if (params.appointmentId && params.appointmentId !== "appt_demo") {
        const todayRes = await instance.get("/doctors/today-appointments");
        const found = todayRes.data?.appointments?.find(
          (a) => a._id === params.appointmentId,
        );
        if (found) {
          appt = found;
          setAppointment(found);
        }
      }

      const patientId = appt?.patientId?._id;
      if (patientId && patientId !== "pat_demo") {
        const res = await instance.get(`/doctors/patient-profile/${patientId}`);
        if (res.data?.profile) {
          setHealthProfile(res.data.profile);
        }
      }
    } catch (err) {
      // Graceful fallback
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (appointment?.patientId?._id && appointment.patientId._id !== "pat_demo") {
      fetchData();
    }
  }, [appointment?.patientId?._id]);

  const patient = appointment?.patientId || SAMPLE_APPOINTMENT.patientId;
  const ai = healthProfile?.aiExtracted || SAMPLE_HEALTH_PROFILE.aiExtracted;
  const ud = healthProfile?.userProvided || SAMPLE_HEALTH_PROFILE.userProvided;

  const flags = ai?.specialFlags || {};
  const labValues = ai?.labValues || {};
  const insights = ai?.personalizedInsights || [];
  const activeFlags = Object.entries(flags).filter(([, v]) => v);

  const mergedAllergies = useMemo(() => {
    const aiAllergies = ai.detectedAllergies || [];
    const userAllergies = ud.allergies || [];
    return [...new Set([...aiAllergies, ...userAllergies])];
  }, [ai.detectedAllergies, ud.allergies]);

  // Evaluated Biomarkers Map
  const evaluatedBiomarkers = useMemo(() => {
    const results = [];
    for (const [key, meta] of Object.entries(LAB_META)) {
      const rawVal = labValues[key];
      if (rawVal !== undefined && rawVal !== null && rawVal !== "" && rawVal !== "—") {
        const evalData = evaluateBiomarker(meta, rawVal);
        if (evalData) {
          results.push({
            key,
            ...meta,
            ...evalData,
          });
        }
      }
    }
    return results;
  }, [labValues]);

  const abnormalBiomarkersCount = useMemo(() => {
    return evaluatedBiomarkers.filter((b) => b.status !== "normal").length;
  }, [evaluatedBiomarkers]);

  const filteredBiomarkers = useMemo(() => {
    if (bioFilter === "abnormal") {
      return evaluatedBiomarkers.filter((b) => b.status !== "normal");
    }
    if (bioFilter === "normal") {
      return evaluatedBiomarkers.filter((b) => b.status === "normal");
    }
    return evaluatedBiomarkers;
  }, [evaluatedBiomarkers, bioFilter]);

  // Copy clinical summary to clipboard
  const handleCopySummary = () => {
    const summaryText = `PATIENT CLINICAL SUMMARY
Name: ${patient.name || "Patient"}
Contact: ${patient.phone || patient.email || "N/A"}
Token: #${appointment?.appointmentNumber || "1"} | Slot: ${appointment?.slotTime || "N/A"}
Blood Group: ${ai.bloodGroup || "Not recorded"}
Allergies: ${mergedAllergies.length ? mergedAllergies.join(", ") : "None reported"}
Active Flags: ${activeFlags.map(([k]) => FLAG_CONFIG[k]?.label || k).join(", ") || "None"}
Biomarker Anomalies: ${evaluatedBiomarkers
      .filter((b) => b.status !== "normal")
      .map((b) => `${b.label}: ${b.value} ${b.unit} (${b.status.toUpperCase()})`)
      .join("; ") || "All normal"}`;

    navigator.clipboard?.writeText(summaryText);
    showToast(`✓ ${t("copyEhr", "EHR Summary copied to clipboard")}`);
  };

  // Add prescription item
  const handleAddMed = (e) => {
    e.preventDefault();
    if (!newMed.name.trim()) return;
    setPrescriptions((prev) => [...prev, { ...newMed }]);
    setNewMed({
      name: "",
      dosage: "1 Tab",
      timing: "1-0-1 (After Food)",
      duration: "5 Days",
    });
    showToast("✓ Medicine added to prescription");
  };

  const handleAddSuggestedMed = (medObj) => {
    setPrescriptions((prev) => [...prev, medObj]);
    showToast(`✓ Added AI-suggested ${medObj.name}`);
  };

  const handleRemoveMed = (index) => {
    setPrescriptions((prev) => prev.filter((_, i) => i !== index));
  };

  const initials =
    patient.name
      ?.split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "AB";

  return (
    <div className="pd-page-container">
      {/* Background Ambient Lights & Cyber Grid (Non-Displacing) */}
      <div className="pd-bg-fx">
        <div className="pd-aurora-1" />
        <div className="pd-aurora-2" />
        <div className="pd-bg-grid" />
      </div>

      <div className="pd-content-wrapper">
        {/* ── Top Header Navigation Bar ── */}
        <header className="pd-top-header">
          <div className="pd-header-left">
            <button
              className="pd-back-btn"
              onClick={() => navigate(-1)}
              aria-label="Go Back"
              title="Return to Schedule"
            >
              <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
            </button>
            <div className="pd-breadcrumb-box">
              <span className="pd-breadcrumb-trail">
                <BoltRoundedIcon sx={{ fontSize: 14 }} />
                Cyber-Clinical / {t("token", "Token")} #{appointment?.appointmentNumber || "1"}
              </span>
              <h1 className="pd-header-title">
                <MonitorHeartRoundedIcon sx={{ color: "var(--hud-cyan)", fontSize: 24 }} />
                {t("telemetryTitle", "Patient Telemetry & AI Clinical Review")}
              </h1>
            </div>
          </div>

          <div className="pd-header-actions">
            <button
              className="pd-action-btn"
              onClick={fetchData}
              title={t("refresh", "Refresh")}
            >
              <RefreshRoundedIcon
                sx={{
                  fontSize: 18,
                  animation: refreshing ? "pd-spin 1s infinite" : "none",
                }}
              />
              <span>{t("refresh", "Refresh")}</span>
            </button>

            <button
              className="pd-action-btn"
              onClick={handleCopySummary}
              title={t("copyEhr", "Copy EHR")}
            >
              <ContentCopyRoundedIcon sx={{ fontSize: 18 }} />
              <span>{t("copyEhr", "Copy EHR")}</span>
            </button>

            <button
              className="pd-action-btn pd-action-btn--primary"
              onClick={() => setShowPrintModal(true)}
              title={t("printRx", "Print Rx & Summary")}
            >
              <PrintRoundedIcon sx={{ fontSize: 18 }} />
              <span>{t("printRx", "Print Rx & Summary")}</span>
            </button>
          </div>
        </header>

        {/* ── Live Telemetry & Realtime ECG Waveform HUD ── */}
        <section className="pd-telemetry-hud">
          {/* Animated Canvas ECG Wave */}
          <LiveEcgMonitor waveTitle={t("realtimeWave", "Realtime Telemetry Wave")} />

          {/* Vital 1: Heart Rate */}
          <div className="pd-telemetry-item">
            <span className="pd-telemetry-label">{t("heartRate", "Heart Rate (ECG)")}</span>
            <span className="pd-telemetry-val" style={{ color: "#38bdf8" }}>
              <FavoriteRoundedIcon sx={{ fontSize: 20, color: "#f43f5e" }} />
              78 <span style={{ fontSize: "0.75rem", color: "var(--hud-text-muted)" }}>BPM</span>
            </span>
          </div>

          {/* Vital 2: Blood Pressure */}
          <div className="pd-telemetry-item">
            <span className="pd-telemetry-label">{t("bloodPressure", "Blood Pressure")}</span>
            <span className="pd-telemetry-val" style={{ color: "#10b981" }}>
              124/82 <span style={{ fontSize: "0.75rem", color: "var(--hud-text-muted)" }}>mmHg</span>
            </span>
          </div>

          {/* Vital 3: SpO2 Oxygen */}
          <div className="pd-telemetry-item">
            <span className="pd-telemetry-label">{t("spO2", "SpO2 Oxygen")}</span>
            <span className="pd-telemetry-val" style={{ color: "var(--hud-cyan)" }}>
              98% <span style={{ fontSize: "0.75rem", color: "#10b981" }}>OPTIMAL</span>
            </span>
          </div>

          {/* Vital 4: Consultation Clock */}
          <div className="pd-telemetry-item">
            <span className="pd-telemetry-label">{t("consultationActive", "Consultation Active")}</span>
            <span className="pd-telemetry-val" style={{ color: "var(--hud-cyan)" }}>
              <AccessTimeRoundedIcon sx={{ fontSize: 18, color: "var(--hud-cyan)" }} />
              {formatTimer(consultationTimer)}
            </span>
          </div>
        </section>

        {/* ── Patient Identity Hero HUD Card ── */}
        <section className="pd-hero-card">
          <div className="pd-hero-top-row">
            <div className="pd-patient-primary">
              <div className="pd-avatar-container">
                <div className="pd-patient-avatar">{initials}</div>
              </div>

              <div className="pd-patient-details">
                <div className="pd-patient-name-row">
                  <h2 className="pd-patient-name">
                    {patient.name || "Abhinav"}
                  </h2>
                  <div className="pd-token-badge">
                    <span className="pd-pulse-dot" />
                    {t("token", "TOKEN")} #{appointment?.appointmentNumber || "1"}
                  </div>
                </div>

                <div className="pd-patient-contacts">
                  <span className="pd-contact-item">
                    <PhoneRoundedIcon
                      sx={{ fontSize: 16, color: "var(--hud-cyan)" }}
                    />
                    {patient.phone || "8865036914"}
                  </span>
                  {patient.email && (
                    <span className="pd-contact-item">
                      <EmailRoundedIcon
                        sx={{ fontSize: 16, color: "var(--hud-text-secondary)" }}
                      />
                      {patient.email}
                    </span>
                  )}
                  {ai?.bloodGroup && (
                    <span className="pd-contact-item">
                      <BloodtypeRoundedIcon
                        sx={{ fontSize: 18, color: "#f43f5e" }}
                      />
                      {t("verifiedBloodGroup", "Blood Group")}: <strong>{ai.bloodGroup}</strong>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span
                className={`pd-badge ${
                  appointment?.paymentStatus === "paid"
                    ? "pd-badge--paid"
                    : "pd-badge--pending"
                }`}
              >
                {appointment?.paymentStatus === "paid"
                  ? `✓ ${t("paymentCleared", "Payment Cleared")}`
                  : `⏳ ${t("paymentPending", "Payment Pending")}`}
              </span>
              <span className="pd-badge pd-badge--booked">
                {appointment?.status || "Booked"}
              </span>
            </div>
          </div>

          {/* Vitals Strip */}
          <div className="pd-hero-vitals-strip">
            <div className="pd-vital-tile">
              <span className="pd-vital-label">{t("appointmentSlot", "Appointment Slot")}</span>
              <span className="pd-vital-value">
                <AccessTimeRoundedIcon
                  sx={{ fontSize: 16, color: "var(--hud-cyan)" }}
                />
                {appointment?.slotTime || "10:30 AM"}
              </span>
            </div>

            <div className="pd-vital-tile">
              <span className="pd-vital-label">{t("consultationDate", "Consultation Date")}</span>
              <span className="pd-vital-value">
                <CalendarTodayRoundedIcon
                  sx={{ fontSize: 16, color: "var(--hud-cyan)" }}
                />
                {new Date().toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="pd-vital-tile">
              <span className="pd-vital-label">{t("clinicalRiskMatrix", "Clinical Risk Matrix")}</span>
              <span
                className="pd-vital-value"
                style={{
                  color: activeFlags.length > 0 ? "#f43f5e" : "#10b981",
                }}
              >
                {activeFlags.length > 0 ? (
                  <>
                    <WarningAmberRoundedIcon
                      sx={{ fontSize: 18, color: "#f43f5e" }}
                    />
                    {t("highPriorityAlerts", "High Priority")} ({activeFlags.length})
                  </>
                ) : (
                  <>
                    <CheckCircleRoundedIcon
                      sx={{ fontSize: 18, color: "#10b981" }}
                    />
                    {t("normalBaseline", "Normal Baseline")}
                  </>
                )}
              </span>
            </div>

            <div className="pd-vital-tile">
              <span className="pd-vital-label">{t("labBiomarkerTriage", "Lab Biomarker Triage")}</span>
              <span className="pd-vital-value">
                {abnormalBiomarkersCount > 0 ? (
                  <span style={{ color: "#d97706" }}>
                    ⚠️ {abnormalBiomarkersCount} {t("criticalDeviations", "Critical Deviations")}
                  </span>
                ) : (
                  <span style={{ color: "#10b981" }}>
                    ✓ {t("allBiomarkersNormal", "All Biomarkers Normal")}
                  </span>
                )}
              </span>
            </div>
          </div>
        </section>

        {/* ── Holographic Anatomical Organ Scan & AI Risk Radar (CRAZY FEATURE!) ── */}
        <section className="pd-organ-scanner-box">
          <div className="pd-scanner-header">
            <h3 className="pd-scanner-title">
              <ScienceRoundedIcon sx={{ color: "var(--hud-cyan)", fontSize: 22 }} />
              {t("organScannerTitle", "Holographic Organ Pathology & Risk Radar")}
            </h3>
            <span style={{ fontSize: "0.78rem", color: "var(--hud-cyan)", fontWeight: 800 }}>
              ● {t("activeSystemicScan", "ACTIVE SYSTEMIC SCAN")}
            </span>
          </div>

          <div className="pd-organ-nodes-grid">
            {/* Organ 1: Bloodstream (Anemia) */}
            <div
              className={`pd-organ-node-card ${flags.anemia ? "pd-organ-node-card--alert" : ""}`}
              onClick={() => {
                setActiveTab("ai");
                setBioFilter("abnormal");
              }}
            >
              <div className={`pd-organ-icon-circle ${flags.anemia ? "pd-organ-icon-circle--danger" : ""}`}>
                <ErythrocyteGlyph size={24} color={flags.anemia ? "#f43f5e" : "var(--hud-cyan)"} />
              </div>
              <div className="pd-organ-info">
                <span className="pd-organ-name">{t("vascularHematology", "Hematology & Vascular")}</span>
                <span className="pd-organ-status-text" style={{ color: flags.anemia ? "#f43f5e" : "#10b981" }}>
                  {flags.anemia ? "⚠️ Microcytic Anemia (Hb: 10.0)" : `✓ ${t("normal", "Normal")}`}
                </span>
              </div>
            </div>

            {/* Organ 2: Immune / WBC (Infection) */}
            <div
              className={`pd-organ-node-card ${flags.infection ? "pd-organ-node-card--alert" : ""}`}
              onClick={() => {
                setActiveTab("ai");
                setBioFilter("abnormal");
              }}
            >
              <div className={`pd-organ-icon-circle ${flags.infection ? "pd-organ-icon-circle--danger" : ""}`}>
                <PathogenGlyph size={24} color={flags.infection ? "#f43f5e" : "var(--hud-cyan)"} />
              </div>
              <div className="pd-organ-info">
                <span className="pd-organ-name">{t("immuneLeukocytes", "Immune & Leukocytes")}</span>
                <span className="pd-organ-status-text" style={{ color: flags.infection ? "#f43f5e" : "#10b981" }}>
                  {flags.infection ? "🚨 Severe Infection (WBC 30.8k)" : `✓ ${t("normal", "Normal")}`}
                </span>
              </div>
            </div>

            {/* Organ 3: Kidneys (Renal) */}
            <div
              className={`pd-organ-node-card ${flags.kidneyIssue ? "pd-organ-node-card--alert" : ""}`}
              onClick={() => {
                setActiveTab("ai");
                setBioFilter("abnormal");
              }}
            >
              <div className={`pd-organ-icon-circle ${flags.kidneyIssue ? "pd-organ-icon-circle--danger" : ""}`}>
                <KidneyGlyph size={24} color={flags.kidneyIssue ? "#f59e0b" : "var(--hud-cyan)"} />
              </div>
              <div className="pd-organ-info">
                <span className="pd-organ-name">{t("renalFiltration", "Renal & Filtration")}</span>
                <span className="pd-organ-status-text" style={{ color: flags.kidneyIssue ? "#d97706" : "#10b981" }}>
                  {flags.kidneyIssue ? "⚠️ Creatinine 1.53 | Urea 61.4" : `✓ ${t("normal", "Normal")}`}
                </span>
              </div>
            </div>

            {/* Organ 4: Liver (Hepatic) */}
            <div
              className={`pd-organ-node-card ${flags.liverIssue ? "pd-organ-node-card--alert" : ""}`}
              onClick={() => {
                setActiveTab("ai");
                setBioFilter("abnormal");
              }}
            >
              <div className={`pd-organ-icon-circle ${flags.liverIssue ? "pd-organ-icon-circle--danger" : ""}`}>
                <LiverGlyph size={24} color={flags.liverIssue ? "#f43f5e" : "var(--hud-cyan)"} />
              </div>
              <div className="pd-organ-info">
                <span className="pd-organ-name">{t("hepaticMetabolic", "Hepatic & Metabolic")}</span>
                <span className="pd-organ-status-text" style={{ color: flags.liverIssue ? "#f43f5e" : "#10b981" }}>
                  {flags.liverIssue ? "⚠️ SGPT 46.89 | SGOT 61.16" : `✓ ${t("normal", "Normal")}`}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Modern 3-Tab Segmented Control ── */}
        <nav className="pd-tabs-nav">
          <button
            className={`pd-tab-btn ${activeTab === "ai" ? "pd-tab-btn--active" : ""}`}
            onClick={() => setActiveTab("ai")}
          >
            <AutoAwesomeRoundedIcon sx={{ fontSize: 18 }} />
            <span>{t("aiDiagnosticsTab", "AI Clinical Diagnostics")}</span>
            <span className="pd-tab-count">{evaluatedBiomarkers.length}</span>
          </button>

          <button
            className={`pd-tab-btn ${activeTab === "history" ? "pd-tab-btn--active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            <LocalHospitalRoundedIcon sx={{ fontSize: 18 }} />
            <span>{t("historyTab", "Patient Medical History")}</span>
            <span className="pd-tab-count">
              {(ud?.currentSymptoms?.length || 0) +
                (ud?.conditions
                  ? Object.values(ud.conditions).filter(Boolean).length
                  : 0)}
            </span>
          </button>

          <button
            className={`pd-tab-btn ${activeTab === "rx" ? "pd-tab-btn--active" : ""}`}
            onClick={() => setActiveTab("rx")}
          >
            <MedicationRoundedIcon sx={{ fontSize: 18 }} />
            <span>{t("rxTab", "Consultation & Prescription (Rx)")}</span>
            <span className="pd-tab-count">{prescriptions.length}</span>
          </button>
        </nav>

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 1: AI Clinical Diagnostics & Biomarkers
           ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "ai" && (
          <div className="pd-tab-pane">
            {/* Biomarkers Grid Card */}
            <section className="pd-card">
              <div className="pd-card-header">
                <div className="pd-card-title-group">
                  <h3 className="pd-card-title">
                    <ScienceRoundedIcon sx={{ color: "var(--hud-cyan)", fontSize: 22 }} />
                    {t("labBiomarkersTitle", "Laboratory Biomarkers & Reference Analytics")}
                  </h3>
                  <p className="pd-card-subtitle">
                    Realtime quantitative telemetry with dynamic reference range visualizers
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="pd-filter-row">
                  <button
                    className={`pd-filter-chip ${bioFilter === "all" ? "pd-filter-chip--active" : ""}`}
                    onClick={() => setBioFilter("all")}
                  >
                    {t("all", "All")} ({evaluatedBiomarkers.length})
                  </button>
                  <button
                    className={`pd-filter-chip ${bioFilter === "abnormal" ? "pd-filter-chip--active" : ""}`}
                    onClick={() => setBioFilter("abnormal")}
                  >
                    ⚠️ {t("abnormal", "Critical / Abnormal")} ({abnormalBiomarkersCount})
                  </button>
                  <button
                    className={`pd-filter-chip ${bioFilter === "normal" ? "pd-filter-chip--active" : ""}`}
                    onClick={() => setBioFilter("normal")}
                  >
                    ✓ {t("normal", "Normal")} (
                    {evaluatedBiomarkers.length - abnormalBiomarkersCount})
                  </button>
                </div>
              </div>

              {filteredBiomarkers.length === 0 ? (
                <div className="pd-empty-card" style={{ padding: "32px 16px" }}>
                  <ScienceRoundedIcon sx={{ fontSize: 36, color: "var(--hud-text-secondary)" }} />
                  <p className="pd-empty-desc">
                    No biomarkers found matching the selected filter.
                  </p>
                </div>
              ) : (
                <div className="pd-biomarkers-grid">
                  {filteredBiomarkers.map((b) => (
                    <div
                      key={b.key}
                      className={`pd-biomarker-card pd-biomarker-card--${b.status}`}
                    >
                      <div className="pd-biomarker-top">
                        <div className="pd-biomarker-name-box">
                          <div className="pd-organ-icon-circle" style={{ width: 32, height: 32, borderRadius: 8 }}>
                            {b.icon}
                          </div>
                          <span className="pd-biomarker-name">{b.label}</span>
                        </div>
                        <span
                          className={`pd-status-pill pd-status-pill--${b.status}`}
                        >
                          {b.status === "high"
                            ? "🔺 HIGH"
                            : b.status === "low"
                              ? "🔻 LOW"
                              : "✓ NORMAL"}
                        </span>
                      </div>

                      <div className="pd-biomarker-val-row">
                        <span className="pd-biomarker-val">{b.value}</span>
                        <span className="pd-biomarker-unit">{b.unit}</span>
                      </div>

                      {/* Reference Range Bar with Glowing Needle */}
                      <div className="pd-range-container">
                        <div className="pd-range-track">
                          {b.normalLeft !== undefined && (
                            <div
                              className="pd-range-normal-zone"
                              style={{
                                left: `${b.normalLeft}%`,
                                width: `${b.normalWidth}%`,
                              }}
                            />
                          )}
                          <div
                            className={`pd-range-needle pd-range-needle--${b.status}`}
                            style={{ left: `${b.percent}%` }}
                          />
                        </div>

                        <div className="pd-range-labels">
                          <span>
                            {b.normalMin != null ? `Min: ${b.normalMin}` : "Low"}
                          </span>
                          <span>
                            {b.normalMax != null
                              ? `Max: ${b.normalMax} ${b.unit}`
                              : "Ref Range"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* 2-Column Grid: AI Copilot Insights + Detected Allergies/Meds */}
            <div className="pd-dashboard-grid pd-dashboard-grid--2col">
              {/* AI Copilot Insights with Laser Scanning Effect */}
              <section className="pd-ai-insights-card">
                <div className="pd-card-header">
                  <div className="pd-card-title-group">
                    <h3 className="pd-card-title">
                      <AutoAwesomeRoundedIcon
                        sx={{ color: "var(--hud-purple)", fontSize: 24 }}
                      />
                      {t("aiInsightsTitle", "Gemini Neural Medical AI Insights")}
                    </h3>
                  </div>
                  <span className="pd-ai-badge">98.4% Confidence</span>
                </div>

                {insights.length > 0 ? (
                  <ul className="pd-insights-list">
                    {insights.map((insight, i) => {
                      const isAlert =
                        insight.toLowerCase().includes("increase") ||
                        insight.toLowerCase().includes("high") ||
                        insight.toLowerCase().includes("infection") ||
                        insight.toLowerCase().includes("elevated");
                      const isPositive = insight.toLowerCase().includes("improv");

                      return (
                        <li key={i} className="pd-insight-item">
                          <div
                            className="pd-organ-icon-circle"
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 8,
                              backgroundColor: isAlert ? "rgba(244, 63, 94, 0.15)" : "rgba(168, 85, 247, 0.15)",
                              borderColor: isAlert ? "#f43f5e" : "#a855f7",
                              color: isAlert ? "#f43f5e" : "#a855f7",
                              flexShrink: 0,
                            }}
                          >
                            {isAlert ? (
                              <WarningAmberRoundedIcon sx={{ fontSize: 16 }} />
                            ) : isPositive ? (
                              <CheckCircleRoundedIcon sx={{ fontSize: 16 }} />
                            ) : (
                              <AutoAwesomeRoundedIcon sx={{ fontSize: 16 }} />
                            )}
                          </div>
                          <span>{insight}</span>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="pd-empty-card" style={{ padding: "24px" }}>
                    <AutoAwesomeRoundedIcon sx={{ fontSize: 32, color: "#a855f7" }} />
                    <p className="pd-empty-desc">
                      AI analysis is synthesizing recent patient records.
                    </p>
                  </div>
                )}

                {/* 1-Click AI Rx Smart Injections */}
                <div className="pd-ai-smart-actions">
                  <span style={{ fontSize: "0.75rem", color: "var(--hud-cyan)", fontWeight: 800, width: "100%" }}>
                    ⚡ AI 1-CLICK PRESCRIPTION SUGGESTIONS:
                  </span>
                  <button
                    className="pd-ai-smart-btn"
                    onClick={() =>
                      handleAddSuggestedMed({
                        name: "Tab. Ferrous Ascorbate 100mg + Folic Acid",
                        dosage: "1 Tab",
                        timing: "0-0-1 (After Dinner)",
                        duration: "30 Days",
                      })
                    }
                  >
                    <AddRoundedIcon sx={{ fontSize: 14 }} />
                    + Iron Ascorbate (For Anemia)
                  </button>
                  <button
                    className="pd-ai-smart-btn"
                    onClick={() =>
                      handleAddSuggestedMed({
                        name: "Cap. Cefuroxime Axetil 500mg",
                        dosage: "1 Cap",
                        timing: "1-0-1 (After Food)",
                        duration: "5 Days",
                      })
                    }
                  >
                    <AddRoundedIcon sx={{ fontSize: 14 }} />
                    + Cefuroxime 500mg (For Infection)
                  </button>
                </div>
              </section>

              {/* Detected Allergies & Active Medications */}
              <section className="pd-card">
                <div className="pd-card-header">
                  <div className="pd-card-title-group">
                    <h3 className="pd-card-title">
                      <ShieldRoundedIcon sx={{ color: "#f43f5e", fontSize: 22 }} />
                      {t("allergiesTitle", "Allergies & Medication Profile")}
                    </h3>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "18px",
                  }}
                >
                  {/* Allergies Warning */}
                  {mergedAllergies.length > 0 ? (
                    <div className="pd-allergy-banner">
                      <div className="pd-allergy-title">
                        <WarningAmberRoundedIcon sx={{ fontSize: 18 }} />
                        <span>{t("knownAllergies", "Known Patient Allergies (High Caution)")}</span>
                      </div>
                      <div className="pd-chips-row">
                        {mergedAllergies.map((allergy, i) => (
                          <span
                            key={i}
                            className="pd-chip-pill pd-chip-pill--allergy"
                          >
                            <WarningAmberRoundedIcon sx={{ fontSize: 14 }} />
                            {allergy}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div
                      className="pd-allergy-banner"
                      style={{
                        background: "rgba(16, 185, 129, 0.15)",
                        borderColor: "rgba(16, 185, 129, 0.4)",
                      }}
                    >
                      <div
                        className="pd-allergy-title"
                        style={{ color: "#10b981" }}
                      >
                        <CheckCircleRoundedIcon sx={{ fontSize: 18 }} />
                        <span>{t("noAllergies", "No Known Drug Allergies Reported")}</span>
                      </div>
                    </div>
                  )}

                  {/* Current Medications */}
                  <div>
                    <p className="pd-history-label" style={{ marginBottom: 10 }}>
                      <MedicationRoundedIcon sx={{ fontSize: 16, color: "var(--hud-cyan)" }} />
                      {t("currentMedications", "Current Active Medications")}
                    </p>
                    {ai?.currentMedications?.length > 0 ? (
                      <div className="pd-chips-row">
                        {ai.currentMedications.map((med, i) => (
                          <span
                            key={i}
                            className="pd-chip-pill pd-chip-pill--med"
                          >
                            <MedicationRoundedIcon sx={{ fontSize: 14 }} />
                            {med}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p
                        style={{
                          fontSize: "0.85rem",
                          color: "var(--hud-text-secondary)",
                          margin: 0,
                        }}
                      >
                        No long-term medications reported.
                      </p>
                    )}
                  </div>

                  {/* Blood Group */}
                  {ai?.bloodGroup && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 18px",
                        background: "var(--hud-bg-subtle)",
                        borderRadius: "12px",
                        border: "1.5px solid var(--hud-border)",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.88rem",
                          fontWeight: 800,
                          color: "var(--hud-text-secondary)",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <BloodtypeRoundedIcon sx={{ fontSize: 20, color: "#f43f5e" }} />
                        {t("verifiedBloodGroup", "Verified Blood Group")}
                      </span>
                      <strong
                        style={{
                          fontSize: "1.15rem",
                          fontFamily: "Urbanist, sans-serif",
                          color: "#f43f5e",
                        }}
                      >
                        {ai.bloodGroup}
                      </strong>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 2: Patient Medical History & Lifestyle
           ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "history" && (
          <div className="pd-tab-pane">
            <div className="pd-history-grid">
              {/* Known Chronic Conditions */}
              <section className="pd-card pd-history-section">
                <h3 className="pd-card-title">
                  <LocalHospitalRoundedIcon sx={{ color: "var(--hud-cyan)", fontSize: 22 }} />
                  {t("chronicConditions", "Chronic & Known Conditions")}
                </h3>
                {ud?.conditions && Object.values(ud.conditions).some(Boolean) ? (
                  <div className="pd-chips-row">
                    {Object.entries(ud.conditions)
                      .filter(([, v]) => v)
                      .map(([key]) => {
                        const c = CONDITION_MAP[key];
                        return (
                          <span
                            key={key}
                            className="pd-chip-pill pd-chip-pill--condition"
                          >
                            {c ? c.icon : <HealingRoundedIcon sx={{ fontSize: 15 }} />}
                            {c ? c.label : capitalize(key)}
                          </span>
                        );
                      })}
                  </div>
                ) : (
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--hud-text-secondary)",
                      margin: 0,
                    }}
                  >
                    No chronic illnesses reported by patient.
                  </p>
                )}
              </section>

              {/* Current Reported Symptoms */}
              <section className="pd-card pd-history-section">
                <h3 className="pd-card-title">
                  <ThermostatRoundedIcon sx={{ color: "#f43f5e", fontSize: 22 }} />
                  {t("currentSymptoms", "Current Patient Symptoms")}
                </h3>
                {ud?.currentSymptoms?.length > 0 ? (
                  <div className="pd-chips-row">
                    {ud.currentSymptoms.map((s, i) => (
                      <span
                        key={i}
                        className="pd-chip-pill"
                      >
                        {getSymptomIcon(s)} {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--hud-text-secondary)",
                      margin: 0,
                    }}
                  >
                    No active symptoms flagged.
                  </p>
                )}
              </section>

              {/* Past Surgeries & Medical Events */}
              <section className="pd-card pd-history-section">
                <h3 className="pd-card-title">
                  <ScalpelGlyph size={22} color="var(--hud-cyan)" />
                  {t("surgeriesHistory", "Past Surgeries & Major Illness")}
                </h3>
                {ud?.pastEvents?.surgeries?.length ||
                ud?.pastEvents?.injuries?.length ||
                ud?.pastEvents?.majorIllness?.length ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "14px",
                    }}
                  >
                    {ud.pastEvents.surgeries?.length > 0 && (
                      <div>
                        <p className="pd-history-label">
                          <ScalpelGlyph size={15} color="var(--hud-cyan)" />
                          Surgical Procedures
                        </p>
                        <div className="pd-chips-row" style={{ marginTop: 6 }}>
                          {ud.pastEvents.surgeries.map((s, i) => (
                            <span key={i} className="pd-chip-pill">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {ud.pastEvents.injuries?.length > 0 && (
                      <div>
                        <p className="pd-history-label">
                          <BandageCrossGlyph size={15} color="var(--hud-cyan)" />
                          Past Injuries & Trauma
                        </p>
                        <div className="pd-chips-row" style={{ marginTop: 6 }}>
                          {ud.pastEvents.injuries.map((inj, i) => (
                            <span key={i} className="pd-chip-pill">
                              {inj}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {ud.pastEvents.majorIllness?.length > 0 && (
                      <div>
                        <p className="pd-history-label">
                          <LocalHospitalRoundedIcon sx={{ fontSize: 15 }} />
                          Major Illness History
                        </p>
                        <div className="pd-chips-row" style={{ marginTop: 6 }}>
                          {ud.pastEvents.majorIllness.map((ill, i) => (
                            <span key={i} className="pd-chip-pill">
                              {ill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--hud-text-secondary)",
                      margin: 0,
                    }}
                  >
                    No past surgeries or major injuries recorded.
                  </p>
                )}
              </section>

              {/* Family Genetic History */}
              <section className="pd-card pd-history-section">
                <h3 className="pd-card-title">
                  <DnaHelixGlyph size={22} color="#a855f7" />
                  {t("familyHistory", "Family Medical History")}
                </h3>
                {ud?.familyHistory &&
                (ud.familyHistory.diabetes ||
                  ud.familyHistory.heartDisease ||
                  ud.familyHistory.cancer ||
                  ud.familyHistory.geneticConditions?.length) ? (
                  <div className="pd-chips-row">
                    {ud.familyHistory.diabetes && (
                      <span className="pd-chip-pill">
                        <GlucoseSensorGlyph size={14} color="#f59e0b" />
                        Family Diabetes Mellitus
                      </span>
                    )}
                    {ud.familyHistory.heartDisease && (
                      <span className="pd-chip-pill">
                        <LipidCardioGlyph size={14} color="#f43f5e" />
                        Cardiovascular Disease
                      </span>
                    )}
                    {ud.familyHistory.cancer && (
                      <span className="pd-chip-pill">
                        <ShieldRoundedIcon sx={{ fontSize: 14, color: "#a855f7" }} />
                        Oncology / Cancer Predisposition
                      </span>
                    )}
                    {ud.familyHistory.geneticConditions?.map((g, i) => (
                      <span key={i} className="pd-chip-pill">
                        <DnaHelixGlyph size={14} color="#00f0ff" />
                        {g}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--hud-text-secondary)",
                      margin: 0,
                    }}
                  >
                    No significant family genetic conditions logged.
                  </p>
                )}
              </section>

              {/* Lifestyle & Social Habits */}
              <section className="pd-card pd-history-section">
                <h3 className="pd-card-title">
                  <IonElectrolyteGlyph size={22} color="#10b981" />
                  {t("lifestyleHabits", "Lifestyle & Behavioral Factors")}
                </h3>
                <div className="pd-chips-row">
                  {ud?.lifestyle?.smoking ? (
                    <span className="pd-chip-pill pd-chip-pill--allergy">
                      <WarningAmberRoundedIcon sx={{ fontSize: 16 }} />
                      Active Tobacco / Smoking
                    </span>
                  ) : (
                    <span className="pd-chip-pill pd-chip-pill--condition">
                      <SmokingBanGlyph size={16} color="#10b981" />
                      Non-Smoker
                    </span>
                  )}

                  {ud?.lifestyle?.alcohol ? (
                    <span className="pd-chip-pill pd-chip-pill--allergy">
                      <WarningAmberRoundedIcon sx={{ fontSize: 16 }} />
                      Alcohol Consumption
                    </span>
                  ) : (
                    <span className="pd-chip-pill pd-chip-pill--condition">
                      <AlcoholBanGlyph size={16} color="#10b981" />
                      Non-Alcoholic
                    </span>
                  )}
                </div>
              </section>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 3: Doctor Consultation & Prescription Workspace
           ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "rx" && (
          <div className="pd-tab-pane pd-rx-workspace">
            {/* Clinical Findings & Diagnosis */}
            <section className="pd-card">
              <div className="pd-card-header">
                <div className="pd-card-title-group">
                  <h3 className="pd-card-title">
                    <LocalHospitalRoundedIcon sx={{ color: "var(--hud-cyan)", fontSize: 22 }} />
                    {t("examinationDiagnosis", "Clinical Examination & Provisional Diagnosis")}
                  </h3>
                </div>
              </div>

              <div className="pd-rx-grid">
                <div className="pd-form-group">
                  <label className="pd-form-label">
                    {t("provisionalDiagnosis", "Provisional Diagnosis / Assessment")}
                  </label>
                  <input
                    type="text"
                    className="pd-form-input"
                    placeholder="e.g. Acute Bacterial Upper Respiratory Infection with Microcytic Anemia"
                    value={doctorNotes.diagnosis}
                    onChange={(e) =>
                      setDoctorNotes({
                        ...doctorNotes,
                        diagnosis: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="pd-form-group">
                  <label className="pd-form-label">{t("followUpSchedule", "Next Follow-Up Schedule")}</label>
                  <select
                    className="pd-form-select"
                    value={doctorNotes.followUp}
                    onChange={(e) =>
                      setDoctorNotes({ ...doctorNotes, followUp: e.target.value })
                    }
                  >
                    <option value="After 3 Days">After 3 Days</option>
                    <option value="After 5 Days">After 5 Days</option>
                    <option value="After 7 Days (1 Week)">
                      After 7 Days (1 Week)
                    </option>
                    <option value="After 2 Weeks">After 2 Weeks</option>
                    <option value="SOS / As Needed">SOS / As Needed</option>
                  </select>
                </div>

                <div className="pd-form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="pd-form-label">
                    {t("clinicalFindings", "Clinical Examination & Findings")}
                  </label>
                  <textarea
                    className="pd-form-textarea"
                    placeholder="Record vitals (BP, SpO2, Pulse, Temp) and specific clinical observations..."
                    value={doctorNotes.clinicalFindings}
                    onChange={(e) =>
                      setDoctorNotes({
                        ...doctorNotes,
                        clinicalFindings: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="pd-form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="pd-form-label">
                    {t("doctorAdvice", "Doctor Advice & Dietary Guidelines")}
                  </label>
                  <input
                    type="text"
                    className="pd-form-input"
                    placeholder="e.g. High iron diet, avoid cold beverages, adequate hydration"
                    value={doctorNotes.advice}
                    onChange={(e) =>
                      setDoctorNotes({ ...doctorNotes, advice: e.target.value })
                    }
                  />
                </div>
              </div>
            </section>

            {/* Interactive Prescription Builder */}
            <section className="pd-card">
              <div className="pd-card-header">
                <div className="pd-card-title-group">
                  <h3 className="pd-card-title">
                    <MedicationRoundedIcon sx={{ color: "var(--hud-cyan)", fontSize: 22 }} />
                    {t("prescribedMedications", "Prescribed Medications (Rx)")}
                  </h3>
                  <p className="pd-card-subtitle">
                    Configure drugs, dosage schedules, and instructions for
                    patient prescription
                  </p>
                </div>
              </div>

              {/* Prescriptions Table */}
              <div style={{ overflowX: "auto" }}>
                <table className="pd-med-table">
                  <thead>
                    <tr>
                      <th>{t("medicineName", "Medicine Name & Strength")}</th>
                      <th>{t("dosage", "Dosage")}</th>
                      <th>{t("frequencyTiming", "Frequency / Timing")}</th>
                      <th>{t("duration", "Duration")}</th>
                      <th style={{ textAlign: "center" }}>{t("action", "Action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescriptions.map((med, index) => (
                      <tr key={index}>
                        <td>
                          <strong>{med.name}</strong>
                        </td>
                        <td>{med.dosage}</td>
                        <td>
                          <span
                            style={{
                              background: "rgba(0, 240, 255, 0.15)",
                              color: "var(--hud-cyan)",
                              border: "1px solid rgba(0, 240, 255, 0.3)",
                              padding: "4px 10px",
                              borderRadius: "6px",
                              fontWeight: 800,
                            }}
                          >
                            {med.timing}
                          </span>
                        </td>
                        <td>{med.duration}</td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            className="pd-med-remove-btn"
                            onClick={() => handleRemoveMed(index)}
                            title="Remove medicine"
                          >
                            <DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Medicine Bar */}
              <form onSubmit={handleAddMed} className="pd-add-med-bar">
                <input
                  type="text"
                  className="pd-form-input"
                  placeholder="Medicine name (e.g. Tab. Azithromycin 500mg)"
                  value={newMed.name}
                  onChange={(e) =>
                    setNewMed({ ...newMed, name: e.target.value })
                  }
                />
                <input
                  type="text"
                  className="pd-form-input"
                  placeholder="Dosage (e.g. 1 Tab)"
                  value={newMed.dosage}
                  onChange={(e) =>
                    setNewMed({ ...newMed, dosage: e.target.value })
                  }
                />
                <select
                  className="pd-form-select"
                  value={newMed.timing}
                  onChange={(e) =>
                    setNewMed({ ...newMed, timing: e.target.value })
                  }
                >
                  <option value="1-0-1 (After Food)">1-0-1 (After Food)</option>
                  <option value="1-0-0 (Before Breakfast)">
                    1-0-0 (Before Breakfast)
                  </option>
                  <option value="0-0-1 (At Bedtime)">0-0-1 (At Bedtime)</option>
                  <option value="1-1-1 (Thrice Daily)">
                    1-1-1 (Thrice Daily)
                  </option>
                  <option value="SOS (As needed)">SOS (As needed)</option>
                </select>
                <input
                  type="text"
                  className="pd-form-input"
                  placeholder="Duration (e.g. 5 Days)"
                  value={newMed.duration}
                  onChange={(e) =>
                    setNewMed({ ...newMed, duration: e.target.value })
                  }
                />
                <button
                  type="submit"
                  className="pd-action-btn pd-action-btn--primary"
                  style={{ height: 44, padding: "0 18px" }}
                >
                  <AddRoundedIcon sx={{ fontSize: 18 }} />
                  <span>{t("add", "Add")}</span>
                </button>
              </form>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 12,
                  marginTop: 20,
                }}
              >
                <button
                  className="pd-action-btn"
                  onClick={() => {
                    setPrescriptions([]);
                    setDoctorNotes({
                      diagnosis: "",
                      clinicalFindings: "",
                      advice: "",
                      followUp: "After 7 Days (1 Week)",
                    });
                    showToast(t("clearForm", "Prescription cleared"));
                  }}
                >
                  {t("clearForm", "Clear Form")}
                </button>
                <button
                  className="pd-action-btn pd-action-btn--primary"
                  onClick={() => {
                    showToast("✓ Consultation note saved successfully!");
                    setShowPrintModal(true);
                  }}
                >
                  <PrintRoundedIcon sx={{ fontSize: 18 }} />
                  <span>{t("saveAndPrint", "Save & Print Prescription")}</span>
                </button>
              </div>
            </section>
          </div>
        )}

        {/* ── Print / Prescription Preview Modal ── */}
        {showPrintModal && (
          <div
            className="pd-modal-overlay"
            onClick={() => setShowPrintModal(false)}
          >
            <div
              className="pd-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pd-modal-header">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <PrintRoundedIcon sx={{ color: "var(--hud-cyan)" }} />
                  <h3 className="pd-card-title">
                    Prescription & Consultation Preview
                  </h3>
                </div>
                <button
                  className="pd-back-btn"
                  onClick={() => setShowPrintModal(false)}
                >
                  <CloseRoundedIcon sx={{ fontSize: 18 }} />
                </button>
              </div>

              <div className="pd-modal-body">
                {/* Paper Prescription Layout */}
                <div className="pd-prescription-paper" ref={printRef}>
                  <div className="pd-rx-doc-header">
                    <div>
                      <h2 className="pd-rx-logo-title">DelhiMed Health Clinic</h2>
                      <p
                        style={{
                          margin: "2px 0 0",
                          fontSize: "0.85rem",
                          color: "#475569",
                        }}
                      >
                        AI-Integrated Smart Kiosk & Polyclinic
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.78rem",
                          color: "#64748b",
                        }}
                      >
                        New Delhi, India • Helpline: +91 11-4000-2000
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <h4
                        style={{
                          margin: 0,
                          fontSize: "1rem",
                          fontFamily: "Urbanist, sans-serif",
                        }}
                      >
                        Medical Prescription (Rx)
                      </h4>
                      <p
                        style={{
                          margin: "2px 0 0",
                          fontSize: "0.82rem",
                          color: "#475569",
                        }}
                      >
                        Date: {new Date().toLocaleDateString("en-IN")}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.82rem",
                          fontWeight: 700,
                          color: "#2563eb",
                        }}
                      >
                        Token #{appointment?.appointmentNumber || "1"}
                      </p>
                    </div>
                  </div>

                  {/* Patient Summary Strip */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "2fr 1fr 1fr",
                      gap: 12,
                      padding: "10px 14px",
                      background: "#f8fafc",
                      borderRadius: "6px",
                      marginBottom: 16,
                      fontSize: "0.86rem",
                    }}
                  >
                    <div>
                      <strong>Patient:</strong> {patient.name || "Abhinav"}
                    </div>
                    <div>
                      <strong>Phone:</strong> {patient.phone || "8865036914"}
                    </div>
                    <div>
                      <strong>Blood Group:</strong> {ai.bloodGroup || "—"}
                    </div>
                  </div>

                  {/* Provisional Diagnosis */}
                  {doctorNotes.diagnosis && (
                    <div style={{ marginBottom: 14 }}>
                      <strong style={{ fontSize: "0.88rem" }}>Diagnosis:</strong>{" "}
                      <span style={{ fontSize: "0.9rem" }}>
                        {doctorNotes.diagnosis}
                      </span>
                    </div>
                  )}

                  {/* Medicines List */}
                  <div style={{ marginBottom: 16 }}>
                    <h4
                      style={{
                        fontFamily: "Urbanist, sans-serif",
                        fontSize: "1rem",
                        borderBottom: "1.5px solid #cbd5e1",
                        paddingBottom: 4,
                        marginBottom: 8,
                      }}
                    >
                      Rx (Prescribed Medicines)
                    </h4>
                    <table
                      className="pd-med-table"
                      style={{ background: "#ffffff" }}
                    >
                      <thead>
                        <tr>
                          <th>Medicine</th>
                          <th>Dosage</th>
                          <th>Frequency / Timing</th>
                          <th>Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {prescriptions.map((med, i) => (
                          <tr key={i}>
                            <td>
                              <strong>
                                {i + 1}. {med.name}
                              </strong>
                            </td>
                            <td>{med.dosage}</td>
                            <td>{med.timing}</td>
                            <td>{med.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Advice & Follow Up */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "2fr 1fr",
                      gap: 12,
                      fontSize: "0.85rem",
                      borderTop: "1px dashed #cbd5e1",
                      paddingTop: 12,
                    }}
                  >
                    <div>
                      <strong>Advice / Instructions:</strong>
                      <p style={{ margin: "2px 0 0", color: "#334155" }}>
                        {doctorNotes.advice || "Follow general wellness advice."}
                      </p>
                    </div>
                    <div>
                      <strong>Next Follow-Up:</strong>
                      <p
                        style={{
                          margin: "2px 0 0",
                          color: "#2563eb",
                          fontWeight: 700,
                        }}
                      >
                        {doctorNotes.followUp}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: 36,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-end",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "#94a3b8",
                        margin: 0,
                      }}
                    >
                      Digitally generated at DelhiMed Clinical Portal
                    </p>
                    <div
                      style={{
                        borderTop: "1.5px solid #0f172a",
                        width: 180,
                        textAlign: "center",
                        paddingTop: 4,
                      }}
                    >
                      <span style={{ fontSize: "0.82rem", fontWeight: 700 }}>
                        Doctor's Signature
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pd-modal-footer">
                <button
                  className="pd-action-btn"
                  onClick={() => setShowPrintModal(false)}
                >
                  {t("close", "Close")}
                </button>
                <button
                  className="pd-action-btn pd-action-btn--primary"
                  onClick={() => window.print()}
                >
                  <PrintRoundedIcon sx={{ fontSize: 18 }} />
                  <span>{t("printRx", "Print Document")}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Toast Notification Alert ── */}
        {toastMessage && (
          <div className="pd-toast" role="alert">
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
