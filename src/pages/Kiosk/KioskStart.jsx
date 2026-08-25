import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import MicIcon from "@mui/icons-material/Mic";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import HomeIcon from "@mui/icons-material/Home";
import { useAuth } from "../../context/useAuth";
import api from "../../api/axios";
import "./KioskStart.css";

const LANGUAGES = [
  { code: "hi-IN", label: "हिंदी" },
  { code: "en-IN", label: "English" },
  { code: "bn-IN", label: "বাংলা" },
  { code: "ta-IN", label: "தமிழ்" },
];

export default function KioskStart() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [language, setLanguage] = useState("hi-IN");
  const [mode, setMode] = useState("standard");
  const [consented, setConsented] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const appointmentId = location.state?.appointmentId;

  const handleBegin = async () => {
    if (!consented) {
      setError("Please provide consent to continue.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/kiosk/start", {
        patientId: user?._id,
        appointmentId,
        language,
        mode,
      });
      navigate(`/kiosk/${res.data.sessionId}/converse`);
    } catch (err) {
      const errorMessage =
        err.response?.data?.errors?.join(", ") ||
        err.response?.data?.message ||
        "Could not start check-in. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mk-start-root">
      <div className="mk-start-container">
        <div className="pn-top-nav">
          <button className="pn-nav-btn" onClick={() => navigate(-1)}>
            <ArrowBackIosNewIcon fontSize="small" /> Back
          </button>
          <button className="pn-nav-btn" onClick={() => navigate("/home")}>
            <HomeIcon fontSize="small" /> Home
          </button>
        </div>

        <div className="mk-start-header">
          <div className="mk-start-icon">
            <MicIcon fontSize="medium" />
          </div>
          <h1 className="mk-start-title">Health Check-in</h1>
          <p className="mk-start-subtitle">
            Tell us what's bothering you before you see the doctor — speak or
            tap, in your own language.
          </p>
          <div className="mk-start-divider" />
        </div>

        <div className="mk-start-card">
          <p className="mk-start-card-label">Choose your language</p>
          <div className="mk-start-chip-row">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                className={`mk-start-chip ${language === l.code ? "active" : ""}`}
                onClick={() => setLanguage(l.code)}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mk-start-card">
          <p className="mk-start-card-label">Interview type</p>
          <div className="mk-start-mode-toggle">
            <button
              className={`mk-start-mode-btn ${mode === "standard" ? "active" : ""}`}
              onClick={() => setMode("standard")}
            >
              Standard
            </button>
            <button
              className={`mk-start-mode-btn ${mode === "ayush" ? "active" : ""}`}
              onClick={() => setMode("ayush")}
            >
              AYUSH
            </button>
          </div>
          <p className="mk-start-mode-hint">
            {mode === "ayush"
              ? "Includes Prakriti, Vikriti, Agni and Ahara-Vihara assessment for Ayurvedic consultations."
              : "Standard chief complaint, HPI, and review of systems interview."}
          </p>
        </div>

        <div className="mk-start-card">
          <div className="mk-start-consent-row">
            <input
              type="checkbox"
              checked={consented}
              onChange={(e) => setConsented(e.target.checked)}
            />
            <p className="mk-start-consent-text">
              I consent to my voice, answers, and uploaded documents being
              securely processed to build my medical history for this visit.
              Session data is cleared once submitted. <a href="#">Learn more</a>
            </p>
          </div>
        </div>

        {error && <div className="pn-error">{error}</div>}

        <button
          className="mk-start-btn"
          onClick={handleBegin}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={20} sx={{ color: "#ffffff" }} />
          ) : (
            <>
              <MicIcon fontSize="small" /> Begin Check-in
            </>
          )}
        </button>
      </div>
    </div>
  );
}
