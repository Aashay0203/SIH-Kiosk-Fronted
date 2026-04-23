import { CheckIcon } from "../utils/Icon";

export function SuccessOverlay({
  method,
  onDone,
  rawPin,
  appointmentNumber,
  doctorName,
  dateDisplay,
}) {
  return (
    <div className="success-overlay">
      <div className="success-card">
        {/* ── Icon ── */}
        <div className="success-icon-ring">
          <CheckIcon />
        </div>

        {/* ── Title ── */}
        <h2 className="success-title">
          {method === "cash" ? "Appointment Reserved!" : "Payment Successful!"}
        </h2>

        {/* ── Token + PIN ── */}
        <div className="success-info-row">
          <div className="success-info-box">
            <p className="success-info-big">#{appointmentNumber ?? "—"}</p>
            <p className="success-info-label">Your Token</p>
          </div>
          <div className="success-info-divider" />
          <div className="success-info-box">
            <p className="success-info-big pin">{rawPin ?? "—"}</p>
            <p className="success-info-label">Your PIN</p>
          </div>
        </div>

        {/* ── PIN Note ── */}
        <div className="success-pin-note">
          📋 Show this PIN at the clinic reception
        </div>

        {/* ── Appointment Info ── */}
        <div className="success-appt-info">
          {doctorName && <p className="success-appt-line">👨‍⚕️ {doctorName}</p>}
          {dateDisplay && <p className="success-appt-line">📅 {dateDisplay}</p>}
          {method === "cash" && (
            <p className="success-appt-line">💵 Pay at clinic</p>
          )}
        </div>

        {/* ── Screenshot reminder ── */}
        <p className="success-screenshot-hint">
          📸 Take a screenshot to save your PIN
        </p>

        {/* ── CTA ── */}
        <button className="success-done-btn" onClick={onDone}>
          Go to My Appointments
        </button>
      </div>
    </div>
  );
}
