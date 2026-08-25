import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import HomeIcon from "@mui/icons-material/Home";
import api from "../../api/axios";
import "./KioskDocUpload.css";

export default function KioskDocUpload() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [docs, setDocs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const tempId = `temp-${Date.now()}`;
    setDocs((prev) => [
      ...prev,
      { id: tempId, name: file.name, status: "processing" },
    ]);
    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("document", file);

      await api.post(`/kiosk/${sessionId}/upload-doc`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setDocs((prev) =>
        prev.map((d) => (d.id === tempId ? { ...d, status: "saved" } : d)),
      );
    } catch (err) {
      const errorMessage =
        err.response?.data?.errors?.join(", ") ||
        err.response?.data?.message ||
        "Couldn't digitize that document. Please try again.";
      setError(errorMessage);
      setDocs((prev) => prev.filter((d) => d.id !== tempId));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="mk-docs-root">
      <div className="mk-docs-container">
        <div className="pn-top-nav">
          <button className="pn-nav-btn" onClick={() => navigate(-1)}>
            <ArrowBackIosNewIcon fontSize="small" /> Back
          </button>
          <button className="pn-nav-btn" onClick={() => navigate("/home")}>
            <HomeIcon fontSize="small" /> Home
          </button>
        </div>

        <div className="mk-docs-header">
          <h1 className="mk-docs-title">Upload your documents</h1>
          <p className="mk-docs-subtitle">
            Prior prescriptions, lab reports, or discharge summaries — we'll
            digitize and organize them for your doctor.
          </p>
        </div>

        <div
          className="mk-docs-dropzone"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="mk-docs-dropzone-icon">
            <CloudUploadIcon fontSize="medium" />
          </div>
          <p className="mk-docs-dropzone-text">Tap to upload or take a photo</p>
          <p className="mk-docs-dropzone-hint">JPG, PNG, or PDF</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          capture="environment"
          hidden
          onChange={handleFileSelect}
        />

        {error && <div className="pn-error">{error}</div>}

        {docs.length > 0 && (
          <div className="mk-docs-list">
            {docs.map((d) => (
              <div key={d.id} className="mk-docs-item">
                <div className="mk-docs-item-top">
                  <p className="mk-docs-item-name">{d.name}</p>
                  {d.status === "processing" ? (
                    <span className="mk-docs-status-chip processing">
                      <CircularProgress
                        size={10}
                        sx={{ color: "var(--blue-dark)", marginRight: "4px" }}
                      />
                      Uploading
                    </span>
                  ) : (
                    <span className="mk-docs-status-chip done">
                      Saved to your health record
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          className="mk-docs-skip-link"
          onClick={() => navigate(`/kiosk/${sessionId}/summary`)}
        >
          I don't have documents to upload
        </button>

        <button
          className="mk-docs-continue-btn"
          onClick={() => navigate(`/kiosk/${sessionId}/summary`)}
          disabled={uploading}
        >
          Continue to Summary
        </button>
      </div>
    </div>
  );
}
