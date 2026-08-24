import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { playTap, playSuccess, playChime } from "../utils/audioFX";
import { Mic, MicOff, X, Sparkles, Volume2, ArrowRight } from "lucide-react";
import "./VoiceAssistantModal.css";

const LANG_CODE_MAP = {
  en: "en-IN",
  hi: "hi-IN",
  bn: "bn-IN",
  te: "te-IN",
  mr: "mr-IN",
  ta: "ta-IN",
  gu: "gu-IN",
  kn: "kn-IN",
  ml: "ml-IN",
  pa: "pa-IN",
};

export default function VoiceAssistantModal({ open, onClose }) {
  const navigate = useNavigate();
  const { language, t, currentLangObj } = useLanguage();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [detectedIntent, setDetectedIntent] = useState(null);
  const [statusMessage, setStatusMessage] = useState("Listening for your voice...");
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!open) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      setTranscript("");
      setDetectedIntent(null);
      return;
    }

    // Initialize Web Speech API
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatusMessage("Voice recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = LANG_CODE_MAP[language] || "en-IN";

    recognition.onstart = () => {
      setIsListening(true);
      setStatusMessage(`Listening in ${currentLangObj.name}... Speak symptoms or action`);
    };

    recognition.onresult = (event) => {
      const currentTranscript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      setTranscript(currentTranscript);
    };

    recognition.onerror = (event) => {
      console.warn("Speech error:", event.error);
      setIsListening(false);
      setStatusMessage("Tap the microphone to try speaking again.");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();

    return () => {
      try {
        recognition.stop();
      } catch (e) {}
    };
  }, [open, language, currentLangObj.name]);

  // Process transcript to detect medical intention & matching specialist
  useEffect(() => {
    if (!transcript) return;
    const lower = transcript.toLowerCase();

    // Symptom and routing dictionary
    let match = null;

    if (
      lower.includes("heart") ||
      lower.includes("chest") ||
      lower.includes("cardio") ||
      lower.includes("दिल") ||
      lower.includes("छाती") ||
      lower.includes("हार्ट")
    ) {
      match = {
        title: "Cardiologist (Heart Specialist)",
        sub: "Found matching cardiologists for chest/heart concerns",
        route: "/doctorList",
        speciality: "Cardiologist",
      };
    } else if (
      lower.includes("skin") ||
      lower.includes("itch") ||
      lower.includes("rash") ||
      lower.includes("त्वचा") ||
      lower.includes("खुजली")
    ) {
      match = {
        title: "Dermatologist (Skin Specialist)",
        sub: "Found specialists for skin, allergies and rashes",
        route: "/doctorList",
        speciality: "Dermatologist",
      };
    } else if (
      lower.includes("teeth") ||
      lower.includes("tooth") ||
      lower.includes("dental") ||
      lower.includes("दांत")
    ) {
      match = {
        title: "Dentist (Oral Health)",
        sub: "Found dental clinics and surgeons",
        route: "/doctorList",
        speciality: "Dentist",
      };
    } else if (
      lower.includes("fever") ||
      lower.includes("cold") ||
      lower.includes("cough") ||
      lower.includes("headache") ||
      lower.includes("बुखार") ||
      lower.includes("खांसी") ||
      lower.includes("सिरदर्द")
    ) {
      match = {
        title: "General Physician",
        sub: "General consultation for fever, cold & routine care",
        route: "/doctorList",
        speciality: "General Physician",
      };
    } else if (
      lower.includes("appointment") ||
      lower.includes("token") ||
      lower.includes("अपॉइंटमेंट") ||
      lower.includes("टोकन")
    ) {
      match = {
        title: "My Appointments",
        sub: "View your booked tokens and clinic queue",
        route: "/my-appointments",
      };
    } else if (
      lower.includes("report") ||
      lower.includes("blood test") ||
      lower.includes("रिपोर्ट") ||
      lower.includes("जांच")
    ) {
      match = {
        title: "Medical Reports",
        sub: "View AI analyzed lab reports and prescriptions",
        route: "/reports",
      };
    } else if (
      lower.includes("card") ||
      lower.includes("profile") ||
      lower.includes("कार्ड")
    ) {
      match = {
        title: "Smart Health ID Card",
        sub: "Open your digital ABHA health ID card",
        route: "/profile",
      };
    }

    if (match) {
      setDetectedIntent(match);
      playSuccess();
    }
  }, [transcript]);

  const handleToggleMic = () => {
    playTap();
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      setDetectedIntent(null);
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleProceed = () => {
    if (detectedIntent?.route) {
      playChime();
      onClose();
      navigate(detectedIntent.route);
    }
  };

  if (!open) return null;

  return (
    <div className="voice-overlay" onClick={onClose}>
      <div className="voice-modal" onClick={(e) => e.stopPropagation()}>
        <button className="voice-close-btn" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <div className="voice-header">
          <div className="voice-badge">
            <Sparkles size={14} />
            <span>AI Multilingual Voice Assistant</span>
          </div>
          <h3 className="voice-title">How can DelhiMed assist you?</h3>
          <p className="voice-sub">Speak symptoms, request specialist doctors, or check your token status</p>
        </div>

        {/* Animated Waveform Visualizer */}
        <div className={`voice-visualizer ${isListening ? "active" : ""}`}>
          <div className="wave-bar bar-1"></div>
          <div className="wave-bar bar-2"></div>
          <div className="wave-bar bar-3"></div>
          <div className="wave-bar bar-4"></div>
          <div className="wave-bar bar-5"></div>
          <div className="wave-bar bar-6"></div>
          <div className="wave-bar bar-7"></div>
        </div>

        {/* Mic Action Button */}
        <div className="voice-mic-container">
          <button
            className={`voice-mic-btn ${isListening ? "listening" : ""}`}
            onClick={handleToggleMic}
            aria-label="Toggle Microphone"
          >
            {isListening ? <Mic size={32} /> : <MicOff size={32} />}
          </button>
          <span className="voice-status-text">{statusMessage}</span>
        </div>

        {/* Live Speech Recognition Transcript Box */}
        <div className="voice-transcript-box">
          <p className="transcript-label">Recognized Speech:</p>
          <p className="transcript-content">
            {transcript ? `"${transcript}"` : "Say something like: 'मुझे दिल के डॉक्टर से मिलना है' or 'I have chest pain'..."}
          </p>
        </div>

        {/* Detected Action Card */}
        {detectedIntent && (
          <div className="voice-intent-card" onClick={handleProceed}>
            <div className="intent-info">
              <span className="intent-tag">Matched Specialty</span>
              <h4 className="intent-title">{detectedIntent.title}</h4>
              <p className="intent-sub">{detectedIntent.sub}</p>
            </div>
            <button className="intent-action-btn">
              <span>View</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        <div className="voice-footer">
          <span>Active Language: <strong>{currentLangObj.nativeName} ({currentLangObj.name})</strong></span>
        </div>
      </div>
    </div>
  );
}
