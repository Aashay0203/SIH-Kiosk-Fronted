import { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Skeleton from "@mui/material/Skeleton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import StarIcon from "@mui/icons-material/Star";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TimerIcon from "@mui/icons-material/Timer";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import VerifiedIcon from "@mui/icons-material/Verified";
import SchoolIcon from "@mui/icons-material/School";
import "./DoctorProfile.css";

function useCountUp(target, duration = 1500) {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    if (!target || target <= 0) {
      return;
    }

    const easeOutQuad = (t) => t * (2 - t);

    const animate = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuad(progress);

      setCount(Math.round(eased * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startRef.current = null;
    };
  }, [target, duration]);

  return count;
}

export default function DoctorProfile() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(location.state?.doctor || null);
  const [loading, setLoading] = useState(!location.state?.doctor);

  useEffect(() => {
    axios
      .get(`/doctors/${id}/profile`)
      .then((res) => {
        setDoctor(res.data.doctor);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const patientsCount = useCountUp(doctor?.totalPatientsSeen || 0, 1500);

  if (loading) {
    return (
      <div className="dp-page">
        <div className="dp-container">
          <div className="dp-loading">
            <Skeleton
              variant="rounded"
              height={200}
              sx={{ borderRadius: "24px" }}
            />
            <Skeleton
              variant="rounded"
              height={260}
              sx={{ borderRadius: "24px" }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="dp-page">
        <div className="dp-container">
          <div className="dp-error">
            <p className="dp-error-text">Doctor not found</p>
            <button className="dp-error-btn" onClick={() => navigate(-1)}>
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const embedUrl = doctor.introVideoUrl
    ? doctor.introVideoUrl
        .replace("watch?v=", "embed/")
        .replace("youtu.be/", "youtube.com/embed/")
    : "";

  const firstName = doctor.name ? doctor.name.split(" ")[0] : "";

  const mapSrc = doctor.clinicAddress
    ? `https://maps.google.com/maps?q=${encodeURIComponent(doctor.clinicName + ", " + doctor.clinicAddress)}&output=embed`
    : null;

  const directionsUrl = doctor.clinicAddress
    ? `https://maps.google.com/?q=${encodeURIComponent(doctor.clinicName + ", " + doctor.clinicAddress)}`
    : null;

  return (
    <div className="dp-page">
      <div className="dp-container">
        {/* Hero Card */}
        <div className="dp-hero dp-animate dp-animate-delay-1">
          <div className="dp-hero-top">
            {doctor.profilePicture ? (
              <img
                className="dp-hero-photo"
                src={doctor.profilePicture}
                alt={doctor.name}
              />
            ) : (
              <div className="dp-hero-photo-fallback">
                <PersonIcon sx={{ fontSize: 36, color: "#3e7df5" }} />
              </div>
            )}
            <div className="dp-hero-info">
              <h1 className="dp-hero-name">{doctor.name}</h1>
              <span className="dp-hero-speciality">{doctor.speciality}</span>
              <p className="dp-hero-rating">
                ⭐ {doctor.rating || 4.5} · {doctor.reviewCount || 0} reviews
              </p>
              <p className="dp-hero-experience">
                {doctor.experience || 0} yrs experience
              </p>
            </div>
          </div>

          <div className="dp-stats">
            <div className="dp-stat">
              <div className="dp-stat-number">{patientsCount}</div>
              <div className="dp-stat-label">Patients</div>
            </div>
            <div className="dp-stat">
              <div className="dp-stat-number">{doctor.experience || 0}+</div>
              <div className="dp-stat-label">Years Exp.</div>
            </div>
            <div className="dp-stat">
              <div className="dp-stat-number">⭐ {doctor.rating || 4.5}</div>
              <div className="dp-stat-label">Rating</div>
            </div>
          </div>
        </div>

        {/* Intro Video Card */}
        {doctor.introVideoUrl && (
          <div className="dp-card dp-animate dp-animate-delay-2">
            <h2 className="dp-card-title">Meet Dr. {firstName}</h2>
            <div className="dp-video-wrap">
              <iframe
                className="dp-video-iframe"
                src={embedUrl}
                title="Doctor Introduction"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                allowFullScreen
              />
            </div>
            <p className="dp-video-verified">
              <VerifiedIcon
                sx={{
                  fontSize: 15,
                  verticalAlign: "text-bottom",
                  mr: 0.5,
                }}
              />{" "}
              Verified Doctor on ClinicFlow
            </p>
          </div>
        )}

        {/* About Card */}
        {doctor.bio && (
          <div className="dp-card dp-animate dp-animate-delay-3">
            <h2 className="dp-card-title">About</h2>
            <p className="dp-about-text">{doctor.bio}</p>
          </div>
        )}

        {/* Clinic Info Card */}
        <div className="dp-card dp-animate dp-animate-delay-4">
          <h2 className="dp-card-title">Clinic &amp; Availability</h2>

          <div className="dp-clinic-row">
            <LocalHospitalIcon
              className="dp-clinic-icon"
              sx={{ fontSize: 20 }}
            />
            <div className="dp-clinic-text">
              <p className="dp-clinic-label">Clinic</p>
              <p className="dp-clinic-value">{doctor.clinicName || "—"}</p>
            </div>
          </div>

          <div className="dp-clinic-row">
            <LocationOnIcon className="dp-clinic-icon" sx={{ fontSize: 20 }} />
            <div className="dp-clinic-text">
              <p className="dp-clinic-label">Address</p>
              <p className="dp-clinic-value">{doctor.clinicAddress || "—"}</p>
            </div>
          </div>

          <div className="dp-clinic-row">
            <ChatBubbleOutlineIcon
              className="dp-clinic-icon"
              sx={{ fontSize: 20 }}
            />
            <div className="dp-clinic-text">
              <p className="dp-clinic-label">Languages</p>
              <p className="dp-clinic-value">
                {(doctor.languages || []).join(", ") || "—"}
              </p>
            </div>
          </div>

          <div className="dp-clinic-row">
            <AccessTimeIcon className="dp-clinic-icon" sx={{ fontSize: 20 }} />
            <div className="dp-clinic-text">
              <p className="dp-clinic-label">Start Time</p>
              <p className="dp-clinic-value">{doctor.startTime || "—"}</p>
            </div>
          </div>

          <div className="dp-clinic-row">
            <TimerIcon className="dp-clinic-icon" sx={{ fontSize: 20 }} />
            <div className="dp-clinic-text">
              <p className="dp-clinic-label">Avg. Consult</p>
              <p className="dp-clinic-value">
                {doctor.avgConsultTime ? `${doctor.avgConsultTime} min` : "—"}
              </p>
            </div>
          </div>

          <div className="dp-clinic-row">
            <CalendarMonthIcon
              className="dp-clinic-icon"
              sx={{ fontSize: 20 }}
            />
            <div className="dp-clinic-text">
              <p className="dp-clinic-label">Available</p>
              <p className="dp-clinic-value">
                {(doctor.availableDays || []).join(", ") || "—"}
              </p>
            </div>
          </div>

          <div className="dp-clinic-row">
            <CurrencyRupeeIcon
              className="dp-clinic-icon"
              sx={{ fontSize: 20 }}
            />
            <div className="dp-clinic-text">
              <p className="dp-clinic-label">Fees</p>
              <p className="dp-clinic-value">₹{doctor.fees || 0}</p>
            </div>
          </div>
        </div>

        {/* Education Card */}
        {doctor.education && doctor.education.length > 0 && (
          <div className="dp-card dp-animate dp-animate-delay-5">
            <h2 className="dp-card-title">Education</h2>
            {doctor.education.map((edu, i) => (
              <div key={i}>
                <div className="dp-edu-entry">
                  <div>
                    <p className="dp-edu-degree">{edu.degree}</p>
                    <p className="dp-edu-institute">{edu.institute}</p>
                  </div>
                  <span className="dp-edu-year">{edu.year}</span>
                </div>
                {i < doctor.education.length - 1 && (
                  <hr className="dp-edu-divider" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Clinic Location Card */}
        {mapSrc ? (
          <div className="dp-card dp-map-card">
            <div className="dp-map-header">
              <LocationOnIcon sx={{ color: "var(--blue)", fontSize: 20 }} />
              <h2 className="dp-section-title">Clinic Location</h2>
            </div>
            <p className="dp-clinic-address">{doctor.clinicAddress}</p>

            <div className="dp-map-wrapper">
              <iframe
                title="Clinic Location"
                src={mapSrc}
                width="100%"
                height="220"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="dp-directions-btn"
            >
              <LocationOnIcon fontSize="small" />
              Get Directions
            </a>
          </div>
        ) : (
          <div className="dp-card dp-map-card">
            <div className="dp-map-header">
              <LocationOnIcon
                sx={{ color: "var(--text-muted)", fontSize: 20 }}
              />
              <h2 className="dp-section-title">Clinic Location</h2>
            </div>
            <p className="dp-no-address">Clinic address not available.</p>
          </div>
        )}

        {/* Book Appointment — Desktop */}
        <div className="dp-book-desktop dp-animate dp-animate-delay-6">
          <button
            className="dp-book-btn"
            onClick={() =>
              navigate(`/booking/${doctor._id}`, {
                state: { doctor },
              })
            }
          >
            Book Appointment →
          </button>
        </div>
      </div>

      {/* Book Appointment — Sticky Bottom (mobile) */}
      <div className="dp-sticky-bar">
        <button
          className="dp-book-btn"
          onClick={() =>
            navigate(`/booking/${doctor._id}`, {
              state: { doctor },
            })
          }
        >
          Book Appointment →
        </button>
      </div>
    </div>
  );
}
