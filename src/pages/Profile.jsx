// === Profile.jsx ===
import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  TextField,
  MenuItem,
  CircularProgress,
  Divider,
  Skeleton,
  Snackbar,
  Alert,
  Chip,
  Tooltip,
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import PersonIcon from "@mui/icons-material/Person";
import CakeIcon from "@mui/icons-material/Cake";
import WcIcon from "@mui/icons-material/Wc";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LockIcon from "@mui/icons-material/Lock";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { AuthContext } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import instance from "../api/axios";
import PatientIdCard3D from "../components/PatientIdCard3D.jsx";
import "./Profile.css";

const GENDER_OPTIONS = ["Male", "Female", "Other", "Prefer not to say"];

const formatDob = (dob) => {
  if (!dob) return "—";
  try {
    return new Date(dob).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dob;
  }
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    fontFamily: "Nunito",
    fontSize: 14,
    color: "var(--text-primary)",
    backgroundColor: "var(--card-bg-subtle)",
    "& fieldset": { borderColor: "var(--border)" },
    "&:hover fieldset": { borderColor: "var(--blue)" },
    "&.Mui-focused fieldset": { borderColor: "var(--blue)" },
  },
};

const InfoRow = ({ icon, label, value, locked, children, showDivider }) => (
  <>
    {showDivider && <Divider sx={{ my: 0.5, borderColor: "var(--border)" }} />}
    <div className="profile-info-row">
      <div className="profile-icon-box">{icon}</div>
      <div className="profile-info-row__text">
        <div className="profile-info-row__label-wrap">
          <Typography className="profile-info-label">{label}</Typography>
          {locked && <LockIcon sx={{ fontSize: 10, color: "var(--text-muted)" }} />}
        </div>
        {children || (
          <Typography
            className={`profile-info-value${!value || value === "—" ? " profile-info-value--empty" : ""}`}
          >
            {value || "—"}
          </Typography>
        )}
      </div>
    </div>
  </>
);

const Profile = () => {
  const { user: authUser } = useContext(AuthContext);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(authUser || null);
  const [healthData, setHealthData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    dob: authUser?.dob ? String(authUser.dob).split("T")[0] : "",
    gender: authUser?.gender || "",
    address: authUser?.address || "",
    abhaId: authUser?.abhaId || "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPic, setUploadingPic] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    msg: "",
    severity: "success",
  });

  useEffect(() => {
    fetchProfile();
    fetchHealth();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await instance.get("/user/profile");
      const u = res.data?.user || res.data?.profile || res.data || authUser;
      if (u) {
        setProfile(u);
        setEditForm({
          dob: u.dob ? String(u.dob).split("T")[0] : "",
          gender: u.gender || "",
          address: u.address || "",
          abhaId: u.abhaId || "",
        });
      } else if (authUser) {
        setProfile(authUser);
        setEditForm({
          dob: authUser.dob ? String(authUser.dob).split("T")[0] : "",
          gender: authUser.gender || "",
          address: authUser.address || "",
          abhaId: authUser.abhaId || "",
        });
      }
    } catch {
      if (authUser) {
        setProfile(authUser);
        setEditForm({
          dob: authUser.dob ? String(authUser.dob).split("T")[0] : "",
          gender: authUser.gender || "",
          address: authUser.address || "",
          abhaId: authUser.abhaId || "",
        });
      } else {
        setProfile({
          name: "Patient",
          phone: "Not linked",
          email: "",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchHealth = async () => {
    try {
      const res = await instance.get("/healthProfile");
      setHealthData(res.data?.profile || res.data || null);
    } catch {
      // health profile may not exist yet
    }
  };

  const showSnack = (msg, severity = "success") =>
    setSnack({ open: true, msg, severity });

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await instance.patch("/user/profile", editForm);
      setProfile(res.data.user);
      setEditMode(false);
      showSnack("Profile updated successfully!");
    } catch {
      showSnack("Save failed. Try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (profile) {
      setEditForm({
        dob: profile.dob ? profile.dob.split("T")[0] : "",
        gender: profile.gender || "",
        address: profile.address || "",
        abhaId: profile.abhaId || "",
      });
    }
    setEditMode(false);
  };

  const handlePictureUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showSnack("Image must be under 5 MB", "error");
      return;
    }
    setUploadingPic(true);
    const formData = new FormData();
    formData.append("profilePicture", file);
    try {
      const res = await instance.post("/user/profile/picture", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile((prev) => ({
        ...prev,
        profilePicture: res.data.profilePicture,
      }));
      showSnack("Photo updated!");
    } catch {
      showSnack("Upload failed. Try again.", "error");
    } finally {
      setUploadingPic(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const fieldChange = (field) => (e) =>
    setEditForm((f) => ({ ...f, [field]: e.target.value }));

  const phone = profile?.phone || profile?.mobile;

  const allergiesList = Array.isArray(healthData?.allergies)
    ? healthData.allergies
    : typeof healthData?.allergies === "string"
    ? healthData.allergies.split(",").map((s) => s.trim()).filter(Boolean)
    : Array.isArray(healthData?.userProvided?.allergies)
    ? healthData.userProvided.allergies
    : [];

  const medsList = Array.isArray(healthData?.currentMedications)
    ? healthData.currentMedications
    : typeof healthData?.currentMedications === "string"
    ? healthData.currentMedications.split(",").map((s) => s.trim()).filter(Boolean)
    : Array.isArray(healthData?.userProvided?.medications)
    ? healthData.userProvided.medications
    : [];

  const conditionsList = Array.isArray(healthData?.chronicConditions)
    ? healthData.chronicConditions
    : typeof healthData?.chronicConditions === "string"
    ? healthData.chronicConditions.split(",").map((s) => s.trim()).filter(Boolean)
    : Array.isArray(healthData?.userProvided?.conditions)
    ? healthData.userProvided.conditions
    : [];

  if (loading) {
    return (
      <div className="profile-root">
        <div className="profile-skeleton-bar">
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="text" width={90} height={22} />
        </div>
        <div className="profile-skeleton-body">
          <Skeleton
            variant="rounded"
            height={145}
            sx={{ borderRadius: "20px" }}
          />
          <Skeleton
            variant="rounded"
            height={210}
            sx={{ borderRadius: "20px" }}
          />
          <Skeleton
            variant="rounded"
            height={260}
            sx={{ borderRadius: "20px" }}
          />
          <Skeleton
            variant="rounded"
            height={180}
            sx={{ borderRadius: "20px" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="profile-root">
      {/* ════ Top Navigation Bar ════ */}
      <AppBar position="sticky" elevation={0} className="profile-appbar">
        <Toolbar className="profile-toolbar">
          <div className="profile-nav-left">
            <IconButton
              size="small"
              onClick={() => navigate(-1)}
              className="profile-back-btn"
              aria-label="Back"
            >
              <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>

            <div style={{ marginLeft: 6 }}>
              <Typography className="profile-appbar-title">
                {t("myProfiles", "My Profile")}
              </Typography>
              <Typography className="profile-appbar-sub">
                {t("manageProfile", "Manage personal & medical data")}
              </Typography>
            </div>
          </div>

          {editMode ? (
            <div className="profile-appbar-actions">
              <IconButton
                size="small"
                onClick={handleCancelEdit}
                className="profile-cancel-btn"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
              <div
                className={`profile-save-btn${saving ? " profile-save-btn--saving" : ""}`}
                onClick={!saving ? handleSave : undefined}
              >
                {saving ? (
                  <CircularProgress
                    size={14}
                    sx={{ color: "#fff" }}
                  />
                ) : (
                  <SaveIcon sx={{ fontSize: 16 }} />
                )}
                {saving ? "Saving…" : "Save"}
              </div>
            </div>
          ) : (
            <div className="profile-appbar-actions">
              <div className="profile-edit-btn" onClick={() => setEditMode(true)}>
                <EditIcon sx={{ fontSize: 15 }} />
                Edit
              </div>
            </div>
          )}
        </Toolbar>
      </AppBar>

      {/* ════ Content ════ */}
      <div className="profile-content">
        {/* ── Avatar card ── */}
        <div className="profile-section-card profile-card--green">
          <div className="profile-avatar-section">
            <div className="profile-avatar-wrap">
              <Avatar src={profile?.profilePicture} className="profile-avatar">
                {profile?.name?.charAt(0)?.toUpperCase() || "U"}
              </Avatar>
              <div
                className={`profile-camera-btn${uploadingPic ? " profile-camera-btn--uploading" : ""}`}
                onClick={() => !uploadingPic && fileInputRef.current?.click()}
              >
                {uploadingPic ? (
                  <CircularProgress size={13} sx={{ color: "#fff" }} />
                ) : (
                  <CameraAltIcon sx={{ fontSize: 13, color: "#fff" }} />
                )}
              </div>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handlePictureUpload}
              />
            </div>
            <Typography className="profile-avatar-name">
              {profile?.name || "Patient"}
            </Typography>
            <Typography className="profile-avatar-phone">{phone || "No phone linked"}</Typography>
            {profile?.patientId && (
              <Chip
                label={`ID: ${profile.patientId}`}
                size="small"
                className="profile-patient-id-chip"
              />
            )}
          </div>
        </div>

        {/* ── Patient ID Card ── */}
        <div className="profile-section-card profile-card--blue">
          <Typography className="profile-section-title">
            Patient Smart Health ID Card (3D Hologram)
          </Typography>
          <PatientIdCard3D
            user={{
              name: profile?.name,
              patientId: profile?.patientId,
              phone: phone,
            }}
            healthData={healthData}
          />
        </div>

        {/* ── Personal Information ── */}
        <div className="profile-section-card profile-card--pink">
          <Typography className="profile-section-title">
            Personal Information
          </Typography>

          <div className="profile-info-rows">
            <InfoRow
              icon={<PersonIcon sx={{ fontSize: 16 }} />}
              label="Full Name"
              value={profile?.name}
              locked
            />
            <InfoRow
              icon={<PhoneIcon sx={{ fontSize: 16 }} />}
              label="Phone"
              value={phone}
              locked
              showDivider
            />
            <InfoRow
              icon={<EmailIcon sx={{ fontSize: 16 }} />}
              label="Email"
              value={profile?.email}
              locked
              showDivider
            />

            <InfoRow
              icon={<CakeIcon sx={{ fontSize: 16 }} />}
              label="Date of Birth"
              value={formatDob(profile?.dob)}
              showDivider
            >
              {editMode && (
                <TextField
                  type="date"
                  size="small"
                  fullWidth
                  value={editForm.dob}
                  onChange={fieldChange("dob")}
                  sx={inputSx}
                  inputProps={{ max: new Date().toISOString().split("T")[0] }}
                />
              )}
            </InfoRow>

            <InfoRow
              icon={<WcIcon sx={{ fontSize: 16 }} />}
              label="Gender"
              value={profile?.gender || "—"}
              showDivider
            >
              {editMode && (
                <TextField
                  select
                  size="small"
                  fullWidth
                  value={editForm.gender}
                  onChange={fieldChange("gender")}
                  sx={inputSx}
                >
                  <MenuItem
                    value=""
                    sx={{ fontFamily: "Nunito", color: "var(--text-muted)" }}
                  >
                    Select gender
                  </MenuItem>
                  {GENDER_OPTIONS.map((opt) => (
                    <MenuItem
                      key={opt}
                      value={opt}
                      sx={{ fontFamily: "Nunito" }}
                    >
                      {opt}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            </InfoRow>

            <InfoRow
              icon={<LocationOnIcon sx={{ fontSize: 16 }} />}
              label="Address"
              value={profile?.address || "—"}
              showDivider
            >
              {editMode && (
                <TextField
                  size="small"
                  fullWidth
                  multiline
                  rows={2}
                  value={editForm.address}
                  onChange={fieldChange("address")}
                  placeholder="Your full address"
                  sx={inputSx}
                />
              )}
            </InfoRow>

            {/* ABHA ID */}
            <Divider sx={{ my: 0.5, borderColor: "var(--border)" }} />
            <div className="profile-info-row">
              <div className="profile-icon-box">
                <VerifiedUserIcon sx={{ fontSize: 16 }} />
              </div>
              <div className="profile-info-row__text">
                <div className="profile-info-row__label-wrap">
                  <Typography className="profile-info-label">
                    ABHA ID
                  </Typography>
                  <Tooltip
                    title="Ayushman Bharat Health Account — India's national digital health ID issued by NHA."
                    arrow
                    placement="top"
                  >
                    <InfoOutlinedIcon
                      sx={{ fontSize: 13, color: "var(--text-muted)", cursor: "help" }}
                    />
                  </Tooltip>
                </div>
                {editMode ? (
                  <TextField
                    size="small"
                    fullWidth
                    value={editForm.abhaId}
                    onChange={fieldChange("abhaId")}
                    placeholder="XX-XXXX-XXXX-XXXX"
                    inputProps={{ maxLength: 17 }}
                    helperText="14-digit ABHA number (optional)"
                    sx={{
                      ...inputSx,
                      "& .MuiFormHelperText-root": {
                        fontFamily: "Nunito",
                        fontSize: 11,
                        color: "var(--text-muted)",
                      },
                    }}
                  />
                ) : (
                  <div className="profile-abha-value-row">
                    <Typography
                      className="profile-info-value"
                      sx={{
                        color: profile?.abhaId ? "var(--text-primary)" : "var(--text-muted)",
                      }}
                    >
                      {profile?.abhaId || "Not linked"}
                    </Typography>
                    {profile?.abhaId && (
                      <Chip
                        label="✓ Linked"
                        size="small"
                        className="profile-abha-linked"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {editMode && (
            <Typography className="profile-locked-note">
              <LockIcon sx={{ fontSize: 11 }} />
              Name, phone, and email are managed by the clinic.
            </Typography>
          )}
        </div>

        {/* ── Health Snapshot ── */}
        <div className="profile-section-card profile-card--orange">
          <Typography className="profile-section-title">
            Health Snapshot
          </Typography>

          {healthData ? (
            <div className="profile-health-data">
              {healthData.bloodGroup && (
                <div className="profile-blood-row">
                  <div className="profile-blood-icon-box">
                    <Typography sx={{ fontSize: 20 }}>🩸</Typography>
                  </div>
                  <div>
                    <Typography className="profile-chip-group-label">
                      Blood Group
                    </Typography>
                    <Typography className="profile-blood-group-value">
                      {healthData.bloodGroup}
                    </Typography>
                  </div>
                </div>
              )}

              {allergiesList.length > 0 && (
                <div>
                  <Typography className="profile-chip-group-label">
                    ⚠️ Known Allergies
                  </Typography>
                  <div className="profile-chip-row">
                    {allergiesList.slice(0, 4).map((a, i) => (
                      <Chip
                        key={i}
                        label={typeof a === "object" ? a.name || a.label || JSON.stringify(a) : String(a)}
                        size="small"
                        className="chip-allergy"
                      />
                    ))}
                    {allergiesList.length > 4 && (
                      <Chip
                        label={`+${allergiesList.length - 4} more`}
                        size="small"
                        className="chip-more"
                      />
                    )}
                  </div>
                </div>
              )}

              {medsList.length > 0 && (
                <div>
                  <Typography className="profile-chip-group-label">
                    💊 Current Medications
                  </Typography>
                  <div className="profile-chip-row">
                    {medsList.slice(0, 3).map((m, i) => (
                      <Chip
                        key={i}
                        label={typeof m === "object" ? m.name || m.medicine || JSON.stringify(m) : String(m)}
                        size="small"
                        className="chip-medication"
                      />
                    ))}
                    {medsList.length > 3 && (
                      <Chip
                        label={`+${medsList.length - 3} more`}
                        size="small"
                        className="chip-more"
                      />
                    )}
                  </div>
                </div>
              )}

              {conditionsList.length > 0 && (
                <div>
                  <Typography className="profile-chip-group-label">
                    🫀 Chronic Conditions
                  </Typography>
                  <div className="profile-chip-row">
                    {conditionsList.slice(0, 3).map((c, i) => (
                      <Chip
                        key={i}
                        label={typeof c === "object" ? c.name || c.condition || JSON.stringify(c) : String(c)}
                        size="small"
                        className="chip-condition"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="profile-health-empty">
              <div className="profile-health-empty__icon-circle">
                <span className="profile-health-empty__emoji">🏥</span>
              </div>
              <Typography className="profile-health-empty__title">
                No health data recorded
              </Typography>
              <Typography className="profile-health-empty__sub">
                Upload medical reports to generate your AI health summary
              </Typography>
            </div>
          )}

          <div
            className="profile-health-cta"
            onClick={() => navigate("/health-profile")}
          >
            <div className="profile-health-cta__left">
              <MonitorHeartIcon className="profile-health-cta__icon" />
              <div>
                <Typography className="profile-health-cta__title">
                  View Full Health Summary
                </Typography>
                <Typography className="profile-health-cta__sub">
                  AI-generated from your uploaded reports
                </Typography>
              </div>
            </div>
            <span className="profile-health-cta__arrow">→</span>
          </div>
        </div>
      </div>

      {/* ════ Snackbar ════ */}
      <Snackbar
        open={snack.open}
        autoHideDuration={2800}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snack.severity}
          className="profile-snack-alert"
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Profile;
