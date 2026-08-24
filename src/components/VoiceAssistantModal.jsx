import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { playTap, playSuccess, playChime } from "../utils/audioFX";
import { Mic, MicOff, X, Sparkles, Volume2, ArrowRight, Send } from "lucide-react";
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

const SUGGESTED_SYMPTOMS = [
  { label: "🫀 Chest Pain / Heart Doctor", query: "I have chest pain and need a cardiologist" },
  { label: "🧴 Skin Rash / Allergy", query: "Skin rash and itching dermatologist" },
  { label: "🧠 Headache / Neurologist", query: "Severe headache neurologist" },
  { label: "🎫 Check My Token", query: "Check my booked appointment queue token" },
  { label: "📄 Lab Reports", query: "Show my blood test medical reports" },
];

export default function VoiceAssistantModal({ open, onClose }) {
  const navigate = useNavigate();
  const { language, t, currentLangObj } = useLanguage();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [inputText, setInputText] = useState("");
  const [detectedIntent, setDetectedIntent] = useState(null);
  const [statusMessage, setStatusMessage] = useState("Listening for your voice...");
  const recognitionRef = useRef(null);

  const processQuery = (text) => {
    if (!text) return;
    const lower = text.toLowerCase();
    let match = null;

    if (
      lower.includes("heart") ||
      lower.includes("chest") ||
      lower.includes("cardio") ||
      lower.includes("दिल") ||
      lower.includes("हार्ट") ||
      lower.includes("छाती")
    ) {
      match = {
        title: "Cardiologist Specialists",
        sub: "Found 3 top heart & cardiovascular physicians",
        route: "/doctorList",
      };
    } else if (
      lower.includes("skin") ||
      lower.includes("derma") ||
      lower.includes("rash") ||
      lower.includes("त्वचा") ||
      lower.includes("स्किन") ||
      lower.includes("खुजली")
    ) {
      match = {
        title: "Dermatologists",
        sub: "Found top skin & allergy specialist doctors",
        route: "/doctorList",
      };
    } else if (
      lower.includes("headache") ||
      lower.includes("neuro") ||
      lower.includes("brain") ||
      lower.includes("सिर") ||
      lower.includes("दर्द") ||
      lower.includes("दिमाग")
    ) {
      match = {
        title: "Neurology & General Medicine",
        sub: "Found physicians for headache & neurological care",
        route: "/doctorList",
      };
    } else if (
      lower.includes("appointment") ||
      lower.includes("token") ||
      lower.includes("queue") ||
      lower.includes("अपॉइंटमेंट") ||
      lower.includes("टोकन")
    ) {
      match = {
        title: "My Appointments & Live Queue",
        sub: "View your booked tokens and clinic queue status",
        route: "/my-appointments",
      };
    } else if (
      lower.includes("report") ||
      lower.includes("blood test") ||
      lower.includes("lab") ||
      lower.includes("रिपोर्ट") ||
      lower.includes("जांच")
    ) {
      match = {
        title: "AI Medical Reports",
        sub: "View AI analyzed lab reports and pathology tests",
        route: "/reports",
      };
    } else if (
      lower.includes("card") ||
      lower.includes("profile") ||
      lower.includes("id") ||
      lower.includes("कार्ड")
    ) {
      match = {
        title: "Smart Health ID Card",
        sub: "Open your 3D digital ABHA health ID card",
        route: "/profile",
      };
    } else {
      match = {
        title: "Doctor Directory",
        sub: "Browse all available specialists & clinics",
        route: "/doctorList",
      };
    }

    if (match) {
      setDetectedIntent(match);
      playSuccess();

      // Speech Synthesis Audio Feedback
      if ("speechSynthesis" in window) {
        try {
          const utterance = new SpeechSynthesisUtterance(`Matched ${match.title}`);
          utterance.lang = LANG_CODE_MAP[language] || "en-IN";
          window.speechSynthesis.speak(utterance);
        } catch (e) {}
      }
    }
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatusMessage("Voice not supported on this browser. Use quick chips or type below.");
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = LANG_CODE_MAP[language] || "en-IN";

      recognition.onstart = () => {
        setIsListening(true);
        setStatusMessage(`Listening in ${currentLangObj.name}... Speak symptoms`);
      };

      recognition.onresult = (event) => {
        const currentTranscript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setTranscript(currentTranscript);
        processQuery(currentTranscript);
      };

      recognition.onerror = (event) => {
        console.warn("Speech error:", event.error);
        setIsListening(false);
        if (event.error === "not-allowed") {
          setStatusMessage("Microphone permission denied. Tap a quick chip below.");
        } else {
          setStatusMessage("Mic ready. Tap mic or select a symptom below.");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
    } catch (err) {
      console.warn("Speech start err:", err);
      setIsListening(false);
      setStatusMessage("Tap mic to start or use quick symptom buttons.");
    }
  };

  useEffect(() => {
    if (!open) {
      try {
        recognitionRef.current?.stop();
      } catch (e) {}
      setIsListening(false);
      setTranscript("");
      setInputText("");
      setDetectedIntent(null);
      return;
    }

    startListening();

    return () => {
      try {
        recognitionRef.current?.stop();
      } catch (e) {}
    };
  }, [open, language, currentLangObj.name]);

  const handleToggleMic = () => {
    playTap();
    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (e) {}
      setIsListening(false);
      setStatusMessage("Paused. Tap mic to speak again.");
    } else {
      setTranscript("");
      setDetectedIntent(null);
      startListening();
    }
  };

  const handleChipClick = (item) => {
    playTap();
    setTranscript(item.query);
    processQuery(item.query);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    playTap();
    setTranscript(inputText);
    processQuery(inputText);
    setInputText("");
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
          <p className="voice-sub">Speak symptoms in your regional language or tap any quick suggestion</p>
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
          <p className="transcript-label">Recognized Request:</p>
          <p className="transcript-content">
            {transcript ? `"${transcript}"` : "Say: 'मुझे दिल के डॉक्टर से मिलना है' or 'Check my token'..."}
          </p>
        </div>

        {/* Quick Symptom Suggestions */}
        <div className="voice-chips-row">
          {SUGGESTED_SYMPTOMS.map((item, idx) => (
            <button
              key={idx}
              className="voice-symptom-chip"
              onClick={() => handleChipClick(item)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Manual Query Input Fallback */}
        <form className="voice-input-form" onSubmit={handleManualSubmit}>
          <input
            type="text"
            className="voice-text-input"
            placeholder="Or type symptoms / queries here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button type="submit" className="voice-input-send-btn">
            <Send size={15} />
          </button>
        </form>

        {/* Detected Action Card */}
        {detectedIntent && (
          <div className="voice-intent-card" onClick={handleProceed}>
            <div className="intent-info">
              <span className="intent-tag">Matched Clinic Routing</span>
              <h4 className="intent-title">{detectedIntent.title}</h4>
              <p className="intent-sub">{detectedIntent.sub}</p>
            </div>
            <button className="intent-action-btn">
              <span>Go</span>
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
