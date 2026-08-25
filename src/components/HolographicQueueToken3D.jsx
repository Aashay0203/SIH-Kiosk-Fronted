import React, { useState } from "react";
import { playChime, playTap } from "../utils/audioFX";
import {
  Ticket,
  Clock,
  User,
  Volume2,
  Sparkles,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import "./HolographicQueueToken3D.css";

export default function HolographicQueueToken3D({
  tokenNumber = "12",
  currentToken = "9",
  approxWait = "15 mins",
  patientName = "Faizan Akhtar",
  doctorName = "Dr. Neha Verma",
  room = "Room 302",
  isDoctorView = false,
  onCallNext,
}) {
  const [isAlerting, setIsAlerting] = useState(false);

  const handleCall = () => {
    playChime();
    setIsAlerting(true);
    setTimeout(() => setIsAlerting(false), 2000);
    onCallNext?.();
  };

  const tokensAhead = Math.max(0, parseInt(tokenNumber) - parseInt(currentToken));

  return (
    <div className={`holo-token-3d-wrapper ${isAlerting ? "alerting" : ""}`}>
      <div className="holo-token-card">
        {/* Hologram Foil Sheen */}
        <div className="holo-token-sheen" />

        {/* Header */}
        <div className="holo-token-top">
          <div className="holo-token-brand">
            <Ticket size={16} className="text-sky-400" />
            <span>DelhiMed Priority Queue Token</span>
          </div>
          <span className="holo-token-room">{room}</span>
        </div>

        {/* Big Number Section */}
        <div className="holo-token-center">
          <span className="holo-token-label">Token Number</span>
          <div className="holo-token-digit-wrap">
            <h2 className="holo-token-digit">#{tokenNumber}</h2>
            <span className="holo-token-live-dot">● Live Kiosk</span>
          </div>
          <p className="holo-token-patient">{patientName}</p>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="holo-token-stats-grid">
          <div className="holo-token-stat-item">
            <span className="token-stat-k">Serving Now</span>
            <span className="token-stat-v token-serving-v">#{currentToken}</span>
          </div>

          <div className="holo-token-stat-item">
            <span className="token-stat-k">Tokens Ahead</span>
            <span className="token-stat-v">{tokensAhead} Patients</span>
          </div>

          <div className="holo-token-stat-item">
            <span className="token-stat-k">Approx Wait</span>
            <span className="token-stat-v">{approxWait}</span>
          </div>
        </div>

        {/* Doctor Action Button */}
        {isDoctorView ? (
          <button className="holo-token-call-btn" onClick={handleCall}>
            <Volume2 size={16} />
            <span>Call Next Patient (#{parseInt(currentToken) + 1})</span>
          </button>
        ) : (
          <div className="holo-token-patient-footer">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Please stay near the consultation door</span>
          </div>
        )}
      </div>
    </div>
  );
}
