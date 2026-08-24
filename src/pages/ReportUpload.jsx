import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../api/axios";
import { useLanguage } from "../context/LanguageContext";
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  IconButton,
  CircularProgress,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import "./ReportUpload.css";

const REPORT_TYPES = [
  "Blood Test / CBC",
  "Lipid Profile",
  "Liver Function Test (LFT)",
  "Kidney Function Test (KFT)",
  "Thyroid Profile (T3, T4, TSH)",
  "HbA1c / Diabetes",
  "Urine Routine",
  "X-Ray / Radiology",
  "ECG / Cardiology",
  "Prescription",
  "Other",
];

function ReportUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [reportType, setReportType] = useState("");
  const [doctorClinicName, setDoctorClinicName] = useState("");
  const [notes, setNotes] = useState("");
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type (PDF, PNG, JPG, JPEG)
      const validTypes = [
        "application/pdf",
        "image/png",
        "image/jpeg",
        "image/jpg",
      ];
      if (!validTypes.includes(file.type)) {
        alert("Please upload a PDF or Image (PNG, JPG)");
        return;
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please select a file to upload");
      return;
    }

    if (!reportType) {
      alert("Please select a report type");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("report", selectedFile);
      formData.append("reportType", reportType);
      formData.append("doctorClinicName", doctorClinicName);
      formData.append("notes", notes);

      const response = await instance.post("/reports/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload successful:", response.data);

      navigate(`/reports/${response.data.data._id}`);
    } catch (error) {
      console.error("Upload failed:", error);
      alert(error.response?.data?.message || "Failed to upload report");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container maxWidth="sm" className="report-upload-page">
      {/* Header */}
      <Box className="upload-header">
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            bgcolor: "var(--card-bg-subtle)",
            color: "var(--text-primary)",
            "&:hover": { bgcolor: "var(--border)" },
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="h6" fontWeight={700} sx={{ fontFamily: "Urbanist, sans-serif", color: "var(--text-primary)" }}>
          {t("uploadReport", "Upload Report")}
        </Typography>
        <Box sx={{ width: 40 }} />
      </Box>

      {/* Upload Form */}
      <Box component="form" onSubmit={handleSubmit} className="upload-form">
        {/* File Selection */}
        <Box className="file-upload-section">
          <input
            type="file"
            id="report-file-input"
            accept=".pdf,image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <label htmlFor="report-file-input">
            <Box className="file-upload-area">
              {selectedFile ? (
                <Box className="file-selected">
                  <CheckCircleIcon sx={{ fontSize: 48, color: "var(--green)", mb: 1 }} />
                  <Typography variant="body1" fontWeight={600} sx={{ color: "var(--text-primary)" }}>
                    {selectedFile.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "var(--text-muted)" }}>
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Click to change
                  </Typography>
                </Box>
              ) : (
                <Box className="file-not-selected">
                  <CloudUploadOutlinedIcon sx={{ fontSize: 48, color: "var(--blue)", mb: 1 }} />
                  <Typography variant="body1" fontWeight={600} sx={{ color: "var(--text-primary)" }}>
                    Click to upload report
                  </Typography>
                  <Typography variant="caption" sx={{ color: "var(--text-muted)" }}>
                    PDF, PNG, JPG up to 10MB
                  </Typography>
                </Box>
              )}
            </Box>
          </label>
        </Box>

        {/* Report Type */}
        <TextField
          select
          fullWidth
          label="Report Type"
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          required
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              bgcolor: "var(--card-bg-subtle)",
              color: "var(--text-primary)",
              "& fieldset": { borderColor: "var(--border)" },
            },
          }}
        >
          {REPORT_TYPES.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>

        {/* Doctor/Clinic Name */}
        <TextField
          fullWidth
          label="Doctor or Clinic Name (Optional)"
          value={doctorClinicName}
          onChange={(e) => setDoctorClinicName(e.target.value)}
          placeholder="e.g. Dr. Sharma, Max Hospital"
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              bgcolor: "var(--card-bg-subtle)",
              color: "var(--text-primary)",
              "& fieldset": { borderColor: "var(--border)" },
            },
          }}
        />

        {/* Notes */}
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Notes (Optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any specific symptoms or reasons for this test"
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              bgcolor: "var(--card-bg-subtle)",
              color: "var(--text-primary)",
              "& fieldset": { borderColor: "var(--border)" },
            },
          }}
        />

        {/* Submit Button */}
        <Button
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          disabled={uploading || !selectedFile}
          sx={{
            bgcolor: "var(--blue)",
            color: "#fff",
            borderRadius: "12px",
            py: 1.5,
            textTransform: "none",
            fontWeight: 800,
            fontSize: "16px",
            "&:hover": { bgcolor: "var(--blue-dark)" },
            "&:disabled": { opacity: 0.5 },
          }}
        >
          {uploading ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={20} sx={{ color: "#fff" }} />
              <span>Uploading & Analyzing...</span>
            </Box>
          ) : (
            t("uploadReport", "Upload Report")
          )}
        </Button>
      </Box>
    </Container>
  );
}

export default ReportUpload;
