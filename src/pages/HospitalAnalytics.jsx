import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HospitalAnalytics.css";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SpeedIcon from "@mui/icons-material/Speed";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import TranslateIcon from "@mui/icons-material/Translate";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function HospitalAnalytics() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("today"); // 'today', 'week', 'month'

  const stats = {
    patientsProcessed: 482,
    avgIntakeSeconds: 46,
    consultationTimeSavedPercent: 74.2,
    redFlagsIntercepted: 23,
    documentsDigitized: 319,
    ayushIntakes: 84,
  };

  const languageBreakdown = [
    { lang: "Hindi (हिंदी)", count: 260, percent: 54, color: "#2563eb" },
    { lang: "Tamil (தமிழ்)", count: 77, percent: 16, color: "#16a34a" },
    { lang: "Bengali (বাংলা)", count: 58, percent: 12, color: "#9333ea" },
    { lang: "Marathi (मराठी)", count: 48, percent: 10, color: "#ea580c" },
    { lang: "English (Indian)", count: 39, percent: 8, color: "#0284c7" },
  ];

  const departmentLoads = [
    { name: "General Medicine", count: 184, waitTime: "4 mins", status: "Optimal" },
    { name: "Cardiology (Triage Fast-Track)", count: 46, waitTime: "0 mins", status: "Priority Bypass" },
    { name: "Orthopedics", count: 92, waitTime: "8 mins", status: "Moderate" },
    { name: "AYUSH / Ayurvedic OPD", count: 84, waitTime: "5 mins", status: "Optimal" },
    { name: "Pediatrics", count: 76, waitTime: "6 mins", status: "Optimal" },
  ];

  return (
    <div className="analytics-page">
      {/* Top Header */}
      <header className="analytics-header">
        <div className="header-brand">
          <button type="button" className="btn-back-home" onClick={() => navigate(-1)}>
            <ArrowBackIcon /> Back
          </button>
          <div>
            <h1>📊 Hospital OPD Superintendent & SIH Impact Console</h1>
            <p>Live Patient Intake Velocity, Triage Safety & Resource Optimization Dashboard</p>
          </div>
        </div>

        <div className="analytics-controls">
          <div className="time-filter-pills">
            {["today", "week", "month"].map((r) => (
              <button
                key={r}
                type="button"
                className={`filter-pill ${timeRange === r ? "active" : ""}`}
                onClick={() => setTimeRange(r)}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          <button type="button" className="btn-refresh-stats" onClick={() => window.location.reload()}>
            <RefreshIcon sx={{ fontSize: 18 }} /> Live Sync
          </button>
        </div>
      </header>

      {/* Main KPI Stats Grid */}
      <div className="kpi-grid">
        {/* KPI 1: Consultation Time Saved */}
        <div className="kpi-card kpi--hero">
          <div className="kpi-icon-wrap bg--green">
            <SpeedIcon sx={{ fontSize: 32, color: "#16a34a" }} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">OPD Consultation Time Saved</span>
            <h2 className="kpi-value text--green">{stats.consultationTimeSavedPercent}%</h2>
            <span className="kpi-sub">Reduced from 4.2 min to 46s per patient intake</span>
          </div>
        </div>

        {/* KPI 2: Avg Kiosk Intake Time */}
        <div className="kpi-card">
          <div className="kpi-icon-wrap bg--blue">
            <AccessTimeIcon sx={{ fontSize: 32, color: "#2563eb" }} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Average Kiosk Intake Speed</span>
            <h2 className="kpi-value text--blue">{stats.avgIntakeSeconds} sec</h2>
            <span className="kpi-sub">Voice + Touch AI automated history</span>
          </div>
        </div>

        {/* KPI 3: Red Flags Intercepted */}
        <div className="kpi-card">
          <div className="kpi-icon-wrap bg--red">
            <WarningAmberIcon sx={{ fontSize: 32, color: "#dc2626" }} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Critical Red-Flags Intercepted</span>
            <h2 className="kpi-value text--red">{stats.redFlagsIntercepted} Emergencies</h2>
            <span className="kpi-sub">0-second immediate ER fast-track routing</span>
          </div>
        </div>

        {/* KPI 4: Digitized Medical Documents */}
        <div className="kpi-card">
          <div className="kpi-icon-wrap bg--purple">
            <DocumentScannerIcon sx={{ fontSize: 32, color: "#9333ea" }} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Prescriptions & Labs Digitized</span>
            <h2 className="kpi-value text--purple">{stats.documentsDigitized} Papers</h2>
            <span className="kpi-sub">OCR extracted & timeline organized</span>
          </div>
        </div>
      </div>

      {/* Analytics Main Sections */}
      <div className="analytics-layout-grid">
        {/* Section 1: Departmental Load & Wait Times */}
        <div className="analytics-card">
          <div className="card-title-row">
            <LocalHospitalIcon sx={{ color: "#2563eb" }} />
            <h3>🏥 Department Load & Throughput Velocity</h3>
          </div>

          <div className="dept-table-wrapper">
            <table className="dept-table">
              <thead>
                <tr>
                  <th>Department / OPD</th>
                  <th>Patients Checked-In</th>
                  <th>Avg Queue Wait</th>
                  <th>Triage Status</th>
                </tr>
              </thead>
              <tbody>
                {departmentLoads.map((dept, i) => (
                  <tr key={i}>
                    <td><strong>{dept.name}</strong></td>
                    <td>{dept.count}</td>
                    <td>{dept.waitTime}</td>
                    <td>
                      <span className={`status-badge badge--${dept.status.toLowerCase().replace(/\s+/g, "-")}`}>
                        {dept.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Regional Language Diversity (Bhashini AI Impact) */}
        <div className="analytics-card">
          <div className="card-title-row">
            <TranslateIcon sx={{ color: "#16a34a" }} />
            <h3>🌐 Digital India Bhashini Multilingual Adoption</h3>
          </div>

          <p className="card-desc">Patient language breakdown across Voice & Touch kiosk intakes:</p>

          <div className="lang-bar-list">
            {languageBreakdown.map((item, i) => (
              <div key={i} className="lang-bar-item">
                <div className="lang-info-row">
                  <span className="lang-name">{item.lang}</span>
                  <span className="lang-count">{item.count} Patients ({item.percent}%)</span>
                </div>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
