import React from "react";
import "./DoctorCard.css";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function DoctorCard({ doctor, onBook }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  return (
    <div className="premium-doc-card">
      {/* Top Section with Text and Absolute Image */}
      <div className="card-top-section">
        <div className="text-content">
          <div className="speciality-badge">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
              <path d="M12 5.5v5"></path>
              <path d="M9.5 8h5"></path>
            </svg>
            {/* Dynamic Speciality */}
            <span>{doctor?.speciality || "Specialist"}</span>
          </div>
          {/* Dynamic Name */}
          <h2 className="doc-title">{doctor?.name}</h2>
        </div>

        {/* The Blue Blob and Image */}
        <div className="image-wrapper">
          <div className="blue-blob"></div>
          <img
            src="https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/45.png"
            alt={`${doctor?.name}`}
            className="doc-avatar"
          />
        </div>
      </div>

      {/* Bottom Frosted Glass Section */}
      <div className="card-glass-bottom">
        <div className="schedule-row">
          <div className="datetime-info">
            <div className="info-line">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>{doctor?.startTime || "9:00"} AM</span>
            </div>
            <div className="info-line">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>{t("fee", "Fee")}: ₹{doctor?.fees || "500"}</span>
            </div>
          </div>

          <button className="arrow-btn" onClick={onBook} aria-label="Book">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </button>
        </div>

        <div className="action-buttons">
          <button 
            className="btn-cancel" 
            onClick={() => navigate(`/doctor-profile/${doctor._id}`, { state: { doctor } })}
          >
            {t("myProfiles", "Profile")}
          </button>
          <button className="btn-book" onClick={onBook}>
            {t("bookNow", "Book Now")}
          </button>
        </div>
      </div>
    </div>
  );
}
