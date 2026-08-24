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
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const res = await instance.get("/appointments/my-appointements");
        if (res.data?.appointments && Array.isArray(res.data.appointments)) {
          setMyAppointments(res.data.appointments);
        } else if (Array.isArray(res.data)) {
          setMyAppointments(res.data);
        }
      } catch (err) {
        console.error("Error loading appointments", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const getSafeDateStr = (dateVal) => {
    if (!dateVal) return "";
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return "";
      return d.toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];

  const filterBySearch = (list) =>
    list.filter((a) => {
      const name = a?.doctorId?.name || a?.doctorName || "";
      const spec = a?.doctorId?.specialization || a?.doctorId?.speciality || "";
      const q = search.toLowerCase();
      return name.toLowerCase().includes(q) || spec.toLowerCase().includes(q);
    });

  const upcoming = filterBySearch(
    myAppointments.filter((a) => {
      const dateStr = getSafeDateStr(a?.date || a?.createdAt);
      return !dateStr || dateStr >= todayStr;
    })
  );

  const past = filterBySearch(
    myAppointments.filter((a) => {
      const dateStr = getSafeDateStr(a?.date || a?.createdAt);
      return dateStr && dateStr < todayStr;
    })
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
      </div>

      {/* ── Tabs & Content ── */}
      <div className="my-appointment-content">
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
                upcoming.map((a, idx) => (
                  <AppointmentCard key={a._id || idx} appointment={a} />
                ))
              )}
            </TabPanel>

            <TabPanel value="2" sx={{ p: 0 }}>
              {past.length === 0 ? (
                <EmptyState label="past" />
              ) : (
                past.map((a, idx) => (
                  <AppointmentCard key={a._id || idx} appointment={a} />
                ))
              )}
            </TabPanel>
          </Box>
        </TabContext>
      </div>
    </div>
  );
}
