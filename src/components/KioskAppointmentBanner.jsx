import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import MicNoneIcon from "@mui/icons-material/MicNone";
import api from "../api/axios";
import { useAuth } from "../context/useAuth";
import "./KioskAppointmentBanner.css";

const DISMISS_KEY_PREFIX = "kiosk-banner-dismissed-";

export default function KioskAppointmentBanner() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [visible, setVisible] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUpcomingAppointment = async () => {
      try {
        const res = await api.get("/appointments/my-appointements");
        console.log(res.data);
        const appointments = res.data?.appointments || [];

        const todayStr = new Date().toISOString().split("T")[0];
        const upcoming = appointments
          .filter(
            (a) =>
              (a.status === "booked" || a.status === "arrived") &&
              a.date >= todayStr,
          )
          .sort(
            (a, b) =>
              a.date.localeCompare(b.date) ||
              a.slotTime.localeCompare(b.slotTime),
          )[0];

        if (!upcoming) return;

        const dismissed = localStorage.getItem(
          DISMISS_KEY_PREFIX + upcoming._id,
        );
        if (dismissed) return;

        setAppointment(upcoming);
        setVisible(true);
      } catch {
        // fail silently — banner just won't show if appointments can't load
      }
    };
    loadUpcomingAppointment();
  }, []);

  const handleDismiss = (e) => {
    e.stopPropagation();
    if (appointment) {
      localStorage.setItem(DISMISS_KEY_PREFIX + appointment._id, "1");
    }
    setVisible(false);
  };

  const handleStart = async () => {
    if (!appointment) return;
    setStarting(true);
    setError("");
    try {
      navigate("/kiosk/start", {
        state: {
          patientId: user?._id,
          appointmentId: appointment._id,
          language: "hi-IN",
          mode: "standard",
        },
      });
      //navigate(`/kiosk/${res.data.sessionId}/converse`);
    } catch (err) {
      const errorMessage =
        err.response?.data?.errors?.join(", ") ||
        err.response?.data?.message ||
        "Couldn't start check-in. Please try again.";
      setError(errorMessage);
    } finally {
      setStarting(false);
    }
  };

  if (!visible || !appointment) return null;

  return (
    <div className="kab-banner">
      <button
        className="kab-close-btn"
        onClick={handleDismiss}
        aria-label="Dismiss"
      >
        <CloseIcon fontSize="small" />
      </button>

      <div className="kab-content">
        <div className="kab-icon-wrap">
          <MicNoneIcon fontSize="medium" />
        </div>
        <div className="kab-text">
          <p className="kab-title">Appointment booked</p>
          <p className="kab-subtitle">
            Complete your pre-visit check-in before you're called
          </p>
        </div>
      </div>

      {error && <div className="pn-error kab-error">{error}</div>}

      <button className="kab-cta-btn" onClick={handleStart} disabled={starting}>
        {starting ? (
          <CircularProgress size={18} sx={{ color: "#ffffff" }} />
        ) : (
          "Start Check-in"
        )}
      </button>
    </div>
  );
}
