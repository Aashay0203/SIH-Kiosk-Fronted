import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DoctorCard from "../components/DoctorCard";
import instance from "../api/axios";
import Box from "@mui/material/Box";
import "./Home.css";
import MedicationBox from "../components/MedicationBox";
import UpcomingAppBox from "../components/UpcomingApp";

function Home() {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (doctors.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % doctors.length;
        scrollRef.current?.scrollTo({
          left: next * scrollRef.current.offsetWidth,
          behavior: "smooth",
        });
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [doctors]);

  const fetchDoctors = async () => {
    try {
      const res = await instance.get("/doctors/allDoctors");
      setDoctors(res.data.allDoctors);
    } catch (err) {
      setError("Failed to load doctors. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-root">
      <div className="home-content">
        <div className="home-hero">
          <h1 className="home-hero-heading">
            Find the Perfect Doctor for{" "}
            <span className="home-hero-blue">Your Needs</span>
          </h1>
        </div>

        {/* 🏥 MediKiosk Quick-Launch Banner */}
        <div
          onClick={() => navigate("/kiosk/intake")}
          style={{
            background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
            borderRadius: "18px",
            padding: "1.25rem 1.5rem",
            color: "#ffffff",
            margin: "1rem 0 1.5rem 0",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 10px 25px rgba(15, 23, 42, 0.18)",
            border: "1px solid #334155",
            transition: "transform 0.2s",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
              <span style={{ background: "#2563eb", padding: "0.2rem 0.6rem", borderRadius: "12px", fontSize: "0.75rem", fontWeight: 800 }}>
                AI KIOSK MODE
              </span>
              <span style={{ color: "#94a3b8", fontSize: "0.8rem", fontWeight: 600 }}>DPDP & ABDM Compliant</span>
            </div>
            <h3 style={{ margin: "0.2rem 0", fontSize: "1.15rem", fontWeight: 800 }}>
              🎙️ Self-Service OPD Clinical Intake
            </h3>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#cbd5e1" }}>
              Record symptoms via Voice/Touch, scan prescriptions & get prioritized in OPD.
            </p>
          </div>
          <button
            type="button"
            style={{
              padding: "0.65rem 1.15rem",
              borderRadius: "12px",
              border: "none",
              background: "#2563eb",
              color: "#ffffff",
              fontWeight: 800,
              fontSize: "0.88rem",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Open Kiosk ➔
          </button>
        </div>

        {error && <p className="home-error">{error}</p>}

        {loading ? (
          <p className="home-loading">Loading...</p>
        ) : (
          <>
            <Box ref={scrollRef} className="home-doctors-row">
              {doctors.map((doctor) => (
                <Box key={doctor._id} className="home-doctor-item">
                  <DoctorCard
                    doctor={doctor}
                    onBook={() => navigate(`/booking/${doctor._id}`)}
                  />
                </Box>
              ))}
            </Box>

            <div className="home-dots">
              {doctors.map((_, i) => (
                <span
                  key={i}
                  className={`home-dot ${i === currentIndex ? "home-dot-active" : ""}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <MedicationBox />
      <UpcomingAppBox />
    </div>
  );
}

export default Home;
