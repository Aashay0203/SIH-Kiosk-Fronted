// === DoctorHome.jsx ===
import { useEffect, useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import instance from "../api/axios";
import "./DoctorHome.css";
import LogoutIcon from "@mui/icons-material/Logout";
import RefreshIcon from "@mui/icons-material/Refresh";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function DoctorHome() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [doctorDetails, setDoctorDetails] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [queueStatus, setQueueStatus] = useState({
    currentNumber: 0,
    lastTokenNumber: 0,
    remaining: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [nextLoading, setNextLoading] = useState(false);
  const [nextSuccess, setNextSuccess] = useState("");

  const fetchTodayData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError("");
      const res = await instance.get("/doctors/today-appointments");
      setAppointments(res.data.appointments || []);
      setQueueStatus(
        res.data.queueStatus || {
          currentNumber: 0,
          lastTokenNumber: 0,
          remaining: 0,
        },
      );
    } catch {
      setError("Failed to load today's appointments. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTodayData();
  }, [fetchTodayData]);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      if (!user?.id) return;
      try {
        const res = await instance.get(`/doctors/${user.id}`);
        setDoctorDetails(res.data.details);
      } catch {
        // Non-critical — greeting falls back to user context
      }
    };
    fetchDoctorDetails();
  }, [user?.id]);

  const handleNextPatient = async () => {
    try {
      setNextLoading(true);
      setNextSuccess("");
      setError("");
      await instance.put("/queues/next");
      await fetchTodayData();
      setNextSuccess("Queue moved to next patient ✓");
      setTimeout(() => setNextSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.errors[0] || "Failed to move queue.");
    } finally {
      setNextLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const todayLabel = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const displayName = doctorDetails?.name || user?.name || "Doctor";
  const displaySpec = doctorDetails?.speciality || "General Physician";

  return (
    <div className="dh-root">
      {/* ── Top Bar ── */}
      <header className="dh-topbar">
        <div className="dh-topbar-info">
          <h1 className="dh-doctor-name">Dr. {displayName}</h1>
          <p className="dh-doctor-spec">{displaySpec}</p>
        </div>

        <nav
          className="dh-topbar-actions"
          aria-label="Doctor dashboard actions"
        >
          <button
            className={`dh-icon-btn${refreshing ? " dh-icon-btn--spinning" : ""}`}
            onClick={() => fetchTodayData(true)}
            aria-label="Refresh appointments"
            disabled={refreshing}
          >
            <RefreshIcon className="dh-icon-svg" />
          </button>
          <button
            className="dh-icon-btn dh-icon-btn--danger"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <LogoutIcon className="dh-icon-svg" />
          </button>
        </nav>
      </header>

      {/* ── Main Layout ── */}
      <div className="dh-layout">
        {/* Queue Card */}
        <aside className="dh-sidebar">
          <div className="dh-queue-card">
            <p className="dh-queue-date">{todayLabel}</p>

            <div className="dh-queue-stats">
              <div className="dh-stat">
                <span className="dh-stat-value">
                  {queueStatus.currentNumber}
                </span>
                <span className="dh-stat-label">Serving Now</span>
              </div>
              <div className="dh-stat-divider" aria-hidden="true" />
              <div className="dh-stat">
                <span className="dh-stat-value">
                  {queueStatus.lastTokenNumber}
                </span>
                <span className="dh-stat-label">Total Booked</span>
              </div>
              <div className="dh-stat-divider" aria-hidden="true" />
              <div className="dh-stat">
                <span className="dh-stat-value">{queueStatus.remaining}</span>
                <span className="dh-stat-label">Remaining</span>
              </div>
            </div>

            <button
              className="dh-next-btn"
              onClick={handleNextPatient}
              disabled={nextLoading || queueStatus.remaining === 0}
              aria-busy={nextLoading}
            >
              {nextLoading ? (
                <span className="dh-next-btn-inner">
                  <span className="dh-next-spinner" aria-hidden="true" />
                  Moving…
                </span>
              ) : (
                <span className="dh-next-btn-inner">
                  Next Patient
                  <ArrowForwardIcon className="dh-next-icon" />
                </span>
              )}
            </button>

            {nextSuccess && (
              <p className="dh-next-success" role="status" aria-live="polite">
                {nextSuccess}
              </p>
            )}
          </div>
        </aside>

        {/* Appointment List */}
        <main className="dh-main">
          <div className="dh-section-header">
            <h2 className="dh-section-title">Today's Appointments</h2>
            <span
              className="dh-count-badge"
              aria-label={`${appointments.length} appointments`}
            >
              {appointments.length}
            </span>
          </div>

          {error && (
            <div className="dh-error" role="alert">
              <span>{error}</span>
              <button
                className="dh-error-retry"
                onClick={() => fetchTodayData()}
              >
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <SkeletonList />
          ) : appointments.length === 0 ? (
            <div className="dh-empty" role="status">
              <span className="dh-empty-icon">🎉</span>
              <p className="dh-empty-title">No appointments today</p>
              <p className="dh-empty-sub">
                Your schedule is clear — enjoy the day!
              </p>
            </div>
          ) : (
            <div
              className="dh-appt-list"
              role="list"
              aria-label="Appointment list"
            >
              {appointments.map((appt) => (
                <article
                  key={appt._id}
                  className="dh-appt-card"
                  role="listitem"
                  onClick={() =>
                    navigate(`/doctor/patient/${appt._id}`, {
                      state: { appointment: appt },
                    })
                  }
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      navigate(`/doctor/patient/${appt._id}`, {
                        state: { appointment: appt },
                      });
                  }}
                  aria-label={`Patient ${appt.patientId?.name || "Unknown"}, token ${appt.appointmentNumber}`}
                >
                  <div className="dh-appt-token" aria-hidden="true">
                    <span className="dh-token-num">
                      #{appt.appointmentNumber}
                    </span>
                  </div>

                  <div className="dh-appt-info">
                    <p className="dh-patient-name">
                      {appt.patientId?.name || "Patient"}
                    </p>
                    <p className="dh-appt-meta">
                      <AccessTimeOutlinedIcon
                        className="dh-time-icon"
                        aria-hidden="true"
                      />
                      {appt.slotTime}
                      {appt.patientId?.phone
                        ? ` · ${appt.patientId.phone}`
                        : ""}
                    </p>
                  </div>

                  <div className="dh-appt-right">
                    <span
                      className={`dh-pay-badge${
                        appt.paymentStatus === "paid"
                          ? " dh-pay-badge--paid"
                          : " dh-pay-badge--pending"
                      }`}
                    >
                      {appt.paymentStatus === "paid" ? "Paid" : "Pending"}
                    </span>
                    <p className="dh-appt-status">{appt.status}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function SkeletonList() {
  return (
    <div
      className="dh-skeleton-list"
      aria-busy="true"
      aria-label="Loading appointments"
    >
      {[...Array(5)].map((_, i) => (
        <div key={i} className="dh-skeleton-card">
          <div className="dh-skeleton dh-skeleton--token" />
          <div className="dh-skeleton-card-info">
            <div className="dh-skeleton dh-skeleton--name" />
            <div className="dh-skeleton dh-skeleton--meta" />
          </div>
          <div className="dh-skeleton-card-right">
            <div className="dh-skeleton dh-skeleton--badge" />
            <div className="dh-skeleton dh-skeleton--status" />
          </div>
        </div>
      ))}
    </div>
  );
}
