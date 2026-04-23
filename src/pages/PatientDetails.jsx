import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import instance from "../api/axios";
import "./PatientDetails.css";
import { IconButton, Avatar } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

/* ─── Config maps ─── */
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

/* ─── Sub-components ─── */
function SectionLabel({ children }) {
  return <p className="pd-section-label">{children}</p>;
}

function Card({ children, className = "" }) {
  return <div className={`pd-card ${className}`}>{children}</div>;
}

function Chip({ emoji, label, variant = "default" }) {
  return (
    <span className={`pd-chip pd-chip--${variant}`}>
      {emoji && <span className="pd-chip-emoji">{emoji}</span>}
      {label}
    </span>
  );
}

function LabItem({ icon, label, value, unit }) {
  return (
    <div className="pd-lab-item">
      <div className="pd-lab-header">
        <span className="pd-lab-icon">{icon}</span>
        <span className="pd-lab-label">{label}</span>
      </div>
      <div className="pd-lab-value-row">
        <span className="pd-lab-value">{value}</span>
        <span className="pd-lab-unit">{unit}</span>
      </div>
    </div>
  );
}

function EmptyState({ icon, message }) {
  return (
    <div className="pd-empty">
      <div className="pd-empty-icon">{icon}</div>
      <p className="pd-empty-msg">{message}</p>
    </div>
  );
}

/* ─── Main Component ─── */
export default function PatientDetail() {
  const navigate = useNavigate();
  const location = useLocation();

  const [appointment] = useState(location.state?.appointment || null);
  const [healthProfile, setHealthProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ai");

  useEffect(() => {
    const patientId = appointment?.patientId?._id;
    if (!patientId) {
      setLoading(false);
      return;
    }

    const fetchHealthProfile = async () => {
      try {
        const res = await instance.get(`/doctors/patient-profile/${patientId}`);
        setHealthProfile(res.data.profile);
      } catch (err) {
        setHealthProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthProfile();
  }, [appointment]);

  const patient = appointment.patientId || {};
  const ai = healthProfile?.aiExtracted || {};
  const ud = healthProfile?.userProvided || {};

  const flags = ai?.specialFlags || {};
  const labValues = ai?.labValues || {};
  const insights = ai?.personalizedInsights || [];
  const activeFlags = Object.entries(flags).filter(([, v]) => v);

  const mergedAllergies = useMemo(() => {
    const aiAllergies = ai.detectedAllergies || [];
    const userAllergies = ud.allergies || [];
    return [...new Set([...aiAllergies, ...userAllergies])];
  }, [ai.detectedAllergies, ud.allergies]);

  if (!appointment) {
    return (
      <div className="pd-root">
        <div className="pd-navbar">
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              backgroundColor: "#ffffff",
              border: "1.5px solid #dde3ea",
              "&:hover": { backgroundColor: "#dce9ff", borderColor: "#3e7df5" },
            }}
          >
            <ChevronLeftIcon sx={{ color: "#010101" }} />
          </IconButton>
          <h4 className="pd-navbar-title">Patient Details</h4>
        </div>
        <EmptyState
          icon="⚠️"
          message="Appointment data not available. Please go back and try again."
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pd-loading-screen">
        <div className="pd-spinner" />
        <p className="pd-loading-text">Loading patient profile…</p>
      </div>
    );
  }

  return (
    <div className="pd-root">
      {/* ── Top Nav ── */}
      <div className="pd-navbar">
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            backgroundColor: "#ffffff",
            border: "1.5px solid #dde3ea",
            "&:hover": { backgroundColor: "#dce9ff", borderColor: "#3e7df5" },
          }}
        >
          <ChevronLeftIcon sx={{ color: "#010101" }} />
        </IconButton>

        <h4 className="pd-navbar-title">Patient Details</h4>

        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: "#3e7df5",
            fontFamily: "'Urbanist', sans-serif",
            fontWeight: 800,
            fontSize: 16,
          }}
        >
          {patient.name?.[0]?.toUpperCase() || "P"}
        </Avatar>
      </div>

      {/* ── Profile Hero ── */}
      <div className="pd-hero">
        <div className="pd-hero-avatar">
          {patient.name?.[0]?.toUpperCase() || "P"}
        </div>
        <div className="pd-hero-info">
          <h1 className="pd-hero-name">{patient.name || "Patient"}</h1>
          <p className="pd-hero-sub">
            {patient.phone || patient.email || "No contact provided"}
          </p>
        </div>
        <div className="pd-hero-badge">
          <span className="pd-hero-badge-dot" />#{appointment.appointmentNumber}
        </div>
      </div>

      {/* ── Appointment Meta Banner ── */}
      <div className="pd-alert-banner">
        <div className="pd-meta-grid">
          <div className="pd-meta-item">
            <span className="pd-meta-label">Slot Time</span>
            <span className="pd-meta-value">{appointment.slotTime}</span>
          </div>
          <div className="pd-meta-item">
            <span className="pd-meta-label">Status</span>
            <span className="pd-meta-value pd-capitalize">
              {appointment.status}
            </span>
          </div>
          <div className="pd-meta-item">
            <span className="pd-meta-label">Payment</span>
            <span
              className={`pd-meta-value ${appointment.paymentStatus === "paid" ? "pd-text-green" : "pd-text-warn"}`}
            >
              {appointment.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      {!healthProfile ? (
        <EmptyState
          icon="📋"
          message="No health profile found for this patient."
        />
      ) : (
        <>
          {/* ── Tabs ── */}
          <div className="pd-tabs">
            {[
              { id: "ai", label: "🤖 AI Analysis" },
              { id: "history", label: "📋 Patient History" },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`pd-tab ${activeTab === tab.id ? "pd-tab--active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ════════════════ AI Analysis Tab ════════════════ */}
          {activeTab === "ai" && (
            <div className="pd-tab-content pd-fade-in">
              {/* Flags */}
              {activeFlags.length > 0 && (
                <Card>
                  <SectionLabel>CRITICAL FLAGS</SectionLabel>
                  <div className="pd-chips-row">
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
                  <div className="pd-lab-grid">
                    {Object.entries(LAB_META).map(
                      ([key, { label, unit, icon }]) => {
                        const val = labValues[key];
                        if (val == null || val === "") return null;

                        const displayVal =
                          typeof val === "object" ? val.value : val;
                        const displayUnit =
                          typeof val === "object" && val.unit ? val.unit : unit;

                        return (
                          <LabItem
                            key={key}
                            icon={icon}
                            label={label}
                            value={displayVal}
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
                    <div className="pd-info-row">
                      <span className="pd-info-key">🩸 Blood Group</span>
                      <span className="pd-info-val">{ai.bloodGroup}</span>
                    </div>
                  )}

                  {mergedAllergies.length > 0 && (
                    <div className="pd-info-row pd-info-row--stack">
                      <span className="pd-info-key">⚠️ Allergies</span>
                      <div className="pd-chips-row">
                        {mergedAllergies.map((a, i) => (
                          <Chip key={i} label={a} variant="warn" />
                        ))}
                      </div>
                    </div>
                  )}

                  {ai?.currentMedications?.length > 0 && (
                    <div className="pd-info-row pd-info-row--stack">
                      <span className="pd-info-key">💊 Medications</span>
                      <div className="pd-chips-row">
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
                  <SectionLabel>AI INSIGHTS</SectionLabel>
                  <ul className="pd-insights-list">
                    {insights.map((insight, i) => (
                      <li key={i} className="pd-insight-item">
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
            <div className="pd-tab-content pd-fade-in">
              {/* Known Conditions */}
              {ud?.conditions && Object.values(ud.conditions).some(Boolean) && (
                <Card>
                  <SectionLabel>KNOWN CONDITIONS</SectionLabel>
                  <div className="pd-chips-row">
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
                  <div className="pd-chips-row">
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
                  <SectionLabel>PATIENT REPORTED MEDICATIONS</SectionLabel>
                  <ul className="pd-dot-list">
                    {ud.medications.map((m, i) => (
                      <li key={i} className="pd-dot-item">
                        <span className="pd-dot-icon">💊</span>
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
                    <div className="pd-past-block">
                      <span className="pd-past-type">🔪 Surgeries</span>
                      <div className="pd-chips-row">
                        {ud.pastEvents.surgeries.map((s, i) => (
                          <Chip key={i} label={s} variant="light" />
                        ))}
                      </div>
                    </div>
                  )}

                  {ud.pastEvents.injuries?.length > 0 && (
                    <div className="pd-past-block">
                      <span className="pd-past-type">🩹 Injuries</span>
                      <div className="pd-chips-row">
                        {ud.pastEvents.injuries.map((inj, i) => (
                          <Chip key={i} label={inj} variant="light" />
                        ))}
                      </div>
                    </div>
                  )}

                  {ud.pastEvents.majorIllness?.length > 0 && (
                    <div className="pd-past-block">
                      <span className="pd-past-type">🏥 Major Illness</span>
                      <div className="pd-chips-row">
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
                  <div className="pd-chips-row">
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
                  <div className="pd-chips-row">
                    {ud.lifestyle.smoking && (
                      <Chip emoji="🚬" label="Smoking" variant="warn" />
                    )}
                    {ud.lifestyle.alcohol && (
                      <Chip emoji="🍺" label="Alcohol" variant="warn" />
                    )}
                    {!ud.lifestyle.smoking && !ud.lifestyle.alcohol && (
                      <Chip
                        emoji="✅"
                        label="Healthy Lifestyle"
                        variant="green"
                      />
                    )}
                  </div>
                </Card>
              )}
            </div>
          )}
        </>
      )}

      {/* Bottom padding for mobile nav */}
      <div style={{ height: "80px" }} />
    </div>
  );
}
