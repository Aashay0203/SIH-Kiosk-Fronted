import React from "react";
import "./MedicalTimeline.css";
import DescriptionIcon from "@mui/icons-material/Description";
import MedicationIcon from "@mui/icons-material/Medication";
import ScienceIcon from "@mui/icons-material/Science";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EventNoteIcon from "@mui/icons-material/EventNote";

export default function MedicalTimeline({ reports = [], appointments = [], onSelectReport }) {
  // Merge and sort reports and encounters by date descending
  const timelineItems = [
    ...reports.map((r) => ({
      id: r._id,
      type: "report",
      title: r.testName || r.reportType || "Diagnostic Report",
      reportType: r.aiSummary?.reportTypeDetected || r.reportType || "Lab Report",
      date: r.reportDate || r.createdAt,
      doctor: r.doctorName || "Diagnostic Lab",
      hospital: r.hospitalName || "Hospital OPD",
      plainSummary: r.aiSummary?.plainSummary || [],
      hasAbnormal:
        r.aiSummary?.specialFlags?.anemia ||
        r.aiSummary?.specialFlags?.infection ||
        r.aiSummary?.specialFlags?.kidneyIssue ||
        r.aiSummary?.specialFlags?.liverIssue ||
        r.aiSummary?.specialFlags?.diabetesRisk,
      specialFlags: r.aiSummary?.specialFlags || {},
      raw: r,
    })),
    ...appointments.map((a) => ({
      id: a._id,
      type: "appointment",
      title: `Consultation with Dr. ${a.doctorId?.name || "Doctor"}`,
      date: a.date,
      doctor: a.doctorId?.name,
      speciality: a.doctorId?.speciality || "General Medicine",
      status: a.status || "Completed",
      raw: a,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (timelineItems.length === 0) {
    return (
      <div className="empty-timeline">
        <EventNoteIcon sx={{ fontSize: 48, color: "#94a3b8" }} />
        <h4>No Medical History Records Yet</h4>
        <p>Digitized prescriptions and lab reports will appear in this chronological timeline.</p>
      </div>
    );
  }

  const formatDate = (d) => {
    if (!d) return "Recent";
    const date = new Date(d);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="medical-timeline-container">
      <div className="timeline-header-row">
        <h3>📅 Chronological Medical Timeline</h3>
        <span className="timeline-badge">{timelineItems.length} Records Analyzed</span>
      </div>

      <div className="timeline-track">
        {timelineItems.map((item, index) => {
          const isReport = item.type === "report";
          return (
            <div
              key={item.id || index}
              className={`timeline-item ${isReport && item.hasAbnormal ? "item--warning" : ""}`}
              onClick={() => isReport && onSelectReport && onSelectReport(item.raw)}
            >
              {/* Timeline dot */}
              <div className="timeline-node">
                {isReport ? (
                  item.reportType === "Prescription" ? (
                    <MedicationIcon sx={{ fontSize: 18, color: "#2563eb" }} />
                  ) : (
                    <ScienceIcon sx={{ fontSize: 18, color: item.hasAbnormal ? "#dc2626" : "#0284c7" }} />
                  )
                ) : (
                  <DescriptionIcon sx={{ fontSize: 18, color: "#16a34a" }} />
                )}
              </div>

              {/* Timeline card */}
              <div className="timeline-card">
                <div className="timeline-card-header">
                  <div className="card-title-group">
                    <span className="timeline-date">{formatDate(item.date)}</span>
                    <h4 className="card-title">{item.title}</h4>
                  </div>
                  {isReport && item.hasAbnormal && (
                    <span className="flag-badge flag-badge--abnormal">
                      <WarningAmberIcon sx={{ fontSize: 14 }} /> Abnormal Labs
                    </span>
                  )}
                  {isReport && !item.hasAbnormal && (
                    <span className="flag-badge flag-badge--normal">
                      <CheckCircleOutlineIcon sx={{ fontSize: 14 }} /> Normal
                    </span>
                  )}
                </div>

                <p className="card-meta">
                  {item.doctor ? `👨‍⚕️ ${item.doctor}` : ""} {item.hospital ? `• 🏥 ${item.hospital}` : ""}
                </p>

                {/* AI Snippets */}
                {isReport && item.plainSummary && item.plainSummary.length > 0 && (
                  <div className="card-summary-points">
                    {item.plainSummary.slice(0, 2).map((point, idx) => (
                      <div key={idx} className="summary-point-pill">
                        {point}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
