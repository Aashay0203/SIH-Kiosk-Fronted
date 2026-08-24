import React, { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/useTheme";
import { useLanguage, LANGUAGES } from "../context/LanguageContext";
import { playTap, playSwitch } from "../utils/audioFX";
import {
  Search,
  Home,
  User,
  Calendar,
  Users,
  FileText,
  Heart,
  MessageSquare,
  HelpCircle,
  Sun,
  Moon,
  Globe,
  Sparkles,
  Zap,
} from "lucide-react";
import "./CommandPalette.css";

export default function CommandPalette({ open, onOpenChange }) {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [search, setSearch] = useState("");

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const down = (e) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }
        e.preventDefault();
        onOpenChange?.(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const handleSelect = (callback) => {
    playTap();
    callback();
    onOpenChange?.(false);
  };

  if (!open) return null;

  return (
    <div className="cmdk-overlay" onClick={() => onOpenChange?.(false)}>
      <div className="cmdk-dialog" onClick={(e) => e.stopPropagation()}>
        <Command label="DelhiMed Global Command Menu" loop>
          <div className="cmdk-input-wrap">
            <Search className="cmdk-search-icon" size={18} />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Type a command or search anything... (Doctors, Reports, Pages, Languages)"
              autoFocus
            />
            <kbd className="cmdk-kbd">ESC</kbd>
          </div>

          <Command.List className="cmdk-list">
            <Command.Empty className="cmdk-empty">
              <Sparkles size={24} className="cmdk-empty-icon" />
              <p>No matching commands or actions found.</p>
              <span>Try searching "Cardiologist", "Hindi", "Dark", "Reports"</span>
            </Command.Empty>

            {/* Navigation Group */}
            <Command.Group heading="Navigation">
              <Command.Item
                onSelect={() => handleSelect(() => navigate("/home"))}
                className="cmdk-item"
              >
                <Home size={16} />
                <span>{t("home", "Home")}</span>
                <span className="cmdk-shortcut">⌘H</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => navigate("/doctorList"))}
                className="cmdk-item"
              >
                <Users size={16} />
                <span>{t("allDoctors", "All Doctors & Specialists")}</span>
                <span className="cmdk-shortcut">⌘D</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => navigate("/my-appointments"))}
                className="cmdk-item"
              >
                <Calendar size={16} />
                <span>{t("myAppointments", "My Appointments & Tokens")}</span>
                <span className="cmdk-shortcut">⌘A</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => navigate("/reports"))}
                className="cmdk-item"
              >
                <FileText size={16} />
                <span>{t("yourReports", "Medical Reports & Uploads")}</span>
                <span className="cmdk-shortcut">⌘R</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => navigate("/health-profile"))}
                className="cmdk-item"
              >
                <Heart size={16} />
                <span>{t("healthProfile", "Health Profile & Telemetry")}</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => navigate("/profile"))}
                className="cmdk-item"
              >
                <User size={16} />
                <span>{t("myProfile", "Smart Health ID Card")}</span>
                <span className="cmdk-shortcut">⌘P</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => navigate("/support"))}
                className="cmdk-item"
              >
                <HelpCircle size={16} />
                <span>{t("helpAndSupport", "Help & Support Center")}</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => navigate("/give-feedback"))}
                className="cmdk-item"
              >
                <MessageSquare size={16} />
                <span>{t("giveFeedback", "Give Feedback")}</span>
              </Command.Item>
            </Command.Group>

            {/* Quick Actions & Themes */}
            <Command.Group heading="Preferences & Controls">
              <Command.Item
                onSelect={() =>
                  handleSelect(() => {
                    playSwitch();
                    toggleTheme();
                  })
                }
                className="cmdk-item"
              >
                {isDark ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-blue-500" />}
                <span>{isDark ? "Switch to Pure Clinical Light Mode" : "Switch to Cyber-MedTech Dark Mode"}</span>
                <span className="cmdk-badge">{isDark ? "Active: Dark" : "Active: Light"}</span>
              </Command.Item>
            </Command.Group>

            {/* 10 Indian Languages */}
            <Command.Group heading="Indian Regional Languages">
              {LANGUAGES.map((lang) => (
                <Command.Item
                  key={lang.code}
                  onSelect={() =>
                    handleSelect(() => {
                      setLanguage(lang.code);
                    })
                  }
                  className={`cmdk-item ${language === lang.code ? "cmdk-item--active" : ""}`}
                >
                  <span className="cmdk-flag">{lang.flag}</span>
                  <div className="cmdk-lang-labels">
                    <span className="font-bold">{lang.nativeName}</span>
                    <span className="text-xs opacity-60">({lang.name})</span>
                  </div>
                  {language === lang.code && <span className="cmdk-active-dot">● Active</span>}
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>

          <div className="cmdk-footer">
            <span>Navigation: <kbd>↑</kbd> <kbd>↓</kbd></span>
            <span>Select: <kbd>↵</kbd></span>
            <span>Close: <kbd>ESC</kbd></span>
          </div>
        </Command>
      </div>
    </div>
  );
}
