import { useState, useEffect } from "react";
import instance from "../api/axios";
import "./PinModal.css";

export default function PinModal({ appointment, onClose, onSuccess }) {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  // close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // auto-focus input on open
  useEffect(() => {
    const t = setTimeout(() => {
      document.getElementById("pin-input")?.focus();
    }, 100);
    return () => clearTimeout(t);
  }, []);

  const handleVerify = async () => {
    if (pin.length !== 4) {
      setError("Enter 4-digit PIN");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await instance.put(`/appointments/${appointment._id}/arrive`, { pin });
      onSuccess(appointment._id);
      onClose();
    } catch (err) {
      const msg = err?.response?.data?.message || "Invalid PIN";
      setError(msg);
      setShake(true);
      setPin("");
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleVerify();
    if (e.key === "Escape") onClose();
  };

  return (
    <div className="pm-backdrop" onClick={handleBackdrop}>
      <div className={`pm-modal ${shake ? "pm-shake" : ""}`}>
        {/* ── Header ── */}
        <div className="pm-header">
          <div className="pm-patient-avatar">
            {appointment.patientId?.name?.[0] || "P"}
          </div>
          <div>
            <p className="pm-patient-name">
              {appointment.patientId?.name || "Patient"}
            </p>
            <p className="pm-patient-sub">
              Token #{appointment.appointmentNumber} •{" "}
              {appointment.patientId?.phone || "—"}
            </p>
          </div>
        </div>

        {/* ── PIN Input ── */}
        <p className="pm-instruction">Enter patient's 4-digit PIN</p>

        <input
          id="pin-input"
          className={`pm-pin-input ${error ? "pm-pin-error" : ""}`}
          type="number"
          inputMode="numeric"
          maxLength={4}
          placeholder="• • • •"
          value={pin}
          onChange={(e) => {
            const val = e.target.value.slice(0, 4);
            setPin(val);
            setError("");
          }}
          onKeyDown={handleKeyDown}
        />

        {/* ── Error ── */}
        {error && <p className="pm-error-msg">⚠️ {error}</p>}

        {/* ── Actions ── */}
        <div className="pm-actions">
          <button
            className="pm-cancel-btn"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="pm-verify-btn"
            onClick={handleVerify}
            disabled={loading || pin.length !== 4}
          >
            {loading ? "Verifying…" : "Check In ✓"}
          </button>
        </div>
      </div>
    </div>
  );
}
