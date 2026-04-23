import { useNavigate } from "react-router-dom";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import TokenOutlinedIcon from "@mui/icons-material/TokenOutlined";
import SensorsIcon from "@mui/icons-material/Sensors";
import { Avatar, Chip, Button, Paper } from "@mui/material";
import TimeUtils from "../utils/TimeUtils.jsx";
import "./AppointmentCard.css";

// ✅ Helper function to calculate appointment start time
const calculateAppointmentStartTime = (startTime, waitMinutes) => {
  try {
    let hours, minutes;

    if (
      startTime.toLowerCase().includes("am") ||
      startTime.toLowerCase().includes("pm")
    ) {
      const isPM = startTime.toLowerCase().includes("pm");
      const timePart = startTime.split(" ")[0];
      [hours, minutes] = timePart.split(":").map(Number);

      if (isPM && hours !== 12) hours += 12;
      if (!isPM && hours === 12) hours = 0;
    } else {
      [hours, minutes] = startTime.split(":").map(Number);
    }

    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    startDate.setMinutes(startDate.getMinutes() + waitMinutes);

    const resultHours = String(startDate.getHours()).padStart(2, "0");
    const resultMinutes = String(startDate.getMinutes()).padStart(2, "0");
    return `${resultHours}:${resultMinutes}`;
  } catch (err) {
    return startTime;
  }
};

export default function AppointmentCard({ appointment }) {
  const navigate = useNavigate();
  const doctor = appointment.doctorId || {};
  const { formatDate } = TimeUtils;

  // ── Is appointment today? ──────────────────────
  const apptDate = new Date(appointment.date);
  const today = new Date();
  const isToday =
    apptDate.getDate() === today.getDate() &&
    apptDate.getMonth() === today.getMonth() &&
    apptDate.getFullYear() === today.getFullYear();

  // ── Approx wait from start ─────────────────────
  const avgTime = doctor.avgConsultTime || 10;
  const totalWaitMins = Math.max(
    (appointment.appointmentNumber - 1) * avgTime,
    0,
  );
  const waitDisplay =
    totalWaitMins >= 60
      ? `~${Math.floor(totalWaitMins / 60)}h ${totalWaitMins % 60}m`
      : `~${totalWaitMins} min`;

  // ✅ Calculate appointment start time
  const appointmentStartTime = doctor.startTime
    ? calculateAppointmentStartTime(doctor.startTime, totalWaitMins)
    : "—";

  // ── Status config ──────────────────────────────
  const statusMap = {
    booked: { label: "Upcoming", className: "ac-badge-upcoming" },
    arrived: { label: "Arrived", className: "ac-badge-arrived" },
    served: { label: "Completed", className: "ac-badge-served" },
  };
  const statusConfig = statusMap[appointment.status] || statusMap.booked;

  return (
    <Paper className="ac-card" elevation={0}>
      {/* ── Row 1: Doctor info + status ── */}
      <div className="ac-top-row">
        <div className="ac-doctor-info">
          <Avatar variant="rounded" className="ac-avatar">
            {doctor.name?.[0] || "D"}
          </Avatar>
          <div>
            <p className="ac-doctor-name">{doctor.name || "Doctor"}</p>
            <p className="ac-doctor-speciality">
              {doctor.speciality || "Specialist"}
            </p>
          </div>
        </div>
        <span className={`ac-status-badge ${statusConfig.className}`}>
          {statusConfig.label}
        </span>
      </div>

      {/* ── Row 2: Token + PIN ── */}
      <div className="ac-token-pin-row">
        <div className="ac-token-box">
          <p className="ac-token-number">
            #{appointment.appointmentNumber ?? "—"}
          </p>
          <p className="ac-token-label">Token</p>
        </div>

        <div className="ac-divider-v" />

        <div className="ac-pin-box">
          <p className="ac-pin-number">{appointment.pin ?? "••••"}</p>
          <p className="ac-token-label">PIN</p>
        </div>
      </div>

      {/* ── PIN note ── */}
      {appointment.pin && (
        <div className="ac-pin-note">📋 Show this PIN at clinic reception</div>
      )}

      {/* ── Row 3: Date + Appointment Time + Payment ── */}
      <div className="ac-meta-row">
        <div className="ac-meta-chip">
          <CalendarTodayOutlinedIcon className="ac-meta-icon" />
          <span>{formatDate(appointment.date)}</span>
        </div>
        <div className="ac-meta-chip">
          <AccessTimeOutlinedIcon className="ac-meta-icon" />
          <p>Expected Time</p>
          <span>~{appointmentStartTime}</span>
        </div>
        <div className="ac-meta-chip">
          <TokenOutlinedIcon className="ac-meta-icon" />
          <span>
            {appointment.paymentStatus === "paid" ? "Paid" : "Cash at clinic"}
          </span>
        </div>
      </div>

      {/* ── Row 4: Actions ── */}
      <div className="ac-actions">
        {/* Live Queue button */}
        {isToday ? (
          <button
            className="ac-queue-btn ac-queue-btn--active"
            onClick={() => navigate(`/queue/${appointment._id}`)}
          >
            <SensorsIcon className="ac-queue-icon" />
            Live Queue
          </button>
        ) : (
          <button className="ac-queue-btn ac-queue-btn--inactive" disabled>
            <SensorsIcon className="ac-queue-icon" />
            Queue opens {formatDate(appointment.date)}
          </button>
        )}

        <button className="ac-cancel-btn">Cancel</button>
      </div>
    </Paper>
  );
}
