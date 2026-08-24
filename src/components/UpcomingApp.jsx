import React, { useEffect, useState } from "react";
import instance from "../api/axios";
import Box from "@mui/material/Box";
import AppointmentCard from "./AppointmentCard";
import "./UpcomingApp.css";
import { useLanguage } from "../context/LanguageContext";

function UpcomingAppBox() {
  const [myAppointments, setMyAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { t } = useLanguage();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await instance.get("/appointments/my-appointements");
        if (res.data?.appointments && Array.isArray(res.data.appointments)) {
          setMyAppointments(res.data.appointments);
        } else if (Array.isArray(res.data)) {
          setMyAppointments(res.data);
        } else {
          setMyAppointments([]);
        }
      } catch (err) {
        setError("Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = (Array.isArray(myAppointments) ? myAppointments : []).filter((a) => {
    if (!a?.date) return false;
    const d = new Date(a.date);
    if (isNaN(d.getTime())) return false;
    d.setHours(0, 0, 0, 0);
    return d >= today && (a.status === "booked" || a.status === "served");
  });

  if (loading) return <p style={{ padding: "16px", color: "var(--text-muted)" }}>{t("loading", "Loading...")}</p>;
  if (error) return <p style={{ padding: "16px", color: "var(--error-text)" }}>{error}</p>;

  return (
    <Box className="upcoming-box">
      <div className="upcoming-box-header">
        <h3 className="upcoming-box-title">{t("upcomingAppointments", "Upcoming Appointments")}</h3>
      </div>
      {upcoming.length === 0 ? (
        <p className="upcoming-empty">{t("noUpcomingAppointments", "No upcoming appointments")}</p>
      ) : (
        upcoming.map((a) => <AppointmentCard key={a._id} appointment={a} />)
      )}
    </Box>
  );
}

export default UpcomingAppBox;
