import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import instance from "../api/axios";
import HolographicQueueToken3D from "../components/HolographicQueueToken3D";
import { playTap } from "../utils/audioFX";
import "./LiveQueue.css";

const POLL_INTERVAL = 10000; // 10 seconds

// ── Status config ─────────────────────────────
const STATUS_CONFIG = {
  waiting: {
    emoji: "⏳",
    label: "Waiting",
    sublabel: "Please wait for your turn",
    className: "lq-status--waiting",
  },
  near: {
    emoji: "🔔",
    label: "Almost Your Turn!",
    sublabel: "Get ready — 1 or 2 patients ahead",
    className: "lq-status--near",
  },
  serving: {
    emoji: "✅",
    label: "Please Go In!",
    sublabel: "The doctor is ready to see you",
    className: "lq-status--serving",
  },
};

export default function LiveQueue() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  // ── Fetch queue status ─────────────────────
  const fetchStatus = useCallback(async () => {
    try {
      const res = await instance.get(`/appointments/${appointmentId}/status`);
      setQueueData(res.data);
      setLastUpdated(new Date());
      setError("");
    } catch (err) {
      setError(err?.response?.data?.message || "Could not fetch queue status.");
    } finally {
      setLoading(false);
    }
  }, [appointmentId]);

  // ── Initial fetch + polling ────────────────
  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  // ── Derived ───────────────────────────────
  const statusKey = queueData?.status || "waiting";
  const statusConfig = STATUS_CONFIG[statusKey] || STATUS_CONFIG.waiting;

  const etaDisplay = queueData?.etaMinutes
    ? queueData.etaMinutes >= 60
      ? `${Math.floor(queueData.etaMinutes / 60)}h ${queueData.etaMinutes % 60}m`
      : `${queueData.etaMinutes} min`
    : "—";

  const timeString = lastUpdated
    ? lastUpdated.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "—";

  if (loading) {
    return (
      <div className="lq-page">
        <div className="lq-loading">
          <div className="lq-spinner" />
          <p>Connecting to live kiosk queue…</p>
        </div>
      </div>
    );
  }

  if (error && !queueData) {
    return (
      <div className="lq-page">
        <div className="lq-error-state">
          <p className="lq-error-emoji">⚠️</p>
          <p className="lq-error-msg">{error}</p>
          <button className="lq-retry-btn" onClick={fetchStatus}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="lq-page">
      {/* ── Header ── */}
      <div className="lq-header">
        <button className="lq-back-btn" onClick={() => {
          playTap();
          navigate(-1);
        }}>
          ← Back
        </button>
        <h1 className="lq-header-title">Live Kiosk Queue</h1>
        <div className="lq-live-dot-wrap">
          <span className="lq-live-dot" />
          <span className="lq-live-label">LIVE</span>
        </div>
      </div>

      <div className="lq-content">
        {/* ── 3D Holographic Queue Ticket ── */}
        <HolographicQueueToken3D
          tokenNumber={queueData?.appointmentNumber?.toString() || "12"}
          currentToken={queueData?.currentNumber?.toString() || "9"}
          approxWait={etaDisplay}
          patientName="Your Consultation Token"
          room="DelhiMed Station"
          isDoctorView={false}
        />

        {/* ── Status Banner ── */}
        <div className={`lq-status-banner ${statusConfig.className}`}>
          <span className="lq-status-emoji">{statusConfig.emoji}</span>
          <div>
            <p className="lq-status-label">{statusConfig.label}</p>
            <p className="lq-status-sublabel">{statusConfig.sublabel}</p>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="lq-stats-row">
          <div className="lq-stat-card">
            <p className="lq-stat-value">
              {Math.max(queueData?.remaining ?? 0, 0)}
            </p>
            <p className="lq-stat-label">Ahead of You</p>
          </div>

          <div className="lq-stat-card">
            <p className="lq-stat-value">{etaDisplay}</p>
            <p className="lq-stat-label">Est. Wait</p>
          </div>
        </div>

        {/* ── Progress Bar ── */}
        {queueData && (
          <div className="lq-progress-wrap">
            <div className="lq-progress-labels">
              <span>Token 1</span>
              <span>Your Turn</span>
            </div>
            <div className="lq-progress-track">
              <div
                className="lq-progress-fill"
                style={{
                  width: `${Math.min(
                    (queueData.currentNumber /
                      Math.max(queueData.appointmentNumber, 1)) *
                      100,
                    100,
                  )}%`,
                }}
              />
              <div className="lq-progress-marker" style={{ left: "100%" }} />
            </div>
          </div>
        )}

        {/* ── Info Note ── */}
        <div className="lq-info-note">
          <p>🔄 Live queue telemetry updates automatically</p>
          <p className="lq-last-updated">Last telemetry sync: {timeString}</p>
        </div>

        {/* ── Serving state CTA ── */}
        {statusKey === "serving" && (
          <div className="lq-serving-cta">
            <p className="lq-serving-text">
              🎉 It's your turn! Head to the doctor's room now.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
