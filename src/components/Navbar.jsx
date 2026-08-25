import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/useTheme";
import { useLanguage, LANGUAGES } from "../context/LanguageContext";
import { playTap, playSwitch } from "../utils/audioFX";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
  Search,
  Mic,
  Sun,
  Moon,
  Home,
  Globe,
  Sparkles,
} from "lucide-react";
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
    playTap();
    setLangAnchorEl(event.currentTarget);
  };

  const handleLangMenuClose = () => {
    setLangAnchorEl(null);
  };

  const handleSelectLanguage = (code) => {
    playTap();
    setLanguage(code);
    handleLangMenuClose();
  };

  const handleOpenCmd = () => {
    playTap();
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  };

  const handleOpenVoice = () => {
    playTap();
    window.dispatchEvent(new CustomEvent("open-voice-assistant"));
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
        {/* Spotlight Command Search Button */}
        <button
          className="navbar-cmd-btn"
          onClick={handleOpenCmd}
          aria-label="Open Command Menu"
          title="Search or Jump to Any Page (Cmd+K)"
        >
          <Search size={15} />
          <span className="navbar-cmd-label">Search...</span>
          <kbd className="navbar-cmd-kbd">⌘K</kbd>
        </button>

        {/* AI Voice Assistant Mic Button */}
        <button
          className="navbar-voice-btn"
          onClick={handleOpenVoice}
          aria-label="AI Voice Assistant"
          title="Speak Symptoms in 10 Languages"
        >
          <Mic size={16} />
          <span className="navbar-voice-pulse" />
        </button>

        {/* Language Selector Dropdown Button */}
        <button
          className="navbar-lang-pill"
          onClick={handleLangMenuOpen}
          aria-label={t("languageSelect", "Select Language")}
          title="Select Language / भाषा चुनें"
        >
          <span className="navbar-lang-flag">{currentLangObj.flag}</span>
          <span className="navbar-lang-name">{currentLangObj.nativeName}</span>
          <Globe size={14} className="opacity-70" />
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
            <Sparkles size={14} className="text-sky-400" />
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
        <button
          className="navbar-theme-btn"
          onClick={() => {
            playSwitch();
            toggleTheme();
          }}
          aria-label={t("themeToggle", "Toggle Theme")}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? (
            <Sun size={18} className="text-amber-400 animate-spin-once" />
          ) : (
            <Moon size={18} className="text-sky-500 animate-spin-once" />
          )}
        </button>

        {/* Home Navigation Button */}
        <button
          className="my-appointment-home-btn"
          onClick={() => {
            playTap();
            navigate("/home");
          }}
          aria-label={t("home", "Home")}
          title={t("home", "Home")}
        >
          <Home size={18} />
        </button>
      </Box>
    </Box>
  );
}

export default Navbar;
