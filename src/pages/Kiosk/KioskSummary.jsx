import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import CheckIcon from "@mui/icons-material/Check";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import HomeIcon from "@mui/icons-material/Home";
import api from "../../api/axios";
import "./KioskSummary.css";

const SECTIONS = [
  { key: "chiefComplaint", label: "Chief Complaint" },
  { key: "hpi", label: "History of Present Illness" },
  { key: "pastHistory", label: "Past Medical / Surgical History" },
  { key: "drugAllergyHistory", label: "Drug & Allergy History" },
  { key: "familyHistory", label: "Family History" },
  { key: "personalHistory", label: "Personal History" },
  { key: "reviewOfSystems", label: "Review of Systems" },
];

export default function KioskSummary() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [status, setStatus] = useState("in-progress");
  const [redFlags, setRedFlags] = useState([]);
  const [docs, setDocs] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSummary = async () => {
      setLoading(true);
      setError("");
      try {
        // GET first — only POST/generate if nothing exists yet
        const existing = await api.get(`/kiosk/${sessionId}`);
        if (
          existing.data.status === "summarized" ||
          existing.data.status === "pushed-to-his"
        ) {
          setSummary(existing.data.structuredSummary);
          setStatus(existing.data.status);
          setRedFlags(existing.data.redFlags || []);
          setDocs(existing.data.digitizedDocs || []);
          return;
        }
        const res = await api.post(`/kiosk/${sessionId}/generate-summary`);
        setSummary(res.data.structuredSummary);
        setStatus(res.data.status || "summarized");
        setRedFlags(res.data.redFlags || []);
        setDocs(res.data.digitizedDocs || []);
      } catch (err) {
        const errorMessage =
          err.response?.data?.errors?.join(", ") ||
          err.response?.data?.message ||
          "Couldn't load the summary. Please try again.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    loadSummary();
  }, [sessionId]);

  const handleSectionChange = (key, value) => {
    setSummary((prev) => ({ ...prev, [key]: value }));
  };

  const handleReplay = () => {
    const text = summary?.plainSummary?.trim();

    if (!text || !("speechSynthesis" in window)) {
      setError("Speech playback is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";
    utterance.rate = 0.9;
    utterance.volume = 1;

    utterance.onerror = () => {
      setError("Could not play the summary audio.");
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      await api.post(`/kiosk/${sessionId}/submit-summary`, {
        structuredSummary: summary,
      });
      setSubmitted(true);
    } catch (err) {
      const errorMessage =
        err.response?.data?.errors?.join(", ") ||
        err.response?.data?.message ||
        "Couldn't submit. Please try again.";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="pn-loader">
        <CircularProgress sx={{ color: "var(--blue)" }} />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mk-summary-root">
        <div className="mk-summary-container">
          <div className="mk-summary-success-card">
            <div className="mk-summary-success-icon">
              <CheckIcon fontSize="medium" />
            </div>
            <p className="mk-summary-success-title">
              Summary sent to your doctor
            </p>
            <p className="mk-summary-success-text">
              Please head to the waiting area. Your session data has been
              cleared.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mk-summary-root">
      <div className="mk-summary-container">
        <div className="pn-top-nav">
          <button className="pn-nav-btn" onClick={() => navigate(-1)}>
            <ArrowBackIosNewIcon fontSize="small" /> Back
          </button>
          <button className="pn-nav-btn" onClick={() => navigate("/home")}>
            <HomeIcon fontSize="small" /> Home
          </button>
        </div>

        <div className="mk-summary-header">
          <div>
            <h1 className="mk-summary-title">Review Your Summary</h1>
            <p className="mk-summary-subtitle">
              Check this is correct — your doctor will read this before your
              consultation.
            </p>
          </div>
          <span className={`mk-summary-status-chip ${status}`}>
            {status === "in-progress"
              ? "In Progress"
              : status === "pushed-to-his"
                ? "Sent"
                : "Ready"}
          </span>
        </div>

        {redFlags.length > 0 && (
          <div className="mk-summary-redflag">
            <WarningAmberIcon fontSize="small" />
            Flagged for priority: {redFlags.join(", ")}
          </div>
        )}

        {error && <div className="pn-error">{error}</div>}

        {summary?.plainSummary && (
          <div className="mk-summary-plain-card">
            <p className="mk-summary-plain-text">{summary.plainSummary}</p>
            <button className="mk-summary-replay-btn" onClick={handleReplay}>
              <VolumeUpIcon fontSize="small" />
            </button>
          </div>
        )}

        {SECTIONS.map((s) => (
          <div key={s.key} className="mk-summary-section">
            <p className="mk-summary-section-label">{s.label}</p>
            <textarea
              className="mk-summary-textarea"
              value={summary?.[s.key] || ""}
              onChange={(e) => handleSectionChange(s.key, e.target.value)}
              rows={2}
            />
          </div>
        ))}

        {docs.length > 0 && (
          <div className="mk-summary-docs-row">
            {docs
              .slice()
              .sort((a, b) => new Date(a.docDate) - new Date(b.docDate))
              .map((d, i) => (
                <span key={i} className={`mk-summary-doc-chip ${d.aiStatus}`}>
                  {d.docDate
                    ? new Date(d.docDate).toLocaleDateString()
                    : "Undated"}{" "}
                  · {d.preview}
                </span>
              ))}
          </div>
        )}

        <p className="mk-summary-session-note">
          Your session will be cleared once this is submitted.
        </p>

        <button
          className="mk-summary-submit-btn"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <CircularProgress size={20} sx={{ color: "#ffffff" }} />
          ) : (
            "Confirm & Submit to Doctor"
          )}
        </button>
      </div>
    </div>
  );
}
