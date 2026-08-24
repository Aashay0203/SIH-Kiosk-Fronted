import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import {
  IconButton,
  Avatar,
  Tabs,
  Tab,
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Fab,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import UploadOptionsSheet from "../components/UploadOptionSheet.jsx";
import UploadBox from "../components/UploadBox.jsx";
import DnaHelix3D from "../components/DnaHelix3D.jsx";
import "./Report.css";

function Report() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { t } = useLanguage();

  // Fetch reports on component mount
  useEffect(() => {
    fetchReport(1);
  }, []);

  // Fetch reports from backend
  const fetchReport = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await instance.get(`/reports?page=${pageNum}&limit=10`);
      const newReports = response.data.data || [];
      const pagination = response.data.pagination;

      if (pageNum === 1) {
        setReports(newReports);
      } else {
        setReports((prev) => [...prev, ...newReports]);
      }

      if (pagination && pageNum >= pagination.totalPages) {
        setHasMore(false);
      } else if (newReports.length < 10) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchReport(nextPage);
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // Filter reports based on tab and search query
  const getFilteredReports = () => {
    let filtered = reports;

    // Filter by tab
    if (selectedTab === 1) {
      filtered = filtered.filter((r) => r.uploadedBy === "Doctor");
    } else if (selectedTab === 2) {
      filtered = filtered.filter((r) => r.uploadedBy === "Me");
    } else if (selectedTab === 3) {
      filtered = filtered.filter((r) => r.uploadedBy === "Lab");
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (r) =>
          r.fileName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.reportType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.doctorClinicName?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return filtered;
  };

  const handleFileSelect = (file) => {
    navigate("/reports/upload", { state: { file } });
  };

  const filteredReports = getFilteredReports();

  const handleOptionSelect = (type) => {
    if (type === "files") {
      navigate("/reports/upload");
    } else if (type === "gallery") {
      navigate("/reports/upload", { state: { accept: "image/*" } });
    } else if (type === "camera") {
      navigate("/reports/upload", {
        state: { accept: "image/*", capture: "camera" },
      });
    }
  };

  return (
    <div className="report-page">
      {/* 3D Holographic Genomics Header */}
      <DnaHelix3D />

      {/* Tabs Section */}
      <Box sx={{ borderBottom: 1, borderColor: "var(--border)", px: 2, bgcolor: "var(--bg)" }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 700,
              fontSize: "14px",
              fontFamily: "Nunito, sans-serif",
              minWidth: "auto",
              px: 2,
              color: "var(--text-secondary)",
              transition: "color 0.2s ease",
              "&.Mui-selected": {
                color: "var(--blue)",
              },
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "var(--blue)",
              height: "3px",
              borderRadius: "3px 3px 0 0",
            },
          }}
        >
          <Tab label={t("all", "All")} />
          <Tab label="Added by Doctor" />
          <Tab label="Added by You" />
          <Tab label="Lab Reports" />
        </Tabs>
      </Box>

      {/* Content Section */}
      <Box sx={{ p: 2 }}>
        {loading ? (
          <div className="loading-state">
            <Typography sx={{ color: "var(--text-muted)", fontFamily: "Nunito" }}>{t("loading", "Loading reports...")}</Typography>
          </div>
        ) : (
          /* Reports List - SHOW WHEN REPORTS EXIST */
          <>
            {/* Search Bar + FAB */}
            <Box sx={{ display: "flex", gap: 1.5, mb: 2.5, alignItems: "center" }}>
              <TextField
                fullWidth
                placeholder={t("searchDoctorPlaceholder", "Search records...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ bgcolor: "transparent", color: "var(--text-muted)" }}>
                      <SearchIcon sx={{ color: "var(--text-muted)", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "14px",
                    bgcolor: "var(--card-bg)",
                    color: "var(--text-primary)",
                    fontFamily: "Nunito",
                    fontSize: "14px",
                    fontWeight: 600,
                    "& fieldset": { borderColor: "var(--border)" },
                    "&:hover fieldset": { borderColor: "var(--blue)" },
                    "&.Mui-focused fieldset": { borderColor: "var(--blue)", borderWidth: "1.5px" },
                  },
                }}
              />
              <Fab
                color="primary"
                size="medium"
                onClick={() => setShowUploadOptions(true)}
                aria-label="Upload Record"
                sx={{
                  bgcolor: "var(--blue)",
                  color: "#ffffff",
                  flexShrink: 0,
                  boxShadow: "0 4px 14px rgba(59, 130, 246, 0.35)",
                  "&:hover": { bgcolor: "var(--blue-dark)" },
                }}
              >
                <AddIcon />
              </Fab>
            </Box>

            {/* Report Cards */}
            <div className="reports-container">
              {filteredReports.map((report, index) => (
                <Card
                  key={report._id}
                  className="report-card"
                  onClick={() => {
                    navigate(`/reports/${report._id}`);
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      py: 2,
                      "&:last-child": { pb: 2 },
                    }}
                  >
                    <Box className="report-icon-container">
                      <DescriptionOutlinedIcon
                        sx={{ fontSize: 26, color: "var(--blue)" }}
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: "var(--text-primary)", fontFamily: "Urbanist, sans-serif", fontSize: "16px" }}>
                        {report.reportType || report.fileName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "var(--text-muted)", fontFamily: "Nunito", fontSize: "12px" }}>
                        {report.doctorClinicName || "DelhiMed Clinic"} •{" "}
                        {new Date(report.uploadedAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </div>

            {hasMore && filteredReports.length > 0 && !searchQuery && (
              <button
                className="load-more-btn"
                onClick={loadMore}
                disabled={loading}
              >
                {loading ? t("loading", "Loading...") : t("loadMore", "Load More")}
              </button>
            )}
          </>
        )}
        {!searchQuery && (
          <UploadBox onUploadClick={() => setShowUploadOptions(true)} />
        )}
      </Box>

      {/* Upload Options Bottom Sheet */}
      <UploadOptionsSheet
        open={showUploadOptions}
        onClose={() => setShowUploadOptions(false)}
        onSelect={handleOptionSelect}
      />
    </div>
  );
}

export default Report;
