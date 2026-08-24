import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../api/axios";
import Biometrics3DCore from "../../components/Biometrics3DCore.jsx";
import InteractiveAnatomyDummy3D from "../../components/InteractiveAnatomyDummy3D.jsx";
import "./HealthProfile.css";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";

/* ─── Config maps (From New UI) ─── */
const FLAG_CONFIG = {
  anemia: { label: "Anemia", emoji: "🩸", variant: "red" },
  infection: { label: "Infection", emoji: "🦠", variant: "orange" },
  kidneyIssue: { label: "Kidney Issue", emoji: "🫘", variant: "red" },
  liverIssue: { label: "Liver Issue", emoji: "🫁", variant: "red" },
  diabetesRisk: { label: "Diabetes Risk", emoji: "🍬", variant: "orange" },
};

const LAB_META = {
  hemoglobin: { label: "Hemoglobin", unit: "gm/dl", icon: "🩸" },
  wbc: { label: "WBC", unit: "cells/cumm", icon: "🔬" },
  platelets: { label: "Platelets", unit: "Lacs/cumm", icon: "🧬" },
  bloodSugar: { label: "Blood Sugar", unit: "mg/dl", icon: "🍬" },
  creatinine: { label: "Creatinine", unit: "mg/dl", icon: "🫘" },
  urea: { label: "Urea", unit: "mg/dl", icon: "💧" },
  sodium: { label: "Sodium", unit: "mmol/L", icon: "⚡" },
  potassium: { label: "Potassium", unit: "mmol/L", icon: "🔋" },
  sgpt: { label: "SGPT", unit: "u/l", icon: "🫁" },
  sgot: { label: "SGOT", unit: "u/l", icon: "🫁" },
  bilirubin: { label: "Bilirubin", unit: "mg/dl", icon: "💛" },
  cholesterol: { label: "Cholesterol", unit: "mg/dl", icon: "❤️" },
};

const CONDITION_MAP = {
  diabetes: { label: "Diabetes", emoji: "🍭" },
  hypertension: { label: "Hypertension", emoji: "❤️" },
  thyroid: { label: "Thyroid", emoji: "🦋" },
};

const SYMPTOM_EMOJI = {
  "Hair Loss": "💇",
  "Frequent Urination": "🚽",
  "Weight Loss": "⚖️",
  Headaches: "🤕",
  "Joint Pain": "🦴",
  "Back Pain": "🪑",
  Anxiety: "😰",
  "Low Mood": "😔",
  "Poor Sleep": "😴",
  "Irregular Heartbeat": "💓",
};

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const getSymptomEmoji = (s) => SYMPTOM_EMOJI[s] || "🔹";

/* ─── Sub-components (From New UI) ─── */
function SectionLabel({ children }) {
  return <p className="hp-section-label">{children}</p>;
}

function Card({ children, className = "" }) {
  return <div className={`hp-card ${className}`}>{children}</div>;
}

function Chip({ emoji, label, variant = "default" }) {
  return (
    <span className={`hp-chip hp-chip--${variant}`}>
      {emoji && <span className="hp-chip-emoji">{emoji}</span>}
      {label}
    </span>
  );
}

function LabItem({ icon, label, value, unit }) {
  return (
    <div className="hp-lab-item">
      <div className="hp-lab-header">
        <span className="hp-lab-icon">{icon}</span>
        <span className="hp-lab-label">{label}</span>
      </div>
      <div className="hp-lab-value-row">
        <span className="hp-lab-value">{value}</span>
        <span className="hp-lab-unit">{unit}</span>
      </div>
    </div>
  );
}

function EmptyState({ icon, message, cta, onCta }) {
  return (
    <div className="hp-empty">
      <div className="hp-empty-icon">{icon}</div>
      <p className="hp-empty-msg">{message}</p>
      {cta && (
        <button className="hp-cta-btn" onClick={onCta}>
          {cta}
        </button>
      )}
    </div>
  );
}

/* ─── Main Component ─── */
export default function HealthProfile() {
  const navigate = useNavigate();

  // Restored your original state variables
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("ai");

  // Restored your original fetching logic and error handling
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await instance.get("/healthProfile");
        setProfile(res.data?.profile || null);
      } catch (err) {
        const status = err?.response?.status;
        if (status === 404) {
          setProfile(null);
        } else {
          setError("Could not load health profile right now.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Restored robust default structures
  const ai = profile?.aiExtracted || {};
  const ud = profile?.userProvided || {};

  const alerts = profile?.quickSummary?.criticalAlerts || [];
  const flags = ai?.specialFlags || {};
  const labValues = ai?.labValues || {};
  const insights = ai?.personalizedInsights || [];
  const activeFlags = Object.entries(flags).filter(([, v]) => v);

  // Restored your original useMemo logic for merged allergies to prevent duplicates
  const mergedAllergies = useMemo(() => {
    const aiAllergies = ai.detectedAllergies || [];
    const userAllergies = ud.allergies || [];
    return [...new Set([...aiAllergies, ...userAllergies])];
  }, [ai.detectedAllergies, ud.allergies]);

  if (loading) {
    return (
      <div className="hp-loading-screen">
        <div className="hp-spinner" />
        <p className="hp-loading-text">Loading your health profile…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hp-error-screen">
        <span className="hp-error-icon">⚠️</span>
        <p>{error}</p>
      </div>
    );
  }

  // Handle the empty state correctly if no profile exists
  if (!profile) {
    return (
      <div className="hp-root">
        <div className="hp-topbar">
          <div>
            <h1 className="fb-title">Health Profile & Triage</h1>
            <p className="fb-subtitle">AI-Powered Smart Biomarkers & Digital Health Matrix · DelhiMed</p>
          </div>
          <button
            className="hp-nav-btn"
            onClick={() => navigate("/health-profile/setup")}
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <MedicalInformationIcon fontSize="small" />
            Set Up Health Profile
          </button>
        </div>

        {/* Interactive Anatomy Dummy always available */}
        <InteractiveAnatomyDummy3D />

        <EmptyState
          icon="📝"
          message="Complete 6-step health profile setup to unlock automated continuous AI clinical summaries."
          cta="Start Setup"
          onCta={() => navigate("/health-profile/setup")}
        />
      </div>
    );
  }

  return (
    <div className="hp-root">
      {/* ── Top Nav ── */}
      <div className="hp-topbar">
        <div>
          <h1 className="fb-title">Health Profile</h1>
          <p className="fb-subtitle">AI-Powered Smart Biomarkers & Digital Health Matrix · DelhiMed</p>
        </div>
        <button
          className="hp-nav-btn"
          onClick={() => navigate("/health-profile/setup")}
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <MedicalInformationIcon fontSize="small" />
          Update Health Profile
        </button>
      </div>

      {/* ── Profile Hero ── */}
      <div className="hp-hero">
        <div className="hp-hero-avatar">👤</div>
        <div className="hp-hero-info">
          <h1 className="hp-hero-name">Your Health Matrix</h1>
          <p className="hp-hero-sub">Complete clinical biomarker overview · DelhiMed</p>
        </div>
        <div className="hp-hero-badge">
          <span className="hp-hero-badge-dot" />
          Active
        </div>
      </div>

      {/* ── Critical Alerts Banner ── */}
      {alerts.length > 0 && (
        <div className="hp-alert-banner">
          <div className="hp-alert-left">
            <span className="hp-alert-icon">⚠️</span>
            <div>
              <p className="hp-alert-title">Critical Info</p>
              <div className="hp-chips-row">
                {alerts.map((a, i) => (
                  <Chip key={i} emoji="⚠️" label={a} variant="warn" />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3D Interactive Biometrics Core */}
      <Biometrics3DCore />

      {/* ── Tabs ── */}
      <div className="hp-tabs">
        {[
          { id: "ai", label: "🤖 AI Biomarkers" },
          { id: "dummy", label: "🧬 3D Body Symptom Dummy" },
          { id: "history", label: "📋 Patient History" },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`hp-tab ${activeTab === tab.id ? "hp-tab--active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ════════════════ 3D Body Symptom Dummy Tab ════════════════ */}
      {activeTab === "dummy" && (
        <div className="hp-tab-content hp-fade-in">
          <InteractiveAnatomyDummy3D />
        </div>
      )}

      {/* ════════════════ AI Analysis Tab ════════════════ */}
      {activeTab === "ai" && (
        <div className="hp-tab-content hp-fade-in">
          {/* Flags */}
          {activeFlags.length > 0 && (
            <Card>
              <SectionLabel>FLAGS</SectionLabel>
              <div className="hp-chips-row">
                {activeFlags.map(([key]) => {
                  const cfg = FLAG_CONFIG[key];
                  return cfg ? (
                    <Chip
                      key={key}
                      emoji={cfg.emoji}
                      label={cfg.label}
                      variant={cfg.variant}
                    />
                  ) : null;
                })}
              </div>
            </Card>
          )}

          {/* Lab Values */}
          {Object.values(labValues).some(
            (v) => v !== null && v !== undefined && v !== "",
          ) ? (
            <Card>
              <SectionLabel>LAB VALUES</SectionLabel>
              <div className="hp-lab-grid">
                {Object.entries(LAB_META).map(
                  ([key, { label, unit, icon }]) => {
                    const val = labValues[key];
                    if (val == null || val === "") return null;

                    // Support both primitive values & object shapes from Gemini AI
                    const isObj = typeof val === "object" && val !== null;
                    const displayValue = isObj ? val.value : val;
                    const displayUnit = isObj && val.unit ? val.unit : unit;

                    // If it's an object but empty, skip it
                    if (
                      displayValue === null ||
                      displayValue === undefined ||
                      displayValue === ""
                    )
                      return null;

                    return (
                      <LabItem
                        key={key}
                        icon={icon}
                        label={label}
                        value={displayValue}
                        unit={displayUnit}
                      />
                    );
                  },
                )}
              </div>
            </Card>
          ) : null}

          {/* Blood Group / Detected Allergies / Meds */}
          {ai?.bloodGroup ||
          mergedAllergies.length ||
          ai?.currentMedications?.length ? (
            <Card>
              <SectionLabel>DETECTED INFO</SectionLabel>

              {ai?.bloodGroup && (
                <div className="hp-info-row">
                  <span className="hp-info-key">🩸 Blood Group</span>
                  <span className="hp-info-val">{ai.bloodGroup}</span>
                </div>
              )}

              {mergedAllergies.length > 0 && (
                <div className="hp-info-row hp-info-row--stack">
                  <span className="hp-info-key">⚠️ Allergies</span>
                  <div className="hp-chips-row">
                    {mergedAllergies.map((a, i) => (
                      <Chip key={i} label={a} variant="warn" />
                    ))}
                  </div>
                </div>
              )}

              {ai?.currentMedications?.length > 0 && (
                <div className="hp-info-row hp-info-row--stack">
                  <span className="hp-info-key">💊 Medications</span>
                  <div className="hp-chips-row">
                    {ai.currentMedications.map((m, i) => (
                      <Chip key={i} label={m} variant="blue" />
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ) : null}

          {/* Insights */}
          {insights.length > 0 && (
            <Card>
              <SectionLabel>INSIGHTS</SectionLabel>
              <ul className="hp-insights-list">
                {insights.map((insight, i) => (
                  <li key={i} className="hp-insight-item">
                    {insight}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}

      {/* ════════════════ Patient History Tab ════════════════ */}
      {activeTab === "history" && (
        <div className="hp-tab-content hp-fade-in">
          {/* Known Conditions */}
          {ud?.conditions && Object.values(ud.conditions).some(Boolean) && (
            <Card>
              <SectionLabel>KNOWN CONDITIONS</SectionLabel>
              <div className="hp-chips-row">
                {Object.entries(ud.conditions)
                  .filter(([, v]) => v)
                  .map(([key]) => {
                    const c = CONDITION_MAP[key];
                    return c ? (
                      <Chip
                        key={key}
                        emoji={c.emoji}
                        label={c.label}
                        variant="blue"
                      />
                    ) : (
                      <Chip
                        key={key}
                        emoji="🔹"
                        label={capitalize(key)}
                        variant="blue"
                      />
                    );
                  })}
              </div>
            </Card>
          )}

          {/* Current Symptoms */}
          {ud?.currentSymptoms?.length > 0 && (
            <Card>
              <SectionLabel>CURRENT SYMPTOMS</SectionLabel>
              <div className="hp-chips-row">
                {ud.currentSymptoms.map((s, i) => (
                  <Chip
                    key={i}
                    emoji={getSymptomEmoji(s)}
                    label={s}
                    variant="light"
                  />
                ))}
              </div>
            </Card>
          )}

          {/* Medications */}
          {ud?.medications?.length > 0 && (
            <Card>
              <SectionLabel>MEDICATIONS</SectionLabel>
              <ul className="hp-dot-list">
                {ud.medications.map((m, i) => (
                  <li key={i} className="hp-dot-item">
                    <span className="hp-dot-icon">💊</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Past Events */}
          {ud?.pastEvents?.surgeries?.length ||
          ud?.pastEvents?.injuries?.length ||
          ud?.pastEvents?.majorIllness?.length ? (
            <Card>
              <SectionLabel>PAST EVENTS</SectionLabel>

              {ud.pastEvents.surgeries?.length > 0 && (
                <div className="hp-past-block">
                  <span className="hp-past-type">🔪 Surgeries</span>
                  <div className="hp-chips-row">
                    {ud.pastEvents.surgeries.map((s, i) => (
                      <Chip key={i} label={s} variant="light" />
                    ))}
                  </div>
                </div>
              )}

              {ud.pastEvents.injuries?.length > 0 && (
                <div className="hp-past-block">
                  <span className="hp-past-type">🩹 Injuries</span>
                  <div className="hp-chips-row">
                    {ud.pastEvents.injuries.map((inj, i) => (
                      <Chip key={i} label={inj} variant="light" />
                    ))}
                  </div>
                </div>
              )}

              {ud.pastEvents.majorIllness?.length > 0 && (
                <div className="hp-past-block">
                  <span className="hp-past-type">🏥 Major Illness</span>
                  <div className="hp-chips-row">
                    {ud.pastEvents.majorIllness.map((ill, i) => (
                      <Chip key={i} label={ill} variant="light" />
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ) : null}

          {/* Family History */}
          {ud?.familyHistory && (
            <Card>
              <SectionLabel>FAMILY HISTORY</SectionLabel>
              <div className="hp-chips-row">
                {ud.familyHistory.diabetes && (
                  <Chip emoji="🍭" label="Diabetes" variant="light" />
                )}
                {ud.familyHistory.heartDisease && (
                  <Chip emoji="❤️" label="Heart Disease" variant="light" />
                )}
                {ud.familyHistory.cancer && (
                  <Chip emoji="🎗️" label="Cancer" variant="light" />
                )}
                {ud.familyHistory.geneticConditions?.map((g, i) => (
                  <Chip key={i} emoji="🧬" label={g} variant="light" />
                ))}
              </div>
            </Card>
          )}

          {/* Lifestyle */}
          {ud?.lifestyle && (
            <Card>
              <SectionLabel>LIFESTYLE</SectionLabel>
              <div className="hp-chips-row">
                {ud.lifestyle.smoking && (
                  <Chip emoji="🚬" label="Smoking" variant="warn" />
                )}
                {ud.lifestyle.alcohol && (
                  <Chip emoji="🍺" label="Alcohol" variant="warn" />
                )}
                {!ud.lifestyle.smoking && !ud.lifestyle.alcohol && (
                  <Chip emoji="✅" label="Healthy Lifestyle" variant="green" />
                )}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Bottom padding for mobile nav */}
      <div style={{ height: "80px" }} />
    </div>
  );
}
