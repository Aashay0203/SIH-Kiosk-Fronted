import React, { useEffect, useState } from "react";
import "./AarogyaAvatar.css";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import MicIcon from "@mui/icons-material/Mic";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";

export default function AarogyaAvatar({
  state = "idle", // 'idle' | 'speaking' | 'listening' | 'alert'
  currentSpeechText = "",
  selectedLang = "hi",
  onReplayAudio,
  avatarName = "Sister Asha (Aarogya Mitra)",
}) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    if (state === "listening") {
      const interval = setInterval(() => {
        setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
      }, 400);
      return () => clearInterval(interval);
    }
  }, [state]);

  return (
    <div className={`avatar-container state--${state}`}>
      {/* Speech / Subtitle Bubble */}
      <div className="avatar-speech-bubble">
        <div className="bubble-header">
          <span className="avatar-title-badge">
            <span className="live-pulse-dot" />
            {avatarName}
          </span>

          {onReplayAudio && (
            <button
              type="button"
              className="bubble-replay-btn"
              onClick={onReplayAudio}
              title="Replay Voice Prompt / आवाज़ दोबारा सुनें"
            >
              <VolumeUpIcon sx={{ fontSize: 16 }} />
              <span>Replay Audio</span>
            </button>
          )}
        </div>

        <p className="bubble-text">
          {state === "listening" ? (
            <span className="listening-prompt">
              <MicIcon sx={{ fontSize: 18, mr: 0.5, verticalAlign: "middle" }} />
              Listening to you carefully{dots} (कृपया बोलें)
            </span>
          ) : (
            currentSpeechText || "नमस्ते! मैं आरोग्य मित्र हूँ। आपकी क्या सहायता करूँ?"
          )}
        </p>

        {/* Live Audio Waveform Bars (When Speaking or Listening) */}
        {(state === "speaking" || state === "listening") && (
          <div className="avatar-waveform">
            <span className="bar bar-1" />
            <span className="bar bar-2" />
            <span className="bar bar-3" />
            <span className="bar bar-4" />
            <span className="bar bar-5" />
            <span className="bar bar-6" />
            <span className="bar bar-7" />
          </div>
        )}
      </div>

      {/* Interactive Animated SVG Avatar */}
      <div className="avatar-graphic-wrapper">
        <div className="avatar-aura" />
        <svg
          className="avatar-svg"
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background circle gradient */}
          <circle cx="80" cy="80" r="76" fill="url(#avatarBgGrad)" />
          <circle cx="80" cy="80" r="76" stroke="#ffffff" strokeWidth="4" />

          {/* Nurse Uniform / Torso */}
          <path
            d="M32 154C32 120 54 112 80 112C106 112 128 120 128 154"
            fill="#2563eb"
          />
          {/* Stethoscope */}
          <path
            d="M62 116C62 132 98 132 98 116"
            stroke="#94a3b8"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="80" cy="136" r="5" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
          <path d="M80 131V124" stroke="#94a3b8" strokeWidth="2.5" />

          {/* Neck */}
          <rect x="72" y="98" width="16" height="18" rx="4" fill="#fcd34d" />

          {/* Head & Face */}
          <circle cx="80" cy="74" r="32" fill="#fed7aa" />

          {/* Hair */}
          <path
            d="M48 68C48 48 60 40 80 40C100 40 112 48 112 68C112 76 108 84 108 84C108 84 100 70 80 70C60 70 52 84 52 84C52 84 48 76 48 68Z"
            fill="#1e293b"
          />

          {/* Medical Nurse Cap */}
          <path
            d="M56 42C56 32 66 28 80 28C94 28 104 32 104 42L98 48H62L56 42Z"
            fill="#ffffff"
            stroke="#e2e8f0"
            strokeWidth="1.5"
          />
          {/* Red Cross on Cap */}
          <path d="M80 32V40M76 36H84" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />

          {/* Eyes (Blinking animation) */}
          <g className="avatar-eyes">
            <ellipse cx="68" cy="72" rx="3.5" ry="4.5" fill="#1e293b" />
            <ellipse cx="92" cy="72" rx="3.5" ry="4.5" fill="#1e293b" />
            <circle cx="69" cy="70.5" r="1.2" fill="#ffffff" />
            <circle cx="93" cy="70.5" r="1.2" fill="#ffffff" />
          </g>

          {/* Cheerful Eyebrows */}
          <path d="M63 64C66 62 72 63 74 65" stroke="#334155" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M97 64C94 62 88 63 86 65" stroke="#334155" strokeWidth="1.8" strokeLinecap="round" />

          {/* Friendly Bindi (Traditional Indian Healthcare Touch) */}
          <circle cx="80" cy="62" r="1.6" fill="#dc2626" />

          {/* Nose */}
          <path d="M80 74V79H82" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />

          {/* Mouth (Lip-sync state animation) */}
          <g className="avatar-mouth">
            {state === "speaking" ? (
              <ellipse cx="80" cy="88" rx="6" ry="4.5" fill="#b91c1c" className="mouth-speaking" />
            ) : state === "listening" ? (
              <path d="M74 88C76 91 84 91 86 88" stroke="#b91c1c" strokeWidth="2.5" strokeLinecap="round" />
            ) : (
              <path d="M74 86C76 90 84 90 86 86" stroke="#b91c1c" strokeWidth="2.5" strokeLinecap="round" />
            )}
          </g>

          <defs>
            <linearGradient id="avatarBgGrad" x1="16" y1="16" x2="144" y2="144" gradientUnits="userSpaceOnUse">
              <stop stopColor="#dbeafe" />
              <stop offset="1" stopColor="#bfdbfe" />
            </linearGradient>
          </defs>
        </svg>

        {/* State Badge Icon */}
        <div className={`avatar-status-badge badge--${state}`}>
          {state === "speaking" && <VolumeUpIcon sx={{ fontSize: 16 }} />}
          {state === "listening" && <MicIcon sx={{ fontSize: 16 }} />}
          {state === "alert" && <WarningAmberIcon sx={{ fontSize: 16 }} />}
          {state === "idle" && <GraphicEqIcon sx={{ fontSize: 16 }} />}
        </div>
      </div>
    </div>
  );
}
