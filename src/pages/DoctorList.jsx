// === DoctorList.jsx ===
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import { IconButton } from "@mui/material";
import instance from "../api/axios";
import DoctorCard from "../components/DoctorCard";
import { useLanguage } from "../context/LanguageContext";
import "./DoctorList.css";

// ── Skeleton Card ──────────────────────────────────────────
function DoctorCardSkeleton() {
  return (
    <div className="dl-skeleton-card" aria-hidden="true">
      <div className="dl-skeleton-card__top">
        <div className="dl-skeleton dl-skeleton--avatar" />
        <div className="dl-skeleton-card__info">
          <div className="dl-skeleton dl-skeleton--name" />
          <div className="dl-skeleton dl-skeleton--spec" />
          <div className="dl-skeleton dl-skeleton--price" />
        </div>
      </div>
      <div className="dl-skeleton-card__vitals">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="dl-skeleton dl-skeleton--vital" />
        ))}
      </div>
      <div className="dl-skeleton dl-skeleton--btn" />
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────
export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await instance.get("/doctors/allDoctors");
      setDoctors(res.data.allDoctors);
    } catch {
      setError("Failed to load doctors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = (Array.isArray(doctors) ? doctors : []).filter((doc) => {
    const name = (doc?.name || "").toLowerCase();
    const spec = (doc?.speciality || doc?.specialization || "").toLowerCase();
    const q = searchTerm.toLowerCase();
    return name.includes(q) || spec.includes(q);
  });

  const hasSearch = searchTerm.trim().length > 0;

  return (
    <div className="dl-page">
      {/* ── Top Header ── */}
      <div className="dl-header-wrap">
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

        <div style={{ padding: "0 12px 10px" }}>
          <p className="greeting-text">
            <GroupsRoundedIcon sx={{ fontSize: 15, verticalAlign: "middle", mr: 0.5, color: "var(--blue)" }} />
            DelhiMed Healthcare Network
          </p>
          <h1 className="page-title">{t("allDoctors", "All Doctors")}</h1>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="dl-search-wrap">
        <div className="dl-search-box" role="search">
          <SearchIcon
            className="dl-search-icon"
            fontSize="small"
            aria-hidden="true"
          />
          <input
            ref={searchRef}
            type="search"
            className="dl-search-input"
            placeholder={t("searchDoctorPlaceholder", "Search doctor by name or speciality...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search doctors"
          />
          {hasSearch && (
            <button
              className="dl-search-clear"
              onClick={() => {
                setSearchTerm("");
                searchRef.current?.focus();
              }}
              aria-label="Clear search"
            >
              <CloseIcon fontSize="small" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <main className="dl-content" aria-live="polite">
        {/* Error State */}
        {error && !loading && (
          <div className="dl-state-screen" role="alert">
            <span className="dl-state-emoji" role="img" aria-label="Error">
              😓
            </span>
            <h2 className="dl-state-title">Something went wrong</h2>
            <p className="dl-state-body">{error}</p>
            <button className="dl-retry-btn" onClick={fetchDoctors}>
              {t("refresh", "Try Again")}
            </button>
          </div>
        )}

        {/* Loading State — Skeletons */}
        {loading && (
          <div
            className="dl-grid"
            aria-label="Loading doctors"
            aria-busy="true"
          >
            {[...Array(6)].map((_, i) => (
              <DoctorCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Results */}
        {!loading && !error && filteredDoctors.length > 0 && (
          <>
            {hasSearch && (
              <p className="dl-results-count" aria-live="assertive">
                {filteredDoctors.length} {t("allDoctors", "Doctors")}
              </p>
            )}
            <div className="dl-grid" role="list" aria-label="Doctor list">
              {filteredDoctors.map((doctor) => (
                <div key={doctor._id} role="listitem">
                  <DoctorCard
                    doctor={doctor}
                    onBook={() => navigate(`/booking/${doctor._id}`)}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && !error && filteredDoctors.length === 0 && (
          <div className="dl-state-screen">
            <span className="dl-state-emoji" role="img" aria-label="Not found">
              🔍
            </span>
            <h2 className="dl-state-title">{t("noDoctorsFound", "No doctors found")}</h2>
            <p className="dl-state-body">
              No results for &ldquo;<strong>{searchTerm}</strong>&rdquo;. Try a
              different name or speciality.
            </p>
            <button className="dl-retry-btn" onClick={() => setSearchTerm("")}>
              {t("clearForm", "Clear Search")}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
