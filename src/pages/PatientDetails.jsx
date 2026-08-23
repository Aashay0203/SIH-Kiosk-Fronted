import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import instance from "../api/axios";
import "./PatientDetails.css";
import { IconButton, Avatar, Button } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SpaIcon from "@mui/icons-material/Spa";
import VerifiedIcon from "@mui/icons-material/Verified";
import MedicalTimeline from "../components/MedicalTimeline";
import FhirViewerModal from "../components/FhirViewerModal";
import PrescriptionCdssModal from "../components/PrescriptionCdssModal";
import { generateAbdmFhirBundle } from "../utils/fhirService";

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

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

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
  const [clinicalSummary, setClinicalSummary] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("summary"); // 'summary', 'ai', 'history', 'timeline'
  const [isVerified, setIsVerified] = useState(false);
  const [showFhirModal, setShowFhirModal] = useState(false);
  const [showRxModal, setShowRxModal] = useState(false);

  useEffect(() => {
    const patientId = appointment?.patientId?._id;
    if (!patientId) {
      setLoading(false);
      return;
    }

    const fetchHealthProfileAndSummary = async () => {
      try {
        const [profileRes, summaryRes] = await Promise.allSettled([
          instance.get(`/doctors/patient-profile/${patientId}`),
          instance.get(`/healthProfile/summary/${patientId}`),
        ]);

        if (profileRes.status === "fulfilled" && profileRes.value.data?.profile) {
          setHealthProfile(profileRes.value.data.profile);
        }

        if (summaryRes.status === "fulfilled" && summaryRes.value.data?.summary) {
          setClinicalSummary(summaryRes.value.data.summary);
        }
      } catch (err) {
        console.error("Failed to fetch patient records:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthProfileAndSummary();
  }, [appointment]);

  const patient = appointment?.patientId || {};
  const ai = healthProfile?.aiExtracted || {};
  const ud = healthProfile?.userProvided || {};

  const flags = ai?.specialFlags || {};
  const labValues = ai?.labValues || {};
  const insights = ai?.personalizedInsights || [];
  const activeFlags = Object.entries(flags).filter(([, v]) => v);
  const redFlag = ud?.redFlagAlert || {};
  const ayush = ud?.ayushAssessment || null;
  const socrates = ud?.socratesHpi || null;

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
        <p className="pd-loading-text">Loading patient OPD intake profile…</p>
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

        <h4 className="pd-navbar-title">Doctor Consultation Console</h4>

        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: "#2563eb",
            fontWeight: 800,
            fontSize: 16,
          }}
        >
          {patient.name?.[0]?.toUpperCase() || "P"}
        </Avatar>
      </div>

      {/* ── Emergency Red Flag Alert Bar ── */}
      {redFlag?.isTriggered && (
        <div className="pd-redflag-banner">
          <WarningAmberIcon sx={{ fontSize: 28, color: "#ffffff" }} />
          <div>
            <strong>🚨 EMERGENCY TRIAGE ALERT: {redFlag.severity} SEVERITY</strong>
            <p>{redFlag.reasons?.join(" • ") || "Critical symptom pattern flagged by Kiosk AI."}</p>
          </div>
        </div>
      )}

      {/* ── Profile Hero ── */}
      <div className="pd-hero">
        <div className="pd-hero-avatar">
          {patient.name?.[0]?.toUpperCase() || "P"}
        </div>
        <div className="pd-hero-info">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <h1 className="pd-hero-name">{patient.name || "Patient"}</h1>
            {ud?.consentAndAbha?.abhaId && (
              <span className="pd-abha-badge">
                <VerifiedIcon sx={{ fontSize: 14 }} /> ABHA: {ud.consentAndAbha.abhaId}
              </span>
            )}
          </div>
          <p className="pd-hero-sub">
            {patient.phone || patient.email || "No contact provided"} • Token #{appointment.appointmentNumber}
          </p>
        </div>

        {/* Doctor Verification & FHIR Export Actions */}
        <div className="pd-action-box" style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <button
            type="button"
            className="btn-verify-intake"
            style={{ background: "#7c3aed", border: "none" }}
            onClick={() => setShowRxModal(true)}
          >
            💊 Write Rx (CDSS Safety)
          </button>
          <button
            type="button"
            className="btn-verify-intake"
            style={{ background: "#0f172a", border: "1px solid #334155" }}
            onClick={() => setShowFhirModal(true)}
          >
            📜 ABDM FHIR Bundle
          </button>
          <button
            type="button"
            className={`btn-verify-intake ${isVerified ? "verified" : ""}`}
            onClick={() => setIsVerified(!isVerified)}
          >
            {isVerified ? <CheckCircleIcon sx={{ fontSize: 18 }} /> : <LocalHospitalIcon sx={{ fontSize: 18 }} />}
            {isVerified ? "Intake Verified & Accepted" : "1-Click Verify Intake"}
          </button>
        </div>
      </div>

      {/* ABDM FHIR JSON Viewer Modal */}
      <FhirViewerModal
        isOpen={showFhirModal}
        onClose={() => setShowFhirModal(false)}
        fhirBundle={generateAbdmFhirBundle({
          patient,
          healthProfile,
          clinicalSummary,
          doctor: null,
          appointment,
        })}
      />

      {/* AI CDSS Prescription Safety Modal */}
      <PrescriptionCdssModal
        isOpen={showRxModal}
        onClose={() => setShowRxModal(false)}
        patient={{ name: patient?.name, appointmentNumber: appointment?.appointmentNumber }}
        patientAllergies={mergedAllergies}
        currentMedications={[...(ud?.medications || []), ...(ai?.currentMedications || [])]}
        labFlags={flags}
        doctorName="Doctor"
      />

      {/* ── Appointment Meta Banner ── */}
      <div className="pd-alert-banner">
        <div className="pd-meta-grid">
          <div className="pd-meta-item">
            <span className="pd-meta-label">Slot Time</span>
            <span className="pd-meta-value">{appointment.slotTime}</span>
          </div>
          <div className="pd-meta-item">
            <span className="pd-meta-label">Consultation Status</span>
            <span className="pd-meta-value pd-capitalize">{appointment.status}</span>
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
          message="No Kiosk health intake found for this patient yet."
        />
      ) : (
        <>
          {/* ── Tabs ── */}
          <div className="pd-tabs">
            {[
              { id: "summary", label: "⚡ 10-Sec Clinical Summary" },
              { id: "ai", label: "🧪 Lab & AI Analysis" },
              { id: "history", label: "📋 Full History & SOCRATES" },
              { id: "timeline", label: "📅 Medical Timeline" },
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

          {/* ════════════════ 10-Second Doctor OPD Summary Tab ════════════════ */}
          {activeTab === "summary" && (
            <div className="pd-tab-content pd-fade-in">
              {/* Executive One-Liner */}
              <Card className="pd-summary-hero-card">
                <SectionLabel>EXECUTIVE CLINICAL SUMMARY</SectionLabel>
                <h3 className="pd-oneliner-text">
                  {clinicalSummary?.oneLiner ||
                    ud?.chiefComplaint ||
                    "Patient presented for clinical consultation."}
                </h3>
              </Card>

              {/* Chief Complaint & SOCRATES HPI */}
              <Card>
                <SectionLabel>CHIEF COMPLAINT & HPI (SOCRATES)</SectionLabel>
                <p className="pd-narrative-text">
                  {clinicalSummary?.chiefComplaintHpi ||
                    (socrates
                      ? `${ud.chiefComplaint || "Discomfort"} characterized as ${socrates.character || "acute"} pain at ${socrates.site || "site"}, onset ${socrates.onset || "recent"}, severity ${socrates.severity || 5}/10, radiation to ${socrates.radiation || "none"}.`
                      : ud.chiefComplaint || "No acute complaint documented.")}
                </p>
                {socrates && (
                  <div className="socrates-pill-row">
                    <span className="s-pill">📍 Site: {socrates.site || "Local"}</span>
                    <span className="s-pill">⏱️ Onset: {socrates.onset || "Recent"}</span>
                    <span className="s-pill">⚡ Severity: {socrates.severity || 5}/10</span>
                    <span className="s-pill">🔄 Timing: {socrates.timing || "Constant"}</span>
                  </div>
                )}
              </Card>

              {/* AYUSH Assessment Card (if present) */}
              {ayush && ayush.prakriti && (
                <Card className="pd-ayush-card">
                  <div className="ayush-title-row">
                    <SpaIcon sx={{ color: "#166534" }} />
                    <SectionLabel>AYUSH / AYURVEDIC OPD PARIKSHA</SectionLabel>
                  </div>
                  <div className="ayush-meta-grid">
                    <div className="ayush-metric">
                      <span className="metric-k">Prakriti:</span>
                      <strong className="metric-v">{ayush.prakriti}</strong>
                    </div>
                    <div className="ayush-metric">
                      <span className="metric-k">Agni:</span>
                      <strong className="metric-v">{ayush.agni || "Normal"}</strong>
                    </div>
                    <div className="ayush-metric">
                      <span className="metric-k">Koshtha:</span>
                      <strong className="metric-v">{ayush.koshtha || "Madhyama"}</strong>
                    </div>
                    <div className="ayush-metric">
                      <span className="metric-k">Sleep / Diet:</span>
                      <strong className="metric-v">{ayush.sleepQuality || "Normal"}</strong>
                    </div>
                  </div>
                </Card>
              )}

              {/* Current Meds & Allergies */}
              <div className="pd-dual-cards">
                <Card className="pd-card-half">
                  <SectionLabel>💊 CURRENT MEDICATIONS</SectionLabel>
                  {ud?.medications?.length > 0 || ai?.currentMedications?.length > 0 ? (
                    <div className="pd-chips-row">
                      {[...(ud?.medications || []), ...(ai?.currentMedications || [])].map((m, i) => (
                        <Chip key={i} label={m} variant="blue" />
                      ))}
                    </div>
                  ) : (
                    <p className="pd-dim-text">No active medications documented</p>
                  )}
                </Card>

                <Card className="pd-card-half">
                  <SectionLabel>⚠️ ALLERGIES</SectionLabel>
                  {mergedAllergies.length > 0 ? (
                    <div className="pd-chips-row">
                      {mergedAllergies.map((a, i) => (
                        <Chip key={i} label={a} variant="warn" />
                      ))}
                    </div>
                  ) : (
                    <p className="pd-dim-text">No known drug/food allergies</p>
                  )}
                </Card>
              </div>

              {/* AI Clinical Differential Considerations */}
              {clinicalSummary?.differentialSuggestions?.length > 0 && (
                <Card>
                  <SectionLabel>DIFFERENTIAL CONSIDERATIONS (AI ASSIST)</SectionLabel>
                  <ul className="pd-insights-list">
                    {clinicalSummary.differentialSuggestions.map((item, idx) => (
                      <li key={idx} className="pd-insight-item">
                        💡 {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>
          )}

          {/* ════════════════ Lab & AI Analysis Tab ════════════════ */}
          {activeTab === "ai" && (
            <div className="pd-tab-content pd-fade-in">
              {activeFlags.length > 0 && (
                <Card>
                  <SectionLabel>CRITICAL LAB FLAGS</SectionLabel>
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

              {Object.values(labValues).some(
                (v) => v !== null && v !== undefined && v !== "",
              ) ? (
                <Card>
                  <SectionLabel>EXTRACTED LAB VALUES</SectionLabel>
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

              {insights.length > 0 && (
                <Card>
                  <SectionLabel>AI INSIGHTS & INTERPRETATIONS</SectionLabel>
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

          {/* ════════════════ Full History Tab ════════════════ */}
          {activeTab === "history" && (
            <div className="pd-tab-content pd-fade-in">
              {ud?.conditions && Object.values(ud.conditions).some(Boolean) && (
                <Card>
                  <SectionLabel>KNOWN CHRONIC CONDITIONS</SectionLabel>
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

              {ud?.pastEvents && (
                <Card>
                  <SectionLabel>PAST SURGERIES & ILLNESSES</SectionLabel>
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
              )}

              {ud?.lifestyle && (
                <Card>
                  <SectionLabel>LIFESTYLE HABITS</SectionLabel>
                  <div className="pd-chips-row">
                    {ud.lifestyle.smoking && (
                      <Chip emoji="🚬" label={`Smoking: ${ud.lifestyle.smoking}`} variant="warn" />
                    )}
                    {ud.lifestyle.alcohol && (
                      <Chip emoji="🍺" label={`Alcohol: ${ud.lifestyle.alcohol}`} variant="warn" />
                    )}
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* ════════════════ Medical Timeline Tab ════════════════ */}
          {activeTab === "timeline" && (
            <div className="pd-tab-content pd-fade-in">
              <MedicalTimeline appointments={[appointment]} reports={reports} />
            </div>
          )}
        </>
      )}

      {/* Bottom padding for mobile nav */}
      <div style={{ height: "80px" }} />
    </div>
  );
}
