import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Avatar from "@mui/material/Avatar";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/useTheme";
import { useLanguage, LANGUAGES } from "../context/LanguageContext";
import "./Navbar.css";

function Navbar({ onAvatarClick }) {
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme, isDark } = useTheme();
  const { language, setLanguage, t, currentLangObj } = useLanguage();
  const navigate = useNavigate();

  // Language Menu Anchor
  const [langAnchorEl, setLangAnchorEl] = useState(null);
  const isLangMenuOpen = Boolean(langAnchorEl);

  const handleLangMenuOpen = (event) => {
    setLangAnchorEl(event.currentTarget);
  };

  const handleLangMenuClose = () => {
    setLangAnchorEl(null);
  };

  const handleSelectLanguage = (code) => {
    setLanguage(code);
    handleLangMenuClose();
  };

  const getInitials = (name = "") =>
    name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  const firstName = user?.name?.split(" ")[0] || "Dr";

  return (
    <Box className="navbar-root">
      <ListItem className="navbar-user-section">
        <ListItemAvatar>
          <Avatar className="navbar-avatar" onClick={onAvatarClick}>
            {getInitials(user?.name)}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={`${t("hi", "Hi")} ${firstName} 👋`}
          secondary={t("location", "New Delhi, India")}
          primaryTypographyProps={{ className: "navbar-primary-text" }}
          secondaryTypographyProps={{ className: "navbar-secondary-text" }}
        />
      </ListItem>

      <Box className="navbar-controls-group">
        {/* Language Selector Dropdown Button */}
        <button
          className="navbar-lang-pill"
          onClick={handleLangMenuOpen}
          aria-label={t("languageSelect", "Select Language")}
          title="Select Language / भाषा चुनें"
        >
          <span className="navbar-lang-flag">{currentLangObj.flag}</span>
          <span className="navbar-lang-name">{currentLangObj.nativeName}</span>
          <TranslateRoundedIcon sx={{ fontSize: 16, opacity: 0.8 }} />
        </button>

        {/* Language Selection Menu */}
        <Menu
          anchorEl={langAnchorEl}
          open={isLangMenuOpen}
          onClose={handleLangMenuClose}
          slotProps={{
            paper: {
              className: "navbar-lang-menu-paper",
              sx: {
                bgcolor: "var(--card-bg) !important",
                color: "var(--text-primary) !important",
                border: "1.5px solid var(--border) !important",
                boxShadow: "0 16px 48px rgba(0, 0, 0, 0.4) !important",
              },
            },
          }}
          PaperProps={{
            className: "navbar-lang-menu-paper",
            sx: {
              bgcolor: "var(--card-bg) !important",
              color: "var(--text-primary) !important",
              border: "1.5px solid var(--border) !important",
              boxShadow: "0 16px 48px rgba(0, 0, 0, 0.4) !important",
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <Box className="navbar-lang-menu-header">
            <TranslateRoundedIcon sx={{ fontSize: 16, color: "var(--blue)" }} />
            <span>Select Indian Language</span>
          </Box>
          {LANGUAGES.map((lang) => (
            <MenuItem
              key={lang.code}
              className={`navbar-lang-menu-item ${
                language === lang.code ? "navbar-lang-menu-item--active" : ""
              }`}
              onClick={() => handleSelectLanguage(lang.code)}
              sx={{
                color: "var(--text-primary) !important",
                "&:hover": {
                  bgcolor: "var(--blue-light) !important",
                },
                "&.navbar-lang-menu-item--active": {
                  bgcolor: "var(--blue-light) !important",
                  color: "var(--blue) !important",
                },
              }}
            >
              <span className="navbar-lang-item-flag">{lang.flag}</span>
              <div className="navbar-lang-item-labels">
                <span className="navbar-lang-item-native">
                  {lang.nativeName}
                </span>
                <span className="navbar-lang-item-english">({lang.name})</span>
              </div>
              {language === lang.code && (
                <span className="navbar-lang-item-check">✓</span>
              )}
            </MenuItem>
          ))}
        </Menu>

        {/* Theme Toggle Button (Dark / Light) */}
        <IconButton
          className="navbar-theme-btn"
          onClick={toggleTheme}
          aria-label={t("themeToggle", "Toggle Theme")}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? (
            <LightModeRoundedIcon
              sx={{ fontSize: 20, color: "#facc15", animation: "navbar-spin-in 0.3s ease" }}
            />
          ) : (
            <DarkModeRoundedIcon
              sx={{ fontSize: 20, color: "#3b82f6", animation: "navbar-spin-in 0.3s ease" }}
            />
          )}
        </IconButton>

        {/* Home Navigation Button */}
        <IconButton
          className="my-appointment-home-btn"
          onClick={() => navigate("/home")}
          aria-label={t("home", "Home")}
          title={t("home", "Home")}
        >
          <HomeOutlinedIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}

export default Navbar;
