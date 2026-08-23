import React, { useState } from "react";
import "./FhirViewerModal.css";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import VerifiedIcon from "@mui/icons-material/Verified";
import { downloadFhirJson } from "../utils/fhirService";

export default function FhirViewerModal({ isOpen, onClose, fhirBundle }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !fhirBundle) return null;

  const jsonString = JSON.stringify(fhirBundle, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fhir-modal-overlay">
      <div className="fhir-modal-container">
        {/* Header */}
        <div className="fhir-modal-header">
          <div className="fhir-header-title">
            <VerifiedIcon sx={{ fontSize: 28, color: "#16a34a" }} />
            <div>
              <h3>ABDM HL7 FHIR R4 Clinical Record</h3>
              <p>National Digital Health Mission (NDHM) Compliant Document Bundle</p>
            </div>
          </div>

          <button type="button" className="btn-close-fhir" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        {/* Info Badges */}
        <div className="fhir-badges-bar">
          <span className="fhir-badge badge--green">✓ FHIR Release 4</span>
          <span className="fhir-badge badge--blue">Profile: NRCES DocumentBundle</span>
          <span className="fhir-badge badge--purple">LOINC & SNOMED CT Coded</span>
          <span className="fhir-badge badge--amber">Bundle ID: {fhirBundle.id}</span>
        </div>

        {/* Syntax-highlighted JSON Codebox */}
        <div className="fhir-code-box">
          <pre>{jsonString}</pre>
        </div>

        {/* Actions */}
        <div className="fhir-actions-row">
          <button type="button" className="btn-fhir-copy" onClick={handleCopy}>
            {copied ? <CheckIcon sx={{ fontSize: 18 }} /> : <ContentCopyIcon sx={{ fontSize: 18 }} />}
            {copied ? "Copied to Clipboard!" : "Copy FHIR JSON"}
          </button>

          <button
            type="button"
            className="btn-fhir-download"
            onClick={() => downloadFhirJson(fhirBundle, `ABDM_${fhirBundle.id}.json`)}
          >
            <DownloadIcon sx={{ fontSize: 18 }} />
            Download .json Bundle
          </button>
        </div>
      </div>
    </div>
  );
}
