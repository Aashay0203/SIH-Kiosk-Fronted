// === DoctorList.jsx ===
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import instance from "../api/axios";
import DoctorCard from "../components/DoctorCard";
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

  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.speciality.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const hasSearch = searchTerm.trim().length > 0;

  return (
    <div className="dl-page">
      <div className="fb-header">
        <div>
          <h1 className="fb-title">All Doctors</h1>
          <p className="fb-subtitle">Your voice shapes DelhiMed 🚀</p>
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
            placeholder="Search by name or speciality…"
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
              Try Again
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
                {filteredDoctors.length} result
                {filteredDoctors.length !== 1 ? "s" : ""} for &ldquo;
                {searchTerm}&rdquo;
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
            <h2 className="dl-state-title">No doctors found</h2>
            <p className="dl-state-body">
              No results for &ldquo;<strong>{searchTerm}</strong>&rdquo;. Try a
              different name or speciality.
            </p>
            <button className="dl-retry-btn" onClick={() => setSearchTerm("")}>
              Clear Search
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
