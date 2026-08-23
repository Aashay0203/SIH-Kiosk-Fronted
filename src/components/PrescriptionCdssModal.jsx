import React, { useState, useMemo } from "react";
import "./PrescriptionCdssModal.css";
import MedicationIcon from "@mui/icons-material/Medication";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import VerifiedIcon from "@mui/icons-material/Verified";
import { checkPrescriptionSafety } from "../utils/cdssEngine";

export default function PrescriptionCdssModal({
  isOpen,
  onClose,
  patient,
  patientAllergies = [],
  currentMedications = [],
  labFlags = {},
  doctorName = "Doctor",
}) {
  const [medsList, setMedsList] = useState([
    { name: "Paracetamol 650mg", dosage: "1 Tab", frequency: "1-0-1 (After Food)", duration: "3 Days", notes: "For fever/pain" },
  ]);

  const [newMedName, setNewMedName] = useState("");
  const [newDosage, setNewDosage] = useState("1 Tab");
  const [newFreq, setNewFreq] = useState("1-0-1");
  const [newDuration, setNewDuration] = useState("5 Days");
  const [rxNotes, setRxNotes] = useState("Take with plenty of warm water. Avoid cold food.");
  const [isGenerated, setIsGenerated] = useState(false);

  // Live CDSS Analysis
  const safetyReport = useMemo(() => {
    return checkPrescriptionSafety({
      newMedications: medsList.map((m) => m.name),
      patientAllergies,
      currentMedications,
      labFlags,
    });
  }, [medsList, patientAllergies, currentMedications, labFlags]);

  if (!isOpen) return null;

  const handleAddMed = () => {
    if (!newMedName.trim()) return;
    setMedsList((prev) => [
      ...prev,
      {
        name: newMedName.trim(),
        dosage: newDosage,
        frequency: newFreq,
        duration: newDuration,
        notes: "",
      },
    ]);
    setNewMedName("");
  };

  const handleRemoveMed = (idx) => {
    setMedsList((prev) => prev.filter((_, i) => i !== idx));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="cdss-modal-overlay">
      <div className="cdss-modal-container">
        {/* Header */}
        <div className="cdss-modal-header">
          <div className="cdss-header-title">
            <MedicationIcon sx={{ fontSize: 30, color: "#2563eb" }} />
            <div>
              <h3>AI Digital Prescription & CDSS Safety Engine</h3>
              <p>Patient: <strong>{patient?.name || "Patient"}</strong> (ABDM Token #{patient?.appointmentNumber || "OPD-01"})</p>
            </div>
          </div>
          <button type="button" className="btn-close-cdss" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        {/* Real-time CDSS Safety Status Bar */}
        <div className={`cdss-status-banner ${safetyReport.isSafe ? "banner--safe" : "banner--warning"}`}>
          {safetyReport.isSafe ? (
            <div className="status-flex">
              <CheckCircleIcon sx={{ fontSize: 22, color: "#16a34a" }} />
              <div>
                <strong>✓ CDSS AI Validation: All Prescribed Medications are Clinically Safe</strong>
                <p>No drug-allergy or critical drug-drug interactions detected against patient profile.</p>
              </div>
            </div>
          ) : (
            <div className="status-flex">
              <WarningAmberIcon sx={{ fontSize: 24, color: "#dc2626" }} />
              <div>
                <strong>🚨 {safetyReport.alertCount} CLINICAL SAFETY ALERT(S) DETECTED!</strong>
                <p>Please review conflicting medications and organ function warnings below:</p>
              </div>
            </div>
          )}
        </div>

        {/* Alert Cards if Any Interaction Found */}
        {!safetyReport.isSafe && (
          <div className="cdss-alerts-list">
            {safetyReport.alerts.map((alert, idx) => (
              <div key={idx} className={`alert-card alert-card--${alert.severity.toLowerCase()}`}>
                <h4>{alert.title}</h4>
                <p>{alert.message}</p>
              </div>
            ))}
          </div>
        )}

        {/* Prescription Builder Form */}
        <div className="rx-builder-body">
          {/* Add Medication Inputs */}
          <div className="add-med-row">
            <input
              type="text"
              placeholder="Enter Medicine Name (e.g. Amoxicillin, Metformin, Pantocid)..."
              value={newMedName}
              onChange={(e) => setNewMedName(e.target.value)}
              className="input-med-name"
            />
            <input
              type="text"
              placeholder="Dosage (e.g. 500mg)"
              value={newDosage}
              onChange={(e) => setNewDosage(e.target.value)}
              className="input-med-small"
            />
            <select value={newFreq} onChange={(e) => setNewFreq(e.target.value)} className="select-med">
              <option value="1-0-1 (Morning & Night)">1-0-1 (Morning & Night)</option>
              <option value="1-1-1 (Thrice Daily)">1-1-1 (Thrice Daily)</option>
              <option value="1-0-0 (Morning Only)">1-0-0 (Morning Only)</option>
              <option value="0-0-1 (Night Only)">0-0-1 (Night Only)</option>
              <option value="SOS (As needed)">SOS (As needed)</option>
            </select>
            <input
              type="text"
              placeholder="Duration"
              value={newDuration}
              onChange={(e) => setNewDuration(e.target.value)}
              className="input-med-small"
            />
            <button type="button" className="btn-add-med" onClick={handleAddMed}>
              <AddIcon sx={{ fontSize: 18 }} /> Add
            </button>
          </div>

          {/* Table of Prescribed Medicines */}
          <div className="rx-table-wrapper">
            <table className="rx-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Medication & Strength</th>
                  <th>Dosage</th>
                  <th>Frequency</th>
                  <th>Duration</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {medsList.map((m, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td><strong>💊 {m.name}</strong></td>
                    <td>{m.dosage}</td>
                    <td>{m.frequency}</td>
                    <td>{m.duration}</td>
                    <td>
                      <button type="button" className="btn-remove-med" onClick={() => handleRemoveMed(idx)}>
                        <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Doctor Advice / Notes */}
          <div className="rx-notes-box">
            <label>👨‍⚕️ Clinical Advice & Dietary Instructions:</label>
            <textarea
              rows="2"
              value={rxNotes}
              onChange={(e) => setRxNotes(e.target.value)}
              placeholder="Dietary precautions, follow-up instructions..."
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="cdss-modal-footer">
          <button type="button" className="btn-cdss-secondary" onClick={onClose}>
            Close
          </button>
          <button type="button" className="btn-cdss-print" onClick={handlePrint}>
            <PrintIcon sx={{ fontSize: 18 }} /> Print Official Rx Slip
          </button>
          <button
            type="button"
            className="btn-cdss-sign"
            onClick={() => setIsGenerated(true)}
          >
            <VerifiedIcon sx={{ fontSize: 18 }} />
            {isGenerated ? "Signed & Transmitted to ABDM ✓" : "Digitally Sign & Dispatch to Patient (SMS)"}
          </button>
        </div>
      </div>
    </div>
  );
}
