import React from "react";
import { Box, Typography, Button } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import "./UploadBox.css";
import { useLanguage } from "../context/LanguageContext";

function UploadBox({ onUploadClick }) {
  const { t } = useLanguage();

  return (
    <Box className="empty-state-container">
      <Box className="illustration-box">
        <Typography className="illustration-emoji">📋</Typography>
      </Box>

      <Typography variant="h6" className="empty-state-heading">
        {t("medicalRecordsHeadline", "All your medical records in one place")}
      </Typography>

      <Box className="benefits-list">
        <Box className="benefit-item">
          <CheckCircleOutlineIcon className="benefit-icon" />
          <Typography variant="body2" className="benefit-text">
            {t("benefitNeverLose", "Never lose your medical records")}
          </Typography>
        </Box>

        <Box className="benefit-item">
          <CheckCircleOutlineIcon className="benefit-icon" />
          <Typography variant="body2" className="benefit-text">
            {t("benefitShareDoctor", "Share your medical records with doctors")}
          </Typography>
        </Box>

        <Box className="benefit-item">
          <CheckCircleOutlineIcon className="benefit-icon" />
          <Typography variant="body2" className="benefit-text">
            {t("benefitAccessAnywhere", "Access prescriptions, reports and more, on the go")}
          </Typography>
        </Box>
      </Box>

      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={onUploadClick}
        className="add-record-button"
      >
        {t("uploadReport", "Add Medical Record")}
      </Button>
    </Box>
  );
}

export default UploadBox;
