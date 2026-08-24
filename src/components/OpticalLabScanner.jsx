import React, { useState } from "react";
import { Sparkles, Scan, FileText, CheckCircle2, AlertTriangle } from "lucide-react";
import { playSuccess, playTap } from "../utils/audioFX";
import "./OpticalLabScanner.css";

export default function OpticalLabScanner({ reportTitle = "Complete Blood Count (CBC)", testResults = [] }) {
  const [isScanning, setIsScanning] = useState(false);

  const defaultResults = [
    { name: "Hemoglobin", value: "14.2 g/dL", normal: "13.0 - 17.0", status: "normal" },
    { name: "WBC Count", value: "7,800 /uL", normal: "4,000 - 11,000", status: "normal" },
    { name: "Platelet Count", value: "240,000 /uL", normal: "150,000 - 450,000", status: "normal" },
    { name: "Fasting Blood Sugar", value: "94 mg/dL", normal: "70 - 99", status: "normal" },
    { name: "Serum Creatinine", value: "0.9 mg/dL", normal: "0.7 - 1.2", status: "normal" },
  ];

  const results = testResults.length > 0 ? testResults : defaultResults;

  const handleScan = () => {
    playTap();
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      playSuccess();
    }, 2400);
  };

  return (
    <div className="optical-scanner-root">
      <div className="optical-scanner-header">
        <div className="scanner-badge">
          <Sparkles size={14} className="text-sky-400" />
          <span>AI Neural Optical Analyzer</span>
        </div>
        <button
          className={`scanner-trigger-btn ${isScanning ? "scanning" : ""}`}
          onClick={handleScan}
          disabled={isScanning}
        >
          <Scan size={14} />
          <span>{isScanning ? "Scanning Matrix..." : "Deep AI Scan"}</span>
        </button>
      </div>

      <div className={`scanner-viewport ${isScanning ? "active-scan" : ""}`}>
        {/* Animated Laser Beam */}
        <div className="scanner-laser-line" />
        <div className="scanner-grid-overlay" />

        <div className="scanner-file-meta">
          <FileText size={20} className="text-sky-400" />
          <div>
            <h4 className="scanner-file-title">{reportTitle}</h4>
            <span className="scanner-file-sub">Digital ABHA Pathology Verification</span>
          </div>
        </div>

        {/* Results Stream */}
        <div className="scanner-results-list">
          {results.map((item, idx) => (
            <div key={idx} className="scanner-result-row">
              <div className="result-name-col">
                <span className="result-name">{item.name}</span>
                <span className="result-range">Ref: {item.normal}</span>
              </div>
              <div className="result-val-col">
                <span className="result-val">{item.value}</span>
                {item.status === "normal" ? (
                  <CheckCircle2 size={15} className="text-emerald-400" />
                ) : (
                  <AlertTriangle size={15} className="text-amber-400" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
