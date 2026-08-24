// === DoctorHome.jsx ===
import { useEffect, useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import instance from "../api/axios";
import { playChime, playTap, playSuccess } from "../utils/audioFX";
import { useLanguage } from "../context/LanguageContext";
import HolographicQueueToken3D from "../components/HolographicQueueToken3D";
import "./DoctorHome.css";
import LogoutIcon from "@mui/icons-material/Logout";
import RefreshIcon from "@mui/icons-material/Refresh";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Sparkles, Activity, User, ShieldCheck } from "lucide-react";

export default function DoctorHome() {
  const { user, logout } = useContext(AuthContext);
  const { t } = useLanguage();
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
        // Fallback
      }
    };
    fetchDoctorDetails();
  }, [user?.id]);

  const handleNextPatient = async () => {
    playChime();
    try {
      setNextLoading(true);
      setNextSuccess("");
      setError("");
      await instance.put("/queues/next");
      await fetchTodayData();
      playSuccess();
      setNextSuccess("Queue moved to next patient ✓");
      setTimeout(() => setNextSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.errors?.[0] || "Failed to move queue.");
    } finally {
      setNextLoading(false);
    }
  };

  const handleLogout = () => {
    playTap();
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
    <motion.div
      className="dh-root"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* ── Main Layout ── */}
      <div className="dh-layout">
        {/* 3D Holographic Queue Card Sidebar */}
        <aside className="dh-sidebar">
          <HolographicQueueToken3D
            tokenNumber={queueStatus.currentNumber.toString()}
            currentToken={queueStatus.currentNumber.toString()}
            approxWait={`${queueStatus.remaining * 8} mins`}
            patientName={`Queue Status (${queueStatus.remaining} Waiting)`}
            room="Consultation Room 1"
            isDoctorView={true}
            onCallNext={handleNextPatient}
          />
        </aside>

        {/* Appointment List */}
        <main className="dh-main">
          <div className="dh-section-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h2 className="dh-section-title">Today's Patient Queue</h2>
              <span
                className="dh-count-badge"
                aria-label={`${appointments.length} appointments`}
              >
                {appointments.length}
              </span>
            </div>
            <button
              className={`dh-icon-btn ${refreshing ? "dh-icon-btn--spinning" : ""}`}
              onClick={() => {
                playTap();
                fetchTodayData(true);
              }}
              disabled={refreshing}
              aria-label="Refresh appointments"
              style={{ width: '36px', height: '36px' }}
            >
              <RefreshIcon className="dh-icon-svg" style={{ fontSize: '18px' }} />
            </button>
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
            <div className="dh-loading-box">
              <p>Loading clinical telemetry...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="dh-empty" role="status">
              <span className="dh-empty-icon">🎉</span>
              <p className="dh-empty-title">No appointments in queue</p>
              <p className="dh-empty-sub">
                Your schedule is clear for today.
              </p>
            </div>
          ) : (
            <div className="dh-appt-list" role="list">
              <AnimatePresence>
                {appointments.map((appt, i) => {
                  const isCurrent = appt.tokenNumber === queueStatus.currentNumber;
                  return (
                    <motion.article
                      key={appt._id}
                      className={`dh-appt-card ${isCurrent ? "dh-appt-card--current" : ""}`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: i * 0.04 }}
                      onClick={() => {
                        playTap();
                        navigate(`/doctor/patient/${appt._id}`);
                      }}
                    >
                      <div className="dh-appt-token-col">
                        <span className="dh-appt-token-num">
                          #{appt.tokenNumber}
                        </span>
                        {isCurrent && (
                          <span className="dh-current-badge">NOW</span>
                        )}
                      </div>

                      <div className="dh-appt-body">
                        <div className="dh-appt-row1">
                          <h3 className="dh-appt-name">{appt.userName || "Patient"}</h3>
                          <span className="dh-appt-time">
                            <AccessTimeOutlinedIcon className="dh-time-icon" />
                            {appt.timeSlot || "Scheduled"}
                          </span>
                        </div>

                        <div className="dh-appt-row2">
                          <span className="dh-appt-contact">
                            📞 {appt.userPhone || "—"}
                          </span>
                          <span className="dh-appt-meta-pill">
                            ABHA Verified
                          </span>
                        </div>
                      </div>

                      <div className="dh-appt-arrow">
                        <ArrowForwardIcon />
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </main>
      </div>
    </motion.div>
  );
}
