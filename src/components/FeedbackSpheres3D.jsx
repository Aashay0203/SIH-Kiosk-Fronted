import React from "react";
import { playTap, playSuccess } from "../utils/audioFX";
import { fireCelebrationConfetti } from "../utils/confettiFX";
import "./FeedbackSpheres3D.css";

const RATINGS = [
  { emoji: "😞", label: "Very Bad", color: "#f43f5e" },
  { emoji: "😐", label: "Poor", color: "#fb923c" },
  { emoji: "🙂", label: "Good", color: "#fbbf24" },
  { emoji: "😄", label: "Great", color: "#38bdf8" },
  { emoji: "🤩", label: "Loved It", color: "#10b981" },
];

export default function FeedbackSpheres3D({ selectedRating, onSelectRating }) {
  const handleClick = (index) => {
    playTap();
    if (index >= 3) {
      playSuccess();
      fireCelebrationConfetti();
    }
    onSelectRating?.(index);
  };

  return (
    <div className="feedback-spheres-3d-wrap">
      <p className="spheres-label">Select Your Kiosk Experience Rating</p>
      <div className="spheres-row">
        {RATINGS.map((item, idx) => {
          const isSelected = selectedRating === idx;
          return (
            <button
              key={idx}
              className={`sphere-3d-btn ${isSelected ? "selected" : ""}`}
              style={{
                borderColor: isSelected ? item.color : "var(--border)",
                boxShadow: isSelected ? `0 0 24px ${item.color}44` : "none",
              }}
              onClick={() => handleClick(idx)}
              title={item.label}
            >
              <span className="sphere-emoji">{item.emoji}</span>
              <span className="sphere-text">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
