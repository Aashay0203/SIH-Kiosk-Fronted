import React, { useState } from "react";
import "./AbhaScanShare.css";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import VerifiedIcon from "@mui/icons-material/Verified";
import CloseIcon from "@mui/icons-material/Close";

export default function AbhaScanShare({ isOpen, onClose, onVerified }) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [scannedPatient, setScannedPatient] = useState(null);

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const mockAbha = {
        abhaId: `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}@abdm`,
        fullName: "Adarsh Dubey",
        gender: "Male",
        dob: "1998-05-14",
        phone: "+91 9473629700",
        address: "New Delhi, Delhi - 110001",
        verifiedAt: new Date().toISOString(),
      };
      setScannedPatient(mockAbha);
      setIsSimulating(false);
    }, 1200);
  };

  const handleProceed = () => {
    if (scannedPatient && onVerified) {
      onVerified(scannedPatient);
      onClose();
    }
  };

  return (
    <div className="scan-share-overlay">
      <div className="scan-share-card">
        {/* Header */}
        <div className="scan-share-header">
          <div className="nha-brand-badge">
            <span className="nha-logo">🇮🇳 NHA / ABDM</span>
            <h3>ABDM "Scan & Share" OPD Check-In</h3>
          </div>
          <button type="button" className="btn-close-scan" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <p className="scan-share-subtitle">
          Open <strong>Aarogya Setu</strong>, <strong>ABDM App</strong>, or <strong>Paytm/Eka Care</strong> to scan and share your profile instantly.
        </p>

        {!scannedPatient ? (
          <div className="qr-container">
            {/* Visual SVG QR Code */}
            <div className="qr-frame">
              <QrCode2Icon sx={{ fontSize: 180, color: "#0f172a" }} />
              <div className="qr-scan-line" />
            </div>

            <div className="hospital-code-box">
              <span className="h-label">HOSPITAL COUNTER CODE:</span>
              <strong className="h-code">DELHI-AIIMS-OPD-01</strong>
            </div>

            {/* Live Simulation Button for Hackathon Judges */}
            <button
              type="button"
              className={`btn-simulate-scan ${isSimulating ? "simulating" : ""}`}
              onClick={handleSimulateScan}
              disabled={isSimulating}
            >
              <SmartphoneIcon sx={{ fontSize: 20 }} />
              {isSimulating ? "Simulating Patient App Scan..." : "📲 Simulate Mobile ABHA App Scan"}
            </button>
          </div>
        ) : (
          <div className="scanned-success-box">
            <div className="scanned-badge">
              <CheckCircleIcon sx={{ fontSize: 36, color: "#16a34a" }} />
              <h4>Profile Shared from ABHA App!</h4>
            </div>

            <div className="patient-abha-details">
              <div className="detail-row">
                <span>ABHA ID:</span>
                <strong className="text-blue">{scannedPatient.abhaId}</strong>
              </div>
              <div className="detail-row">
                <span>Patient Name:</span>
                <strong>{scannedPatient.fullName}</strong>
              </div>
              <div className="detail-row">
                <span>Gender / Age:</span>
                <strong>{scannedPatient.gender} (28 Yrs)</strong>
              </div>
              <div className="detail-row">
                <span>Mobile:</span>
                <strong>{scannedPatient.phone}</strong>
              </div>
            </div>

            <button type="button" className="btn-confirm-abha" onClick={handleProceed}>
              <VerifiedIcon sx={{ fontSize: 20 }} />
              Auto-Fill & Proceed to Intake
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
