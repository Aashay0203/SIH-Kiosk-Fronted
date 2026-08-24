import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { playTap, playSuccess, playSwitch } from "../utils/audioFX";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Download,
  Eye,
  FileText,
  Heart,
  HelpCircle,
  Layers,
  RotateCcw,
  Search,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  User,
  Zap,
} from "lucide-react";
import "./InteractiveAnatomyDummy3D.css";

// ── Anatomical Target Areas & Clinical Pathology Database ──
const BODY_PARTS = [
  {
    id: "head",
    name: "Head & Brain",
    hindiName: "सिर और मस्तिष्क (Head / Brain)",
    icon: "🧠",
    cx: 150,
    cy: 42,
    r: 22,
    defaultSymptom: "Headache / Dizziness",
    symptoms: [
      "Headache / सिर में दर्द (Migraine, Tension)",
      "Dizziness / चक्कर आना",
      "Brain Fog & Fatigue / सुस्ती और भारीपन",
      "Memory / Concentration Issues",
    ],
    specialty: "Neurologist (तंत्रिका रोग विशेषज्ञ)",
    urgency: "Moderate",
    firstAid: "Rest in dark quiet room, drink electrolytes, avoid screen exposure.",
  },
  {
    id: "eyes",
    name: "Eyes & Vision",
    hindiName: "आँखें (Eyes)",
    icon: "👁️",
    cx: 150,
    cy: 58,
    r: 12,
    defaultSymptom: "Eye Strain / Redness",
    symptoms: [
      "Aankh me dard / Eye Pain & Strain",
      "Blurry Vision / धुंधला दिखना",
      "Redness & Itching / आँखों में लाली और जलन",
      "Watery / Dry Eyes / पानी आना या सूखापन",
    ],
    specialty: "Ophthalmologist (नेत्र विशेषज्ञ)",
    urgency: "Mild",
    firstAid: "Apply cold compress, use lubricating saline drops, 20-20-20 screen rule.",
  },
  {
    id: "nose",
    name: "Nose & Sinus",
    hindiName: "नाक और साइनस (Nose / Sinus)",
    icon: "👃",
    cx: 150,
    cy: 74,
    r: 10,
    defaultSymptom: "Sinus Congestion / Nose Pain",
    symptoms: [
      "Naak me dard / Sinus Facial Pain",
      "Runny / Blocked Nose / बंद नाक या जुकाम",
      "Loss of Smell / गंध न आना",
      "Nosebleeds (Epistaxis) / नकसीर फूटना",
    ],
    specialty: "ENT Specialist (नाक-कान-गला विशेषज्ञ)",
    urgency: "Mild",
    firstAid: "Steam inhalation twice daily, warm saline nasal rinse, stay hydrated.",
  },
  {
    id: "throat",
    name: "Throat & Neck",
    hindiName: "गला और गर्दन (Throat & Neck)",
    icon: "🗣️",
    cx: 150,
    cy: 98,
    r: 12,
    defaultSymptom: "Sore Throat / Cough",
    symptoms: [
      "Gale me dard / Sore Throat & Pain",
      "Difficulty Swallowing / निगलने में तकलीफ",
      "Dry Cough / सूखी खांसी",
      "Neck Stiffness / गर्दन में अकड़न",
    ],
    specialty: "ENT / General Physician",
    urgency: "Mild",
    firstAid: "Warm salt water gargles 3x/day, honey with ginger, avoid cold drinks.",
  },
  {
    id: "chest",
    name: "Chest & Heart",
    hindiName: "छाती और दिल (Chest & Heart)",
    icon: "🫀",
    cx: 150,
    cy: 140,
    r: 26,
    defaultSymptom: "Chest Tightness / Heart Palpitation",
    symptoms: [
      "Seene me dard / Chest Pressure or Pain",
      "Heart Palpitations / तेज धड़कन",
      "Shortness of Breath / सांस फूलना",
      "Left Arm Radiating Discomfort",
    ],
    specialty: "Cardiologist (हृदय रोग विशेषज्ञ)",
    urgency: "High Priority",
    firstAid: "Sit upright, loosen tight clothes. If sudden or crushing, seek IMMEDIATE emergency care.",
  },
  {
    id: "lungs",
    name: "Lungs & Respiratory",
    hindiName: "फेफड़े और श्वसन (Lungs / Breathing)",
    icon: "🫁",
    cx: 150,
    cy: 165,
    r: 24,
    defaultSymptom: "Breathing Difficulty / Wheezing",
    symptoms: [
      "Saans lene me dikkat / Dyspnea",
      "Wheezing & Chest Congestion / घरघराहट",
      "Chronic Phlegm / कफ वाली खांसी",
      "Asthma-like tight chest",
    ],
    specialty: "Pulmonologist (छाती एवं फेफड़ा रोग विशेषज्ञ)",
    urgency: "Moderate to High",
    firstAid: "Use prescribed inhaler, sit in well-ventilated area, steam with eucalyptus.",
  },
  {
    id: "stomach",
    name: "Stomach & Abdomen",
    hindiName: "पेट और पाचन (Stomach & Digestion)",
    icon: "🫄",
    cx: 150,
    cy: 205,
    r: 26,
    defaultSymptom: "Abdominal Pain / Acidity",
    symptoms: [
      "Pet me dard / Stomach Ache or Cramps",
      "Severe Acidity & Heartburn / गैस और एसिडिटी",
      "Nausea / Vomiting / उल्टी या जी मिचलाना",
      "Bloating & Indigestion / बदहजमी और अफारा",
    ],
    specialty: "Gastroenterologist (पेट व आंत विशेषज्ञ)",
    urgency: "Moderate",
    firstAid: "Drink warm ginger water, take antacid if prescribed, avoid oily/spicy foods.",
  },
  {
    id: "bones",
    name: "Bones & Joints",
    hindiName: "हड्डियां और जोड़ (Bones & Joints)",
    icon: "🦴",
    cx: 150,
    cy: 285,
    r: 28,
    defaultSymptom: "Joint Pain / Bone Stiffness",
    symptoms: [
      "Haddiyo me dard / Deep Bone Ache",
      "Joint Swelling & Stiffness / जोड़ों में सूजन और अकड़न",
      "Knee / Shoulder Joint Pain / घुटने या कंधे का दर्द",
      "Crackling Noise & Immobility / चलने में दर्द",
    ],
    specialty: "Orthopedic Surgeon (हड्डी एवं जोड़ रोग विशेषज्ञ)",
    urgency: "Moderate",
    firstAid: "R.I.C.E protocol (Rest, Ice, Compression, Elevation), apply analgesic gel, avoid heavy lifting.",
  },
  {
    id: "spine",
    name: "Spine & Lower Back",
    hindiName: "रीढ़ की हड्डी और कमर (Spine / Back)",
    icon: "🏃",
    cx: 150,
    cy: 245,
    r: 20,
    defaultSymptom: "Lower Back Pain / Disc Pain",
    symptoms: [
      "Kamar me dard / Severe Lower Back Pain",
      "Sciatica Shooting Leg Pain / पैर में जाने वाला दर्द",
      "Stiff Back in Morning / सुबह अकड़न",
      "Posture Fatigue / बैठने पर खिंचाव",
    ],
    specialty: "Orthopedic / Spine Specialist / Physiotherapist",
    urgency: "Moderate",
    firstAid: "Lumbar support while sitting, gentle cat-cow stretches, warm heat pad.",
  },
  {
    id: "hands",
    name: "Arms & Hands",
    hindiName: "हाथ और कलाई (Arms & Hands)",
    icon: "🤲",
    cx: 90,
    cy: 190,
    r: 18,
    defaultSymptom: "Hand Numbness / Wrist Pain",
    symptoms: [
      "Haath me dard / Hand or Wrist Pain (Carpal Tunnel)",
      "Tingling & Numbness in Fingers / झनझनाहट",
      "Weak Grip / पकड़ कमजोर होना",
      "Elbow Tendonitis / कोहनी में खिंचाव",
    ],
    specialty: "Orthopedic / Rheumatologist",
    urgency: "Mild",
    firstAid: "Wrist splint during sleep, contrast hot/cold baths, ergonomic mouse/keyboard.",
  },
  {
    id: "legs",
    name: "Legs & Feet",
    hindiName: "पैर और तलवे (Legs & Feet)",
    icon: "🦵",
    cx: 150,
    cy: 375,
    r: 24,
    defaultSymptom: "Leg Swelling / Foot Pain",
    symptoms: [
      "Pairo me dard / Foot & Calf Pain",
      "Ankle Swelling / टखने में सूजन (Edema)",
      "Plantar Fasciitis / एड़ी में दर्द",
      "Night Muscle Cramps / रात में नस चढ़ना",
    ],
    specialty: "Orthopedic / Vascular Specialist",
    urgency: "Mild to Moderate",
    firstAid: "Elevate legs above heart level, magnesium hydration, supportive cushioned footwear.",
  },
  {
    id: "skin",
    name: "Skin & Allergies",
    hindiName: "त्वचा और एलर्जी (Skin & Allergies)",
    icon: "🧴",
    cx: 150,
    cy: 120,
    r: 15,
    defaultSymptom: "Skin Rash / Itching",
    symptoms: [
      "Khujli aur laal daane / Skin Itching & Hives",
      "Eczema or Flaking Patches / त्वचा का छिलना",
      "Fungal Infection / फंगल इन्फेक्शन",
      "Acne or Boils / मुंहासे और फुंसी",
    ],
    specialty: "Dermatologist (त्वचा विशेषज्ञ)",
    urgency: "Mild",
    firstAid: "Apply calamine lotion, avoid hot showers, wear loose breathable cotton clothing.",
  },
];

const PAIN_TYPES = ["Throbbing (धड़कता हुआ)", "Sharp / Stabbing (तीखा)", "Dull Ache (हल्का मीठा दर्द)", "Burning (जलनदार)", "Stiff / Tight (जकड़न)"];
const DURATIONS = ["Just started (< 24 hrs)", "1 - 3 Days", "1 - 2 Weeks", "Chronic (> 1 Month)"];

export default function InteractiveAnatomyDummy3D() {
  const navigate = useNavigate();
  const [selectedPart, setSelectedPart] = useState(BODY_PARTS[7]); // Defaults to Bones & Joints
  const [selectedSymptoms, setSelectedSymptoms] = useState([BODY_PARTS[7].symptoms[0]]);
  const [painLevel, setPainLevel] = useState(6);
  const [painType, setPainType] = useState(PAIN_TYPES[0]);
  const [duration, setDuration] = useState(DURATIONS[1]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState(null);
  const [viewMode, setViewMode] = useState("front"); // front | skeleton

  const handleSelectPart = (part) => {
    playTap();
    setSelectedPart(part);
    setSelectedSymptoms([part.symptoms[0]]);
    setReport(null); // Reset previous report when part switches
  };

  const handleToggleSymptom = (symptom) => {
    playSwitch();
    if (selectedSymptoms.includes(symptom)) {
      if (selectedSymptoms.length > 1) {
        setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
      }
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleGenerateReport = () => {
    playTap();
    setIsGenerating(true);

    setTimeout(() => {
      playSuccess();
      setIsGenerating(false);

      // Generate localized clinical triage report
      const isUrgent = painLevel >= 8 || selectedPart.urgency === "High Priority";
      const generatedReport = {
        id: `DM-AI-${Math.floor(100000 + Math.random() * 900000)}`,
        timestamp: new Date().toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
        bodyPart: selectedPart.name,
        hindiName: selectedPart.hindiName,
        icon: selectedPart.icon,
        symptoms: selectedSymptoms,
        painLevel: painLevel,
        painType: painType,
        duration: duration,
        urgency: isUrgent ? "HIGH PRIORITY (तत्काल ध्यान)" : selectedPart.urgency,
        severityScore: `${(painLevel * 10).toFixed(0)}% Intensity Index`,
        specialty: selectedPart.specialty,
        primaryAssessment: `AI Assessment indicates symptomatic localized inflammation/irritation involving the ${selectedPart.name}. Correlated with a Pain Score of ${painLevel}/10 and ${duration.toLowerCase()} duration.`,
        homeRemedies: selectedPart.firstAid,
        redFlags: isUrgent
          ? "⚠️ High pain severity or chest/cardio indications detected. If accompanying breathlessness, high fever, or loss of consciousness occurs, visit DelhiMed Emergency Ward immediately."
          : "Monitor symptoms for 48 hours. If pain exceeds 7/10 or spreads, proceed with OPD consultation.",
      };

      setReport(generatedReport);
    }, 1200);
  };

  const handleReset = () => {
    playSwitch();
    setSelectedPart(BODY_PARTS[7]);
    setSelectedSymptoms([BODY_PARTS[7].symptoms[0]]);
    setPainLevel(6);
    setReport(null);
  };

  const getPainColor = (val) => {
    if (val <= 3) return "#10b981"; // Green
    if (val <= 6) return "#f59e0b"; // Amber
    if (val <= 8) return "#f97316"; // Orange
    return "#ef4444"; // Red
  };

  return (
    <div className="anatomy-dummy-wrapper">
      {/* ── Top Header & HUD ── */}
      <div className="anatomy-dummy-header">
        <div className="anatomy-dummy-title-group">
          <div className="anatomy-hologram-badge">
            <Sparkles size={14} className="text-sky-400" />
            <span>AI Interactive Anatomy & Symptom Dummy</span>
          </div>
          <h2 className="anatomy-dummy-title">
            Body Part Symptom Selector & Instant Report Generator
          </h2>
          <p className="anatomy-dummy-sub">
            Click on any body part on the 3D Anatomical Dummy to specify your pain or discomfort
            (जैसे: 🦴 Bones me dard, 👁️ Eyes me dard, 👃 Nose me dard) and generate an instant AI clinical triage report!
          </p>
        </div>

        <div className="anatomy-view-toggles">
          <button
            className={`anatomy-toggle-btn ${viewMode === "front" ? "active" : ""}`}
            onClick={() => {
              playSwitch();
              setViewMode("front");
            }}
          >
            <User size={14} />
            <span>Surface Model</span>
          </button>
          <button
            className={`anatomy-toggle-btn ${viewMode === "skeleton" ? "active" : ""}`}
            onClick={() => {
              playSwitch();
              setViewMode("skeleton");
            }}
          >
            <Layers size={14} />
            <span>X-Ray Skeleton</span>
          </button>
        </div>
      </div>

      {/* ── Main Two-Column Stage ── */}
      <div className="anatomy-stage-grid">
        {/* ── LEFT: Interactive Anatomical Dummy Canvas ── */}
        <div className="anatomy-dummy-viewport">
          <div className="anatomy-viewport-hud">
            <span className="hud-live-tag">
              <span className="hud-pulse-dot" /> LIVE 3D ANATOMY MAP
            </span>
            <span className="hud-part-name">
              {selectedPart.icon} {selectedPart.name}
            </span>
          </div>

          <div className="anatomy-svg-container">
            {/* Ambient Bioluminescent Backlight Glow */}
            <div
              className="anatomy-glow-orb"
              style={{
                top: `${(selectedPart.cy / 450) * 100}%`,
                left: `${(selectedPart.cx / 300) * 100}%`,
              }}
            />

            <svg
              viewBox="0 0 300 450"
              className={`anatomy-svg-canvas ${viewMode === "skeleton" ? "xray-mode" : ""}`}
            >
              <defs>
                <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
                  <stop offset="50%" stopColor="#1e293b" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0.95" />
                </linearGradient>

                <linearGradient id="skeletonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#a7f3d0" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
                </linearGradient>

                <filter id="hologramGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* ── Anatomical Human Silhouette ── */}
              {/* Head */}
              <circle cx="150" cy="45" r="24" className="body-silhouette-path" />
              {/* Neck */}
              <rect x="142" y="68" width="16" height="20" rx="4" className="body-silhouette-path" />
              {/* Torso & Chest */}
              <path
                d="M 105 88 L 195 88 L 180 230 L 120 230 Z"
                className="body-silhouette-path"
              />
              {/* Arms */}
              {/* Left Arm */}
              <path
                d="M 105 88 L 80 170 L 68 240 L 80 242 L 95 175 L 115 105 Z"
                className="body-silhouette-path"
              />
              {/* Right Arm */}
              <path
                d="M 195 88 L 220 170 L 232 240 L 220 242 L 205 175 L 185 105 Z"
                className="body-silhouette-path"
              />
              {/* Pelvis */}
              <path
                d="M 120 230 L 180 230 L 175 270 L 125 270 Z"
                className="body-silhouette-path"
              />
              {/* Left Leg */}
              <path
                d="M 125 270 L 120 350 L 115 425 L 132 425 L 140 350 L 146 270 Z"
                className="body-silhouette-path"
              />
              {/* Right Leg */}
              <path
                d="M 175 270 L 180 350 L 185 425 L 168 425 L 160 350 L 154 270 Z"
                className="body-silhouette-path"
              />

              {/* ── Skeleton Wireframe Overlay ── */}
              {viewMode === "skeleton" && (
                <g className="skeleton-overlay" filter="url(#hologramGlow)">
                  {/* Skull */}
                  <ellipse cx="150" cy="45" rx="18" ry="20" className="skeleton-line" />
                  {/* Spine */}
                  <line x1="150" y1="70" x2="150" y2="260" className="skeleton-spine" />
                  {/* Ribcage */}
                  <path d="M 130 115 Q 150 125 170 115" className="skeleton-rib" />
                  <path d="M 125 130 Q 150 142 175 130" className="skeleton-rib" />
                  <path d="M 125 145 Q 150 157 175 145" className="skeleton-rib" />
                  <path d="M 128 160 Q 150 172 172 160" className="skeleton-rib" />
                  {/* Pelvic Bone */}
                  <path d="M 122 245 Q 150 265 178 245" className="skeleton-pelvis" />
                  {/* Leg Bones */}
                  <line x1="135" y1="270" x2="130" y2="350" className="skeleton-bone" />
                  <line x1="130" y1="355" x2="124" y2="420" className="skeleton-bone" />
                  <line x1="165" y1="270" x2="170" y2="350" className="skeleton-bone" />
                  <line x1="170" y1="355" x2="176" y2="420" className="skeleton-bone" />
                </g>
              )}

              {/* ── Clickable Holographic Target Nodes ── */}
              {BODY_PARTS.map((part) => {
                const isSelected = selectedPart.id === part.id;
                return (
                  <g
                    key={part.id}
                    className={`anatomy-node ${isSelected ? "selected" : ""}`}
                    onClick={() => handleSelectPart(part)}
                  >
                    {/* Pulsing Ripple Circle on Selected Node */}
                    {isSelected && (
                      <circle
                        cx={part.cx}
                        cy={part.cy}
                        r={part.r + 8}
                        className="anatomy-node-ripple"
                      />
                    )}
                    <circle
                      cx={part.cx}
                      cy={part.cy}
                      r={part.r}
                      className="anatomy-node-circle"
                    />
                    <circle
                      cx={part.cx}
                      cy={part.cy}
                      r={4}
                      className="anatomy-node-core"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Quick Body Part Pill Selector Carousel */}
          <div className="anatomy-quick-pills">
            {BODY_PARTS.map((p) => (
              <button
                key={p.id}
                className={`anatomy-pill-btn ${selectedPart.id === p.id ? "active" : ""}`}
                onClick={() => handleSelectPart(p)}
              >
                <span>{p.icon}</span>
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Clinical Parameter Customizer & Report Output ── */}
        <div className="anatomy-control-panel">
          {/* Selected Part Badge */}
          <div className="selected-part-hero">
            <div className="hero-part-icon">{selectedPart.icon}</div>
            <div className="hero-part-info">
              <span className="hero-part-label">Selected Anatomical Target</span>
              <h3 className="hero-part-title">{selectedPart.name}</h3>
              <p className="hero-part-hindi">{selectedPart.hindiName}</p>
            </div>
            <button
              className="anatomy-reset-btn"
              onClick={handleReset}
              title="Reset Selection"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          {/* Section 1: Choose Symptoms */}
          <div className="anatomy-card-section">
            <h4 className="section-title">
              <span>1. Specific Pain / Symptoms (लक्षण चुनें)</span>
            </h4>
            <div className="symptoms-chip-matrix">
              {selectedPart.symptoms.map((sym, idx) => {
                const checked = selectedSymptoms.includes(sym);
                return (
                  <button
                    key={idx}
                    className={`symptom-toggle-chip ${checked ? "selected" : ""}`}
                    onClick={() => handleToggleSymptom(sym)}
                  >
                    <span className="checkbox-indicator">{checked ? "✓" : "+"}</span>
                    <span>{sym}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Pain Intensity Slider */}
          <div className="anatomy-card-section">
            <div className="slider-header-row">
              <h4 className="section-title">
                <span>2. Pain Intensity (दर्द कितना तेज है? 1–10)</span>
              </h4>
              <span
                className="pain-badge"
                style={{ backgroundColor: `${getPainColor(painLevel)}22`, color: getPainColor(painLevel), borderColor: getPainColor(painLevel) }}
              >
                Score: {painLevel} / 10
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="10"
              value={painLevel}
              onChange={(e) => {
                playSwitch();
                setPainLevel(parseInt(e.target.value));
              }}
              className="pain-range-slider"
              style={{
                accentColor: getPainColor(painLevel),
              }}
            />

            <div className="pain-scale-labels">
              <span>1 (Mild / हल्का)</span>
              <span>5 (Moderate / मध्यम)</span>
              <span>10 (Severe / असहनीय)</span>
            </div>
          </div>

          {/* Section 3: Pain Character & Duration */}
          <div className="anatomy-card-section">
            <h4 className="section-title">
              <span>3. Pain Character & Duration (दर्द का प्रकार और समय)</span>
            </h4>

            <div className="params-dual-row">
              <div className="param-col">
                <label className="param-label">Pain Character</label>
                <select
                  value={painType}
                  onChange={(e) => {
                    playSwitch();
                    setPainType(e.target.value);
                  }}
                  className="param-select-box"
                >
                  {PAIN_TYPES.map((pt, i) => (
                    <option key={i} value={pt}>
                      {pt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="param-col">
                <label className="param-label">Duration</label>
                <select
                  value={duration}
                  onChange={(e) => {
                    playSwitch();
                    setDuration(e.target.value);
                  }}
                  className="param-select-box"
                >
                  {DURATIONS.map((dur, i) => (
                    <option key={i} value={dur}>
                      {dur}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Action Trigger Button */}
          <button
            className="anatomy-generate-btn"
            onClick={handleGenerateReport}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Zap size={18} className="animate-spin text-amber-300" />
                <span>Analyzing Neural Biometrics & Pathology...</span>
              </>
            ) : (
              <>
                <FileText size={18} />
                <span>Generate AI Triage & Prescription Plan</span>
                <ChevronRight size={18} />
              </>
            )}
          </button>

          {/* ── Generated AI Report Output Display ── */}
          {report && (
            <div className="generated-report-card">
              <div className="report-header">
                <div className="report-badge-top">
                  <span className="report-tag">AI CLINICAL TRIAGE REPORT</span>
                  <span className="report-id">{report.id}</span>
                </div>
                <h3 className="report-title">
                  {report.icon} {report.bodyPart} Assessment
                </h3>
                <span className="report-time">{report.timestamp}</span>
              </div>

              <div className="report-stats-grid">
                <div className="report-stat-box">
                  <span className="stat-name">Urgency Level</span>
                  <span className="stat-val text-amber-400">{report.urgency}</span>
                </div>
                <div className="report-stat-box">
                  <span className="stat-name">Pain Score</span>
                  <span className="stat-val text-sky-400">{report.painLevel}/10 ({report.painType})</span>
                </div>
                <div className="report-stat-box full-col">
                  <span className="stat-name">Recommended Specialist</span>
                  <span className="stat-val text-emerald-400 font-bold">{report.specialty}</span>
                </div>
              </div>

              <div className="report-text-block">
                <h5 className="block-label">Clinical Synthesis:</h5>
                <p className="block-content">{report.primaryAssessment}</p>
              </div>

              <div className="report-text-block highlight-remedy">
                <h5 className="block-label">Immediate Care & Home Protocol:</h5>
                <p className="block-content">{report.homeRemedies}</p>
              </div>

              <div className="report-text-block warning-box">
                <h5 className="block-label">Red Flag Alerts:</h5>
                <p className="block-content">{report.redFlags}</p>
              </div>

              {/* Report Action Buttons */}
              <div className="report-actions-row">
                <button
                  className="report-action-btn book-doc-btn"
                  onClick={() => {
                    playTap();
                    navigate("/doctorList");
                  }}
                >
                  <Stethoscope size={16} />
                  <span>Book {selectedPart.name} Specialist Now</span>
                </button>

                <button
                  className="report-action-btn secondary-btn"
                  onClick={() => {
                    playSuccess();
                    alert(`✅ AI Triage Report ${report.id} saved to your health profile!`);
                  }}
                >
                  <Download size={16} />
                  <span>Save / Export</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
