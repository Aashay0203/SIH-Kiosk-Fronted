import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyAppointment.css";
import instance from "../api/axios";
import { useLanguage } from "../context/LanguageContext";

import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AppointmentCard from "../components/AppointmentCard";

// ─── EmptyState ───────────────────────────────────────────────────────────────

function EmptyState({ label }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">📭</div>
      <Typography className="empty-state-title">
        No {label} appointments found
      </Typography>
    </div>
  );
}

// ─── MyAppointment (Page) ─────────────────────────────────────────────────────

export default function MyAppointment() {
  const [myAppointments, setMyAppointments] = useState([]);
  const [value, setValue] = useState("1");
  const [search, setSearch] = useState("");
  const { t } = useLanguage();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await instance.get("/appointments/my-appointements");
        if (res.data?.appointments) {
          setMyAppointments(res.data.appointments);
        }
      } catch (err) {
        console.error("Error loading appointments", err);
      }
    };
    fetchAppointments();
  }, []);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  // ── Filter by date ──
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filterBySearch = (list) =>
    list.filter((a) =>
      a.doctorId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.doctorId?.specialization?.toLowerCase().includes(search.toLowerCase())
    );

  const upcoming = filterBySearch(
    myAppointments.filter((a) => {
      const appointmentDateStr = new Date(a.date).toISOString().split("T")[0];
      const todayStr = new Date().toISOString().split("T")[0];
      return appointmentDateStr >= todayStr;
    }),
  );

  const past = filterBySearch(
    myAppointments.filter((a) => {
      const appointmentDateStr = new Date(a.date).toISOString().split("T")[0];
      const todayStr = new Date().toISOString().split("T")[0];
      return appointmentDateStr < todayStr;
    }),
  );

  return (
    <div className="my-appointment-page">
      {/* ── Sticky Header ── */}
      <div className="my-appointment-header">
        <div className="my-appointment-top-nav">
          <IconButton
            className="my-appointment-back-btn"
            onClick={() => navigate(-1)}
            aria-label="Back"
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>

          <IconButton
            className="my-appointment-home-btn"
            onClick={() => navigate("/home")}
            aria-label="Home"
          >
            <HomeOutlinedIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <p className="greeting-text">
            <CalendarMonthRoundedIcon sx={{ fontSize: 14, verticalAlign: "middle", mr: 0.5, color: "var(--blue)" }} />
            DelhiMed Healthcare
          </p>
          <h1 className="page-title">{t("myAppointments", "My Appointments")}</h1>
        </div>

        {/* ── Search ── */}
        <div className="search-wrapper">
          <TextField
            placeholder="Search by doctor or speciality..."
            size="small"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: "var(--text-muted)" }} />
                </InputAdornment>
              ),
            }}
          />
        </div>

        {/* ── Tabs ── */}
        <TabContext value={value}>
          <TabList onChange={handleTabChange} className="appointment-tabs">
            <Tab
              label={`${t("upcoming", "Upcoming")} (${upcoming.length})`}
              value="1"
              className="appointment-tab"
            />
            <Tab
              label={`${t("past", "Past")} (${past.length})`}
              value="2"
              className="appointment-tab"
            />
          </TabList>

          {/* ── Panels ── */}
          <Box className="tab-panel-content">
            <TabPanel value="1" sx={{ p: 0 }}>
              {upcoming.length === 0 ? (
                <EmptyState label="upcoming" />
              ) : (
                upcoming.map((a) => (
                  <AppointmentCard key={a._id} appointment={a} />
                ))
              )}
            </TabPanel>

            <TabPanel value="2" sx={{ p: 0 }}>
              {past.length === 0 ? (
                <EmptyState label="past" />
              ) : (
                past.map((a) => <AppointmentCard key={a._id} appointment={a} />)
              )}
            </TabPanel>
          </Box>
        </TabContext>
      </div>
    </div>
  );
}
