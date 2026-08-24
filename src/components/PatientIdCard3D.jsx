import React, { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { playTap, playSwitch } from "../utils/audioFX";
import {
  ShieldCheck,
  RotateCw,
  QrCode,
  Heart,
  Droplets,
  Activity,
  Sparkles,
  Download,
} from "lucide-react";
import "./PatientIdCard3D.css";

export default function PatientIdCard3D({ user, healthData, onDownload }) {
  const cardRef = useRef(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  // 3D Parallax Tilt Physics Handler
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -14;
    const rotateY = ((x - centerX) / centerX) * 14;

    setRotX(rotateX);
    setRotY(rotateY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.6,
    });
  };

  const handleMouseLeave = () => {
    setRotX(0);
    setRotY(0);
    setGlarePos({ x: 50, y: 50, opacity: 0 });
  };

  const handleFlip = () => {
    playSwitch();
    setIsFlipped(!isFlipped);
  };

  const patientId = user?.patientId || `DM-${user?.phone?.slice(-5) || "88658"}`;
  const bloodGroup = healthData?.bloodGroup || user?.bloodGroup || "O+";
  const age = healthData?.age || user?.age || "24";
  const gender = healthData?.gender || user?.gender || "Male";

  return (
    <div className="id-card-3d-wrapper">
      <div className="id-card-controls">
        <button className="id-card-ctrl-btn" onClick={handleFlip} title="Flip 3D Card">
          <RotateCw size={15} />
          <span>{isFlipped ? "Show Front" : "Flip to QR Code"}</span>
        </button>

        {onDownload && (
          <button className="id-card-ctrl-btn" onClick={onDownload} title="Download ID Card">
            <Download size={15} />
            <span>Download PNG</span>
          </button>
        )}
      </div>

      <div
        className="id-card-perspective-container"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={cardRef}
          className={`id-card-3d-inner ${isFlipped ? "flipped" : ""}`}
          style={{
            transform: `rotateX(${rotX}deg) rotateY(${rotY + (isFlipped ? 180 : 0)}deg)`,
          }}
        >
          {/* ── CARD FRONT ── */}
          <div className="id-card-face id-card-front">
            {/* Holographic Sheen Layer */}
            <div
              className="id-card-hologram-glare"
              style={{
                background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.4) 0%, rgba(56,189,248,0.2) 30%, transparent 70%)`,
                opacity: glarePos.opacity,
              }}
            />

            {/* Top Header */}
            <div className="id-card-top-banner">
              <div className="id-card-brand">
                <div className="id-card-chip" />
                <div>
                  <span className="id-card-brand-name">DelhiMed</span>
                  <span className="id-card-brand-sub">Smart Health Identity</span>
                </div>
              </div>
              <div className="id-card-badge">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>ABHA Verified</span>
              </div>
            </div>

            {/* Middle Patient Info */}
            <div className="id-card-center-row">
              <div className="id-card-avatar-wrap">
                <div className="id-card-avatar">
                  {user?.name?.slice(0, 2).toUpperCase() || "DM"}
                </div>
              </div>
              <div className="id-card-patient-meta">
                <h3 className="id-card-patient-name">{user?.name || "Faizan Akhtar"}</h3>
                <p className="id-card-patient-id">{patientId}</p>
                <div className="id-card-tags">
                  <span className="id-tag">{gender}</span>
                  <span className="id-tag">{age} Yrs</span>
                  <span className="id-tag id-tag-blood">
                    <Droplets size={10} />
                    {bloodGroup}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Biometrics Row */}
            <div className="id-card-bottom-row">
              <div className="id-card-bottom-stat">
                <span className="stat-label">Emergency Contact</span>
                <span className="stat-value">{user?.phone || "+91 88658 36914"}</span>
              </div>
              <div className="id-card-bottom-stat text-right">
                <span className="stat-label">Issue Date</span>
                <span className="stat-value">2026-2030</span>
              </div>
            </div>
          </div>

          {/* ── CARD BACK (QR Code & Barcode) ── */}
          <div className="id-card-face id-card-back">
            <div className="id-card-back-header">
              <span className="text-xs font-bold text-sky-400">Scan at DelhiMed Kiosk</span>
              <Sparkles size={14} className="text-sky-400" />
            </div>

            <div className="id-card-qr-container">
              <QRCodeSVG
                value={`DELHIMED-PATIENT:${patientId}:${user?.name || "User"}`}
                size={140}
                level="H"
                bgColor="#ffffff"
                fgColor="#0b0f19"
                includeMargin
                className="id-card-qr-svg"
              />
            </div>

            <div className="id-card-barcode-wrap">
              <div className="id-card-barcode-lines"></div>
              <span className="id-card-barcode-number">{patientId}-IND-2026</span>
            </div>

            <p className="id-card-back-note">
              Instant Paperless Kiosk Check-In & AI Prescription Access
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
