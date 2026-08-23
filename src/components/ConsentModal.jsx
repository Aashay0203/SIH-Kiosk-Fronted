import React, { useState } from "react";
import "./ConsentModal.css";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import StopIcon from "@mui/icons-material/Stop";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ShieldIcon from "@mui/icons-material/Shield";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AbhaScanShare from "./AbhaScanShare";

export default function ConsentModal({ isOpen, onClose, onAccept, initialAbha = "" }) {
  const [abhaId, setAbhaId] = useState(initialAbha);
  const [lang, setLang] = useState("hi");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [hasAgreed, setHasAgreed] = useState(false);
  const [showScanShare, setShowScanShare] = useState(false);

  if (!isOpen) return null;

  const hindiText = "नमस्ते। डिजिटल पर्सनल डेटा प्रोटेक्शन एक्ट 2023 और आयुष्मान भारत डिजिटल मिशन के तहत, आपके इलाज को बेहतर बनाने के लिए आपकी सहमति से आपकी स्वास्थ्य जानकारी, लक्षण और पुरानी पर्चियों को सुरक्षित रूप से रिकॉर्ड किया जा रहा है। यह डेटा केवल आपके डॉक्टर के परामर्श के लिए उपयोग होगा।";
  const englishText = "Hello. In accordance with the Digital Personal Data Protection Act 2023 and Ayushman Bharat Digital Mission (ABDM), with your consent, your symptoms, medical history, and past prescriptions are securely recorded to assist your doctor. This data is strictly used for clinical consultation.";

  const toggleAudio = () => {
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const textToSpeak = lang === "hi" ? hindiText : englishText;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = lang === "hi" ? "hi-IN" : "en-IN";
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleConfirm = () => {
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
    }
    onAccept({
      abhaId: abhaId.trim() || `ABHA-${Math.floor(10000000000000 + Math.random() * 90000000000000)}`,
      consentGranted: true,
      consentTimestamp: new Date(),
      language: lang,
    });
  };

  return (
    <div className="consent-modal-overlay">
      <div className="consent-modal-container">
        <div className="consent-header">
          <div className="consent-header-icon">
            <ShieldIcon sx={{ fontSize: 32, color: "#2563eb" }} />
          </div>
          <div>
            <h3>DPDP Act 2023 & ABDM Patient Consent</h3>
            <p className="consent-subtitle">डिजिटल स्वास्थ्य सहमति / Patient Privacy & Data Authorization</p>
          </div>
        </div>

        {/* Language selector & Audio assist */}
        <div className="consent-lang-bar">
          <div className="consent-lang-pills">
            <button
              type="button"
              className={`lang-btn ${lang === "hi" ? "active" : ""}`}
              onClick={() => {
                setLang("hi");
                if (isPlayingAudio) window.speechSynthesis.cancel();
                setIsPlayingAudio(false);
              }}
            >
              🇮🇳 हिंदी (Hindi)
            </button>
            <button
              type="button"
              className={`lang-btn ${lang === "en" ? "active" : ""}`}
              onClick={() => {
                setLang("en");
                if (isPlayingAudio) window.speechSynthesis.cancel();
                setIsPlayingAudio(false);
              }}
            >
              🌐 English
            </button>
          </div>

          <button
            type="button"
            className={`audio-listen-btn ${isPlayingAudio ? "playing" : ""}`}
            onClick={toggleAudio}
          >
            {isPlayingAudio ? <StopIcon sx={{ fontSize: 20 }} /> : <VolumeUpIcon sx={{ fontSize: 20 }} />}
            {isPlayingAudio ? "Stop Audio" : "Listen / सुनें"}
          </button>
        </div>

        {/* Consent Body */}
        <div className="consent-body-box">
          <p className="consent-statement">
            {lang === "hi" ? hindiText : englishText}
          </p>

          <div className="consent-features-list">
            <div className="feature-item">
              <CheckCircleIcon sx={{ fontSize: 18, color: "#16a34a" }} />
              <span>{lang === "hi" ? "अस्पताल में डॉक्टर के साथ सुरक्षित साझाकरण" : "Encrypted sharing with hospital consulting physician"}</span>
            </div>
            <div className="feature-item">
              <CheckCircleIcon sx={{ fontSize: 18, color: "#16a34a" }} />
              <span>{lang === "hi" ? "परामर्श के बाद अस्थायी सत्र डेटा साफ़ किया जाएगा" : "Temporary kiosk session cleared upon submission"}</span>
            </div>
            <div className="feature-item">
              <CheckCircleIcon sx={{ fontSize: 18, color: "#16a34a" }} />
              <span>{lang === "hi" ? "आयुष्मान भारत हेल्थ अकाउंट (ABHA) अनुरूप" : "Compliant with Ayushman Bharat Digital Mission (ABDM)"}</span>
            </div>
          </div>
        </div>

        {/* ABHA Input & Scan & Share */}
        <div className="consent-abha-section">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
            <label htmlFor="abha-input" style={{ margin: 0 }}>
              <VerifiedUserIcon sx={{ fontSize: 20, color: "#0284c7", verticalAlign: "middle", mr: 0.5 }} />
              ABHA Number / ABHA ID (Optional):
            </label>
            <button
              type="button"
              onClick={() => setShowScanShare(true)}
              style={{
                background: "#f0fdf4",
                border: "1px solid #86efac",
                color: "#166534",
                padding: "0.25rem 0.65rem",
                borderRadius: "8px",
                fontSize: "0.78rem",
                fontWeight: 800,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              📲 ABDM "Scan & Share"
            </button>
          </div>
          <input
            id="abha-input"
            type="text"
            placeholder="e.g. 91-1234-5678-9012 or user@abdm"
            value={abhaId}
            onChange={(e) => setAbhaId(e.target.value)}
            className="consent-input"
          />
        </div>

        <AbhaScanShare
          isOpen={showScanShare}
          onClose={() => setShowScanShare(false)}
          onVerified={(patientData) => {
            setAbhaId(patientData.abhaId);
            setHasAgreed(true);
          }}
        />

        {/* Checkbox agreement */}
        <label className="consent-checkbox-label">
          <input
            type="checkbox"
            checked={hasAgreed}
            onChange={(e) => setHasAgreed(e.target.checked)}
          />
          <span>
            {lang === "hi"
              ? "मैं अपनी नैदानिक जानकारी और दस्तावेज़ डिजिटल रूप से रिकॉर्ड करने की सहमति देता/देती हूँ।"
              : "I explicitly grant consent to capture my clinical symptoms and digitize medical records for this consultation."}
          </span>
        </label>

        {/* Actions */}
        <div className="consent-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>
            {lang === "hi" ? "रद्द करें / Cancel" : "Cancel"}
          </button>
          <button
            type="button"
            className="btn-proceed"
            disabled={!hasAgreed}
            onClick={handleConfirm}
          >
            {lang === "hi" ? "स्वीकार करें और आगे बढ़ें" : "I Agree & Proceed"}
          </button>
        </div>
      </div>
    </div>
  );
}
