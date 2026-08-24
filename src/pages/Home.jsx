import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DoctorCard from "../components/DoctorCard";
import instance from "../api/axios";
import Box from "@mui/material/Box";
import "./Home.css";
import MedicationBox from "../components/MedicationBox";
import UpcomingAppBox from "../components/UpcomingApp";
import { useLanguage } from "../context/LanguageContext";
import { playTap } from "../utils/audioFX";
import MedicalCoreOrb3D from "../components/MedicalCoreOrb3D";
import {
  Sparkles,
  HeartPulse,
  Stethoscope,
  Activity,
  ShieldCheck,
  Zap,
  Mic,
  Search,
} from "lucide-react";

const QUICK_CATEGORIES = [
  { id: "all", label: "All Specialists", icon: Stethoscope },
  { id: "cardio", label: "Cardiologist", icon: HeartPulse },
  { id: "general", label: "Physician", icon: Activity },
  { id: "derma", label: "Dermatologist", icon: Sparkles },
];

function Home() {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState("all");
  const { t } = useLanguage();

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
    }, 4000);
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

  const filteredDoctors = doctors.filter((doc) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "cardio")
      return doc.speciality?.toLowerCase().includes("cardio") || doc.speciality?.toLowerCase().includes("heart");
    if (activeCategory === "derma")
      return doc.speciality?.toLowerCase().includes("derma") || doc.speciality?.toLowerCase().includes("skin");
    if (activeCategory === "general")
      return doc.speciality?.toLowerCase().includes("general") || doc.speciality?.toLowerCase().includes("physician");
    return true;
  });

  return (
    <motion.div
      className="home-root"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="home-content">
        {/* Hero Section */}
        <motion.div
          className="home-hero"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <MedicalCoreOrb3D />

          <div className="home-hero-badge">
            <ShieldCheck size={14} className="text-sky-400" />
            <span>AI-Assisted Kiosk Health Network</span>
          </div>

          <h1 className="home-hero-heading">
            {t("findDoctorHero", "Find the Perfect Doctor for")}{" "}
            <span className="home-hero-blue">{t("forYourNeeds", "Your Needs")}</span>
          </h1>

          <p className="home-hero-sub">
            Instant paperless token allocation, live clinic queue telemetry & AI health record integration.
          </p>

          {/* Quick Categories */}
          <div className="home-quick-categories">
            {QUICK_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  className={`home-cat-chip ${isActive ? "active" : ""}`}
                  onClick={() => {
                    playTap();
                    setActiveCategory(cat.id);
                  }}
                >
                  <Icon size={14} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {error && <p className="home-error">{error}</p>}

        {loading ? (
          <p className="home-loading">{t("loading", "Loading...")}</p>
        ) : (
          <>
            <Box ref={scrollRef} className="home-doctors-row">
              <AnimatePresence>
                {filteredDoctors.map((doctor, idx) => (
                  <motion.div
                    key={doctor._id}
                    className="home-doctor-item"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                  >
                    <DoctorCard
                      doctor={doctor}
                      onBook={() => {
                        playTap();
                        navigate(`/booking/${doctor._id}`);
                      }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </Box>

            <div className="home-dots">
              {filteredDoctors.map((_, i) => (
                <span
                  key={i}
                  className={`home-dot ${i === currentIndex ? "home-dot-active" : ""}`}
                  onClick={() => {
                    playTap();
                    setCurrentIndex(i);
                    scrollRef.current?.scrollTo({
                      left: i * scrollRef.current.offsetWidth,
                      behavior: "smooth",
                    });
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <MedicationBox />
      <UpcomingAppBox />
    </motion.div>
  );
}

export default Home;
