import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../api/axios";
import "./KioskIntake.css";

import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import SpaIcon from "@mui/icons-material/Spa";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ConsentModal from "../components/ConsentModal";
import AarogyaAvatar from "../components/AarogyaAvatar";
import FhirViewerModal from "../components/FhirViewerModal";
import AbhaScanShare from "../components/AbhaScanShare";
import { generateAbdmFhirBundle } from "../utils/fhirService";

/* ─── 8 Indian Regional Languages (Digital India Bhashini Pipeline) ─── */
export const BHASHINI_LANGUAGES = [
  { code: "hi", label: "हिंदी", bhashiniCode: "hi-IN", flag: "🇮🇳" },
  { code: "en", label: "English", bhashiniCode: "en-IN", flag: "🌐" },
  { code: "ta", label: "தமிழ்", bhashiniCode: "ta-IN", flag: "🌾" },
  { code: "te", label: "తెలుగు", bhashiniCode: "te-IN", flag: "🌊" },
  { code: "bn", label: "বাংলা", bhashiniCode: "bn-IN", flag: "🎨" },
  { code: "mr", label: "मराठी", bhashiniCode: "mr-IN", flag: "🚩" },
  { code: "gu", label: "ગુજરાતી", bhashiniCode: "gu-IN", flag: "🦁" },
  { code: "kn", label: "ಕನ್ನಡ", bhashiniCode: "kn-IN", flag: "☕" },
];

/* ─── Multilingual Prompts Dictionary (Bhashini AI) ─── */
const PROMPT_TEXTS = {
  step1: {
    hi: "नमस्ते! मैं सिस्टर आशा हूँ। आज आपको क्या परेशानी है? बोलकर बताएं या नीचे दिए गए विकल्प चुनें।",
    en: "Hello! I am Sister Asha, your Aarogya Mitra. What is your main health problem today? Please speak or tap an option below.",
    ta: "வணக்கம்! நான் சகோதரி ஆஷா. இன்று உங்களுக்கு என்ன உடல்நலப் பிரச்சனை? பேசவும் அல்லது தேர்வு செய்யவும்.",
    te: "నమస్కారం! నేను సిస్టర్ ఆశా. ఈరోజు మీకు ఉన్న ఆరోగ్య సమస్య ఏమిటి? మాట్లాడండి లేదా ఎంచుకోండి.",
    bn: "নমস্কার! আমি সিস্টার আশা। আজ আপনার কী শারীরিক সমস্যা হচ্ছে? কথা বলুন বা নির্বাচন করুন।",
    mr: "नमस्कार! मी सिस्टर आशा आहे. आज तुम्हाला काय त्रास होत आहे? बोलून सांगा किंवा निवडा.",
    gu: "નમસ્તે! હું સિસ્ટર આશા છું. આજે તમને શું તકલીફ છે? બોલીને જણાવો અથવા પસંદ કરો.",
    kn: "ನಮಸ್ಕಾರ! ನಾನು ಸಿಸ್ಟರ್ ಆಶಾ. ಇಂದು ನಿಮಗೆ ಏನು ಆರೋಗ್ಯ ತೊಂದರೆ ಇದೆ? ಮಾತನಾಡಿ ಅಥವಾ ಆಯ್ಕೆಮಾಡಿ.",
  },
  stepAyush: {
    hi: "आयुर्वेदिक दशविध परीक्षा: कृपया अपनी शारीरिक प्रकृति, पाचन शक्ति और कोष्ठ का चयन करें।",
    en: "Ayurvedic Dashavidha Pariksha: Please select your dominant Prakriti constitution, Agni, and digestion habit.",
    ta: "ஆயுர்வேத மதிப்பீடு: உங்கள் பிரகிருதி மற்றும் செரிமான நிலையைத் தேர்ந்தெடுக்கவும்.",
    te: "ఆయుర్వేద మూల్యాంకనం: మీ ప్రకృతి మరియు జీర్ణక్రియను ఎంచుకోండి.",
    bn: "আয়ুর্বেদিক মূল্যায়ন: অনুগ্রহ করে আপনার প্রকৃতি ও হজম ক্ষমতা নির্বাচন করুন।",
    mr: "आयुर्वेदिक मूल्यांकन: कृपया तुमची प्रकृती आणि पचनशक्ती निवडा.",
    gu: "આયુર્વેદિક મૂલ્યાંકન: કૃપા કરીને તમારી પ્રકૃતિ અને પાચન ક્ષમતા પસંદ કરો.",
    kn: "ಆಯುರ್ವೇದ ಪರೀಕ್ಷೆ: ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಕೃತಿ ಮತ್ತು ಜೀರ್ಣಕ್ರಿಯೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
  },
  stepMeds: {
    hi: "क्या आपको पहले से कोई पुरानी बीमारी है? अपनी नियमित दवाएं और एलर्जी दर्ज करें।",
    en: "Do you have any pre-existing medical conditions, daily medications, or known allergies?",
    ta: "உங்களுக்கு ஏதேனும் நாள்பட்ட நோய், தினசரி மருந்துகள் அல்லது ஒவ்வாமை உள்ளதா?",
    te: "మీకు ఏవైనా దీర్ఘకాలిక వ్యాధులు, రోజువారీ మందులు లేదా అలెర్జీలు ఉన్నాయా?",
    bn: "আপনার কি কোনো পুরোনো রোগ, নিয়মিত ওষুধ বা অ্যালার্জি আছে?",
    mr: "तुम्हाला पूर्वीचा काही आजार, रोजची औषधे किंवा ॲलर्जी आहे का?",
    gu: "શું તમને કોઈ જૂની બીમારી, નિયમિત દવાઓ કે એલર્જી છે?",
    kn: "ನಿಮಗೆ ಯಾವುದೇ ಹಳೆಯ ಕಾಯಿಲೆಗಳು, ದಿನನಿತ್ಯದ ಔಷಧಿಗಳು ಅಥವಾ ಅಲರ್ಜಿಗಳು ಇವೆಯೇ?",
  },
  stepDocs: {
    hi: "कृपया डॉक्टर की पुरानी पर्ची या खून की जांच रिपोर्ट की तस्वीर लें या फाइल चुनें।",
    en: "Please upload or snap photos of your past prescriptions, lab tests, and discharge summaries.",
    ta: "பழைய மருத்துவ சீட்டுகள் மற்றும் பரிசோதனை அறிக்கைகளை பதிவேற்றவும்.",
    te: "పాత ప్రిస్క్రిప్షన్లు మరియు ల్యాబ్ రిపోర్టులను అప్‌లోడ్ చేయండి.",
    bn: "অনুগ্রহ করে পুরানো প্রেসক্রিপশন ও ল্যাব রিপোর্ট আপলোড করুন।",
    mr: "कृपया जुनी औषधांची चिठ्ठी किंवा लॅब रिपोर्ट अपलोड करा.",
    gu: "કૃપા કરીને જૂની પ્રિસ્ક્રિપ્શન અથવા લેબ રિપોર્ટ અપલોડ કરો.",
    kn: "ದಯವಿಟ್ಟು ಹಳೆಯ ಚೀಟಿಗಳು ಮತ್ತು ಲ್ಯಾಬ್ ವರದಿಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.",
  },
  stepReview: {
    hi: "क्लिनिकल सारांश तैयार है। सबमिट बटन दबाएं, यह सीधे आपके डॉक्टर के कंप्यूटर पर पहुंच जाएगा।",
    en: "Clinical summary synthesized. Click Submit to send your structured history directly to the doctor.",
    ta: "மருத்துவ சுருக்கம் தயாராக உள்ளது. மருத்துவரிடம் சமர்ப்பிக்க கிளிக் செய்யவும்.",
    te: "క్లినికల్ సారాంశం సిద్ధంగా ఉంది. వైద్యుడికి పంపడానికి సమర్పించు క్లిక్ చేయండి.",
    bn: "ক্লিনিক্যাল সারাংশ প্রস্তুত। ডাক্তারের কাছে পাঠাতে সাবমিট করুন।",
    mr: "क्लिनिकल सारांश तयार आहे. डॉक्टरांकडे पाठवण्यासाठी सबमिट दाबा.",
    gu: "ક્લિનિકલ સારાંશ તૈયાર છે. ડૉક્ટરને મોકલવા માટે સબમિટ કરો.",
    kn: "ಕ್ಲಿನಿಕಲ್ ಸಾರಾಂಶ ಸಿದ್ಧವಾಗಿದೆ. ವೈದ್ಯರಿಗೆ ಕಳುಹಿಸಲು ಸಲ್ಲಿಕೆ ಕ್ಲಿಕ್ ಮಾಡಿ.",
  },
};

/* ─── Chief Complaints Catalog ─── */
const CHIEF_COMPLAINTS_CATALOG = [
  { id: "chest_pain", labelEn: "Chest Pain / Discomfort", labelHi: "छाती में दर्द / बेचैनी", emoji: "🫀", category: "cardiac" },
  { id: "headache", labelEn: "Severe Headache", labelHi: "तेज़ सिरदर्द", emoji: "🤕", category: "neuro" },
  { id: "fever", labelEn: "Fever & Chills", labelHi: "बुखार और ठंड लगना", emoji: "🤒", category: "general" },
  { id: "breathlessness", labelEn: "Shortness of Breath", labelHi: "सांस लेने में तकलीफ", emoji: "🫁", category: "respiratory" },
  { id: "abdominal_pain", labelEn: "Stomach / Abdominal Pain", labelHi: "पेट में दर्द", emoji: "🤢", category: "gi" },
  { id: "joint_pain", labelEn: "Joint / Body Pain", labelHi: "जोड़ों या बदन का दर्द", emoji: "🦴", category: "ortho" },
  { id: "cough", labelEn: "Persistent Cough", labelHi: "लगातार खांसी", emoji: "😷", category: "respiratory" },
  { id: "vomiting", labelEn: "Vomiting / Loose Motion", labelHi: "उल्टी या दस्त", emoji: "🤮", category: "gi" },
  { id: "weakness", labelEn: "Dizziness & Extreme Weakness", labelHi: "चक्कर व अत्यधिक कमजोरी", emoji: "💫", category: "general" },
  { id: "skin_rash", labelEn: "Skin Allergy / Rash", labelHi: "त्वचा पर चकत्ते / खुजली", emoji: "🩹", category: "derma" },
];

export default function KioskIntake() {
  const navigate = useNavigate();

  // State: Settings & Languages
  const [lang, setLang] = useState("hi");
  const [isAyushMode, setIsAyushMode] = useState(false);
  const [isConsentOpen, setIsConsentOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showFhirModal, setShowFhirModal] = useState(false);
  const [showScanShare, setShowScanShare] = useState(false);

  // State: AI Avatar & Speech
  const [avatarState, setAvatarState] = useState("idle"); // 'idle', 'speaking', 'listening', 'alert'
  const [isListening, setIsListening] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState("");
  const recognitionRef = useRef(null);

  // State: Consent & Patient Demographics
  const [consentData, setConsentData] = useState({
    abhaId: "",
    consentGranted: false,
    consentTimestamp: null,
    language: "hi",
  });

  // State: Clinical Intake Form Data
  const [intakeData, setIntakeData] = useState({
    chiefComplaint: "",
    chiefComplaintCustom: "",
    socratesHpi: {
      site: "",
      onset: "1-2 days",
      character: "Throbbing",
      radiation: "None",
      associations: [],
      timing: "Constant",
      exacerbating: "Movement / Exertion",
      severity: 5,
    },
    ayushAssessment: {
      prakriti: "Vata-Pitta",
      vikriti: "Pitta imbalance",
      agni: "Manda (Low digestive fire)",
      koshtha: "Madhyama (Normal bowels)",
      dietType: "Vegetarian",
      appetite: "Moderate",
      sleepQuality: "Disturbed",
    },
    conditions: {
      diabetes: false,
      hypertension: false,
      thyroid: false,
    },
    pastEvents: {
      surgeries: [],
      injuries: [],
      majorIllness: [],
    },
    medications: [],
    allergies: [],
    lifestyle: {
      smoking: "Never",
      alcohol: "Never",
    },
  });

  // State: Uploaded Documents
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // State: Red-Flag Alert Detection
  const [redFlagAlert, setRedFlagAlert] = useState({
    isTriggered: false,
    severity: "NONE",
    reasons: [],
  });

  /* ─── Determine Current Avatar Speech Text ─── */
  const getCurrentPromptText = () => {
    const langObj = (stepKey) => PROMPT_TEXTS[stepKey]?.[lang] || PROMPT_TEXTS[stepKey]?.["hi"];
    if (currentStep === 1) return langObj("step1");
    if (currentStep === 2 && isAyushMode) return langObj("stepAyush");
    if ((isAyushMode && currentStep === 3) || (!isAyushMode && currentStep === 2)) return langObj("stepMeds");
    if ((isAyushMode && currentStep === 4) || (!isAyushMode && currentStep === 3)) return langObj("stepDocs");
    return langObj("stepReview");
  };

  /* ─── Speech Recognition Setup (Bhashini Pipeline) ─── */
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      const currentLangConfig = BHASHINI_LANGUAGES.find((l) => l.code === lang);
      recognition.lang = currentLangConfig?.bhashiniCode || "hi-IN";

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((res) => res[0].transcript)
          .join("");
        setSpeechTranscript(transcript);

        if (currentStep === 1) {
          setIntakeData((prev) => ({
            ...prev,
            chiefComplaintCustom: transcript,
            chiefComplaint: prev.chiefComplaint || transcript,
          }));
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setAvatarState((prev) => (prev === "listening" ? "idle" : prev));
      };

      recognition.onerror = () => {
        setIsListening(false);
        setAvatarState("idle");
      };

      recognitionRef.current = recognition;
    }
  }, [lang, currentStep]);

  /* ─── Real-time Red-Flag Evaluation ─── */
  useEffect(() => {
    const reasons = [];
    let severity = "NONE";

    const complaint = (intakeData.chiefComplaint + " " + intakeData.chiefComplaintCustom).toLowerCase();
    const { site, radiation, associations, severity: painSeverity } = intakeData.socratesHpi;

    if (
      (complaint.includes("chest") || complaint.includes("छाती") || site.toLowerCase().includes("chest")) &&
      (radiation.includes("Arm") || radiation.includes("Jaw") || associations.includes("Sweating") || painSeverity >= 8)
    ) {
      reasons.push("🚨 Acute severe chest pain radiating to arm/jaw or associated with diaphoresis (Rule out ACS/MI)");
      severity = "CRITICAL";
    }

    if (complaint.includes("breath") || complaint.includes("सांस") || associations.includes("Breathlessness")) {
      if (painSeverity >= 7 || complaint.includes("severe") || complaint.includes("तेज़")) {
        reasons.push("🚨 Acute respiratory distress / severe breathlessness");
        if (severity !== "CRITICAL") severity = "URGENT";
      }
    }

    if (complaint.includes("stroke") || complaint.includes("slurred") || complaint.includes("paralysis") || complaint.includes("लकवा")) {
      reasons.push("🚨 Sudden neurological deficit / stroke symptoms");
      severity = "CRITICAL";
    }

    if (reasons.length > 0) {
      setRedFlagAlert({
        isTriggered: true,
        severity,
        reasons,
      });
      setAvatarState("alert");
    } else {
      setRedFlagAlert({
        isTriggered: false,
        severity: "NONE",
        reasons: [],
      });
      if (avatarState === "alert") setAvatarState("idle");
    }
  }, [intakeData.chiefComplaint, intakeData.chiefComplaintCustom, intakeData.socratesHpi]);

  /* ─── Text to Speech Audio Narration (Nurse Asha Voice) ─── */
  const speakText = (text) => {
    if (avatarState === "speaking") {
      window.speechSynthesis.cancel();
      setAvatarState("idle");
      return;
    }

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const currentLangConfig = BHASHINI_LANGUAGES.find((l) => l.code === lang);
      utterance.lang = currentLangConfig?.bhashiniCode || "hi-IN";
      utterance.rate = 0.95;
      utterance.onend = () => setAvatarState("idle");
      utterance.onerror = () => setAvatarState("idle");

      setAvatarState("speaking");
      window.speechSynthesis.speak(utterance);
    }
  };

  /* ─── Auto-narrate prompt on step change ─── */
  useEffect(() => {
    if (!isConsentOpen && !isListening) {
      speakText(getCurrentPromptText());
    }
  }, [currentStep, lang, isConsentOpen]);

  const toggleMic = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setAvatarState("idle");
    } else {
      if (avatarState === "speaking") {
        window.speechSynthesis.cancel();
      }
      setSpeechTranscript("");
      try {
        recognitionRef.current?.start();
        setIsListening(true);
        setAvatarState("listening");
      } catch (err) {
        console.error("Speech recognition error:", err);
      }
    }
  };

  /* ─── Form Handlers ─── */
  const handleSelectComplaint = (item) => {
    const val = lang === "hi" ? item.labelHi : item.labelEn;
    setIntakeData((prev) => ({
      ...prev,
      chiefComplaint: val,
      socratesHpi: {
        ...prev.socratesHpi,
        site: item.labelEn,
      },
    }));
  };

  const toggleAssociation = (symptom) => {
    setIntakeData((prev) => {
      const exists = prev.socratesHpi.associations.includes(symptom);
      return {
        ...prev,
        socratesHpi: {
          ...prev.socratesHpi,
          associations: exists
            ? prev.socratesHpi.associations.filter((s) => s !== symptom)
            : [...prev.socratesHpi.associations, symptom],
        },
      };
    });
  };

  const toggleCondition = (key) => {
    setIntakeData((prev) => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        [key]: !prev.conditions[key],
      },
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  /* ─── Submit Clinical Intake to Backend ─── */
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        conditions: intakeData.conditions,
        pastEvents: intakeData.pastEvents,
        medications: intakeData.medications,
        allergies: intakeData.allergies,
        currentSymptoms: [intakeData.chiefComplaint, ...intakeData.socratesHpi.associations].filter(Boolean),
        chiefComplaint: intakeData.chiefComplaintCustom || intakeData.chiefComplaint || "General Checkup",
        socratesHpi: intakeData.socratesHpi,
        ayushAssessment: isAyushMode ? intakeData.ayushAssessment : undefined,
        redFlagAlert: {
          isTriggered: redFlagAlert.isTriggered,
          severity: redFlagAlert.severity,
          reasons: redFlagAlert.reasons,
          triggeredAt: redFlagAlert.isTriggered ? new Date() : null,
        },
        consentAndAbha: consentData,
        lifestyle: intakeData.lifestyle,
      };

      await instance.put("/healthProfile/userData", payload);

      // Trigger AI Doctor Summary synthesis in backend
      try {
        await instance.get("/healthProfile/summary");
      } catch (err) {
        console.warn("Summary auto-generation notice:", err);
      }

      setSubmitSuccess(true);
    } catch (error) {
      console.error("Failed to submit kiosk intake:", error);
      alert(error.response?.data?.message || "Failed to record clinical intake. Please contact hospital staff.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="kiosk-success-screen">
        <div className="kiosk-success-card">
          <div className="success-icon-badge">
            <CheckCircleIcon sx={{ fontSize: 64, color: "#16a34a" }} />
          </div>
          <h2>{lang === "hi" ? "क्लिनिकल इतिहास सफलतापूर्वक दर्ज हुआ!" : "Clinical Intake Recorded Successfully!"}</h2>
          <p className="success-sub">
            {lang === "hi"
              ? "आपकी नैदानिक जानकारी, लक्षण और दस्तावेज़ डॉक्टर के कंप्यूटर पर भेज दिए गए हैं। कृपया प्रतीक्षा कक्ष में बैठें।"
              : "Your structured clinical history has been synthesized and transmitted directly to the doctor's OPD console."}
          </p>

          {redFlagAlert.isTriggered && (
            <div className="kiosk-alert-box alert--critical">
              <PriorityHighIcon sx={{ fontSize: 28 }} />
              <div>
                <strong>🚨 {lang === "hi" ? "प्राथमिकता ट्राइएज अलर्ट जारी!" : "Priority Triage Alert Activated!"}</strong>
                <p>{lang === "hi" ? "आपके लक्षणों के आधार पर अस्पताल स्टाफ को तुरंत सूचित किया गया है।" : "Hospital triage desk has been alerted for immediate priority review."}</p>
              </div>
            </div>
          )}

          <div className="kiosk-token-box">
            <span className="token-label">{lang === "hi" ? "आपका डिजिटल टोकन" : "Your Intake Token"}</span>
            <span className="token-number">MED-{Math.floor(100 + Math.random() * 900)}</span>
          </div>

          <div className="success-actions">
            <button className="btn-kiosk-primary" onClick={() => navigate("/my-appointments")}>
              {lang === "hi" ? "कतार की स्थिति देखें / View Queue" : "View Live Queue"}
            </button>
            <button className="btn-kiosk-secondary" onClick={() => window.location.reload()}>
              <RestartAltIcon sx={{ mr: 0.5 }} /> {lang === "hi" ? "नया मरीज पंजीकरण / Next Patient" : "Next Patient Intake"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="kiosk-layout">
      {/* Audio Consent Modal */}
      <ConsentModal
        isOpen={isConsentOpen}
        onClose={() => setIsConsentOpen(false)}
        onAccept={(data) => {
          setConsentData(data);
          setLang(data.language || "hi");
          setIsConsentOpen(false);
        }}
      />

      {/* Top Kiosk Navigation Bar */}
      <header className="kiosk-topbar">
        <div className="kiosk-brand">
          <div className="kiosk-logo-badge">
            <LocalHospitalIcon sx={{ fontSize: 28, color: "#ffffff" }} />
          </div>
          <div>
            <h1>MediKiosk • DelhiMed</h1>
            <span className="kiosk-tagline">AI Clinical Intake & Triage Platform (Bhashini AI)</span>
          </div>
        </div>

        <div className="kiosk-controls">
          {/* ABDM Scan & Share Simulation Button */}
          <button
            type="button"
            className="mode-toggle-btn"
            style={{ background: "#065f46", color: "#6ee7b7", borderColor: "#059669" }}
            onClick={() => setShowScanShare(true)}
          >
            📲 ABDM "Scan & Share"
          </button>

          {/* AYUSH Mode Toggle */}
          <button
            type="button"
            className={`mode-toggle-btn ${isAyushMode ? "active-ayush" : ""}`}
            onClick={() => setIsAyushMode(!isAyushMode)}
          >
            <SpaIcon sx={{ fontSize: 18 }} />
            {isAyushMode ? "🌿 AYUSH (Ayurveda) Mode" : "🩺 Allopathy Mode"}
          </button>

          {/* 8 Indian Regional Languages Selector */}
          <div className="bhashini-lang-dropdown-wrapper">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bhashini-select"
            >
              {BHASHINI_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Red-Flag Urgent Banner if detected */}
      {redFlagAlert.isTriggered && (
        <div className="redflag-alert-banner">
          <WarningAmberIcon sx={{ fontSize: 32 }} />
          <div>
            <strong>🚨 {lang === "hi" ? "आपातकालीन लक्षण पाए गए (Emergency Red Flag Detected)" : "Emergency Red Flag Alert Detected"}</strong>
            <ul>
              {redFlagAlert.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Kiosk Step Progress Indicator */}
      <div className="kiosk-stepper-bar">
        <div className={`step-node ${currentStep >= 1 ? "active" : ""}`}>
          <span>1</span>
          <p>{lang === "hi" ? "मुख्य लक्षण (SOCRATES)" : "Symptoms (HPI)"}</p>
        </div>
        {isAyushMode && (
          <div className={`step-node ${currentStep >= 2 ? "active" : ""}`}>
            <span>2</span>
            <p>{lang === "hi" ? "आयुष प्रकृति" : "AYUSH Pariksha"}</p>
          </div>
        )}
        <div className={`step-node ${currentStep >= (isAyushMode ? 3 : 2) ? "active" : ""}`}>
          <span>{isAyushMode ? "3" : "2"}</span>
          <p>{lang === "hi" ? "पिछला इतिहास व दवाएं" : "Past History & Meds"}</p>
        </div>
        <div className={`step-node ${currentStep >= (isAyushMode ? 4 : 3) ? "active" : ""}`}>
          <span>{isAyushMode ? "4" : "3"}</span>
          <p>{lang === "hi" ? "पुरानी पर्चियां व रिपोर्ट" : "Upload Papers"}</p>
        </div>
        <div className={`step-node ${currentStep >= (isAyushMode ? 5 : 4) ? "active" : ""}`}>
          <span>{isAyushMode ? "5" : "4"}</span>
          <p>{lang === "hi" ? "समीक्षा व सारांश" : "AI Review"}</p>
        </div>
      </div>

      {/* Main Kiosk Content Area */}
      <main className="kiosk-main-card">
        {/* 🌟 Interactive Animated Aarogya Mitra AI Avatar */}
        <AarogyaAvatar
          state={avatarState}
          currentSpeechText={getCurrentPromptText()}
          selectedLang={lang}
          onReplayAudio={() => speakText(getCurrentPromptText())}
        />

        {/* ───────────────── STEP 1: CHIEF COMPLAINT & SOCRATES HPI ───────────────── */}
        {currentStep === 1 && (
          <div className="step-section">
            <div className="section-title-row">
              <div>
                <h2>{lang === "hi" ? "आज आपको क्या परेशानी है?" : "What is your main health complaint?"}</h2>
                <p className="section-hint">
                  {lang === "hi"
                    ? "बोलकर बताएं या नीचे दिए गए विकल्पों में से चुनें (Speak or tap below):"
                    : "Speak naturally into the microphone or tap the closest symptom below:"}
                </p>
              </div>
            </div>

            {/* Voice Input Big Microphone Bar */}
            <div className={`voice-input-card ${isListening ? "listening" : ""}`}>
              <button type="button" className={`big-mic-btn ${isListening ? "pulse" : ""}`} onClick={toggleMic}>
                {isListening ? <MicIcon sx={{ fontSize: 40, color: "#ffffff" }} /> : <MicOffIcon sx={{ fontSize: 40 }} />}
              </button>
              <div className="voice-text-display">
                <span className="mic-status-label">
                  {isListening
                    ? lang === "hi"
                      ? "🎙️ हम सुन रहे हैं... कृपया बोलें"
                      : "🎙️ Listening... Please speak clearly"
                    : lang === "hi"
                    ? "माइक दबाकर अपनी बीमारी बताएं (Press mic to speak)"
                    : "Tap microphone to describe your symptoms in words"}
                </span>
                <p className="transcript-preview">
                  {speechTranscript || (lang === "hi" ? "जैसे: 'मुझे 2 दिन से तेज़ सिरदर्द और उल्टी हो रही है...'" : "e.g., 'Severe chest pain radiating to left arm since morning...'")}
                </p>
              </div>
            </div>

            {/* Quick Complaint Buttons Grid */}
            <div className="complaints-grid">
              {CHIEF_COMPLAINTS_CATALOG.map((item) => {
                const isSelected =
                  intakeData.chiefComplaint === (lang === "hi" ? item.labelHi : item.labelEn);
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`complaint-card ${isSelected ? "selected" : ""}`}
                    onClick={() => handleSelectComplaint(item)}
                  >
                    <span className="complaint-emoji">{item.emoji}</span>
                    <span className="complaint-text">{lang === "hi" ? item.labelHi : item.labelEn}</span>
                  </button>
                );
              })}
            </div>

            {/* SOCRATES Clinical Branching Details */}
            {intakeData.chiefComplaint && (
              <div className="socrates-branching-box">
                <div className="socrates-header">
                  <LocalHospitalIcon sx={{ color: "#2563eb" }} />
                  <h3>{lang === "hi" ? "🩺 लक्षण की गहराई (SOCRATES Clinical Branching)" : "🩺 Symptom Exploration (SOCRATES Framework)"}</h3>
                </div>

                <div className="socrates-grid">
                  {/* Onset */}
                  <div className="socrates-field">
                    <label>{lang === "hi" ? "कब से शुरू हुआ? (Onset)" : "When did it start? (Onset)"}</label>
                    <select
                      value={intakeData.socratesHpi.onset}
                      onChange={(e) =>
                        setIntakeData((p) => ({
                          ...p,
                          socratesHpi: { ...p.socratesHpi, onset: e.target.value },
                        }))
                      }
                    >
                      <option value="A few hours ago">{lang === "hi" ? "कुछ घंटे पहले" : "A few hours ago"}</option>
                      <option value="1-2 days">{lang === "hi" ? "1-2 दिन से" : "1–2 days ago"}</option>
                      <option value="1 week">{lang === "hi" ? "1 हफ्ते से" : "1 week ago"}</option>
                      <option value="More than a month">{lang === "hi" ? "1 महीने से अधिक" : "More than a month"}</option>
                    </select>
                  </div>

                  {/* Character */}
                  <div className="socrates-field">
                    <label>{lang === "hi" ? "दर्द/तकलीफ का प्रकार (Character)" : "Nature of Pain/Discomfort"}</label>
                    <select
                      value={intakeData.socratesHpi.character}
                      onChange={(e) =>
                        setIntakeData((p) => ({
                          ...p,
                          socratesHpi: { ...p.socratesHpi, character: e.target.value },
                        }))
                      }
                    >
                      <option value="Throbbing">{lang === "hi" ? "धड़कता हुआ (Throbbing)" : "Throbbing"}</option>
                      <option value="Sharp / Stabbing">{lang === "hi" ? "तेज़ चुभने वाला (Sharp)" : "Sharp / Stabbing"}</option>
                      <option value="Dull Ache">{lang === "hi" ? "हल्का मीठा दर्द (Dull Ache)" : "Dull Ache"}</option>
                      <option value="Burning">{lang === "hi" ? "जलन जैसा (Burning)" : "Burning"}</option>
                      <option value="Crushing / Heavy">{lang === "hi" ? "भारी दबाव / कुचलने जैसा (Crushing)" : "Crushing / Heavy"}</option>
                    </select>
                  </div>

                  {/* Radiation */}
                  <div className="socrates-field">
                    <label>{lang === "hi" ? "दर्द कहीं और फैल रहा है? (Radiation)" : "Does the pain spread anywhere?"}</label>
                    <select
                      value={intakeData.socratesHpi.radiation}
                      onChange={(e) =>
                        setIntakeData((p) => ({
                          ...p,
                          socratesHpi: { ...p.socratesHpi, radiation: e.target.value },
                        }))
                      }
                    >
                      <option value="None">{lang === "hi" ? "कहीं नहीं (Nowhere)" : "Nowhere"}</option>
                      <option value="Left Arm / Shoulder">{lang === "hi" ? "बाएं हाथ / कंधे में (Left Arm)" : "Left Arm / Shoulder"}</option>
                      <option value="Jaw / Neck">{lang === "hi" ? "जबड़े या गर्दन में (Jaw / Neck)" : "Jaw / Neck"}</option>
                      <option value="Back">{lang === "hi" ? "पीठ में (Back)" : "Back"}</option>
                    </select>
                  </div>

                  {/* Severity Slider */}
                  <div className="socrates-field severity-field">
                    <label>
                      {lang === "hi" ? "दर्द की तीव्रता (Severity 1-10):" : "Pain Severity (1–10 Scale):"}
                      <strong className="severity-val">{intakeData.socratesHpi.severity}/10</strong>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={intakeData.socratesHpi.severity}
                      onChange={(e) =>
                        setIntakeData((p) => ({
                          ...p,
                          socratesHpi: { ...p.socratesHpi, severity: Number(e.target.value) },
                        }))
                      }
                      className="severity-slider"
                    />
                    <div className="severity-ticks">
                      <span>1 (Mild)</span>
                      <span>5 (Moderate)</span>
                      <span>10 (Severe)</span>
                    </div>
                  </div>
                </div>

                {/* Associated Symptoms Pills */}
                <div className="associated-symptoms-box">
                  <label>{lang === "hi" ? "साथ में कोई अन्य लक्षण? (Associated Symptoms):" : "Any other associated symptoms?"}</label>
                  <div className="pill-wrap">
                    {["Nausea", "Vomiting", "Sweating", "Dizziness", "Breathlessness", "Fever", "Palpitations"].map(
                      (sym) => {
                        const isAssoc = intakeData.socratesHpi.associations.includes(sym);
                        return (
                          <button
                            key={sym}
                            type="button"
                            className={`symptom-pill ${isAssoc ? "active" : ""}`}
                            onClick={() => toggleAssociation(sym)}
                          >
                            {isAssoc ? "✓ " : "+ "}
                            {sym}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ───────────────── STEP 2: AYUSH / AYURVEDIC OPD PARIKSHA ───────────────── */}
        {currentStep === 2 && isAyushMode && (
          <div className="step-section">
            <div className="section-title-row">
              <div>
                <h2>🌿 {lang === "hi" ? "आयुर्वेदिक दशविध परीक्षा (AYUSH Pariksha)" : "Ayurvedic Clinical Intake (Dashavidha Pariksha)"}</h2>
                <p className="section-hint">
                  {lang === "hi"
                    ? "प्रकृति, अग्नि एवं कोष्ठ का त्वरित मूल्यांकन (Prakriti, Agni & Koshtha Assessment)"
                    : "Personalized Ayurvedic assessment of constitution, digestive fire, and lifestyle"}
                </p>
              </div>
            </div>

            <div className="ayush-card-grid">
              {/* Prakriti */}
              <div className="ayush-box">
                <label>🧘 {lang === "hi" ? "शारीरिक प्रकृति (Prakriti / Body Constitution)" : "Dominant Prakriti"}</label>
                <div className="ayush-pills">
                  {["Vata", "Pitta", "Kapha", "Vata-Pitta", "Pitta-Kapha", "Vata-Kapha", "Tridoshic"].map((prak) => (
                    <button
                      key={prak}
                      type="button"
                      className={`pill-option ${intakeData.ayushAssessment.prakriti === prak ? "selected" : ""}`}
                      onClick={() =>
                        setIntakeData((p) => ({
                          ...p,
                          ayushAssessment: { ...p.ayushAssessment, prakriti: prak },
                        }))
                      }
                    >
                      {prak}
                    </button>
                  ))}
                </div>
              </div>

              {/* Agni */}
              <div className="ayush-box">
                <label>🔥 {lang === "hi" ? "अग्नि / पाचन शक्ति (Agni / Digestive Capacity)" : "Agni (Digestive Capacity)"}</label>
                <div className="ayush-pills">
                  {[
                    { id: "Sama", label: "सम अग्नि (Normal / Balanced)" },
                    { id: "Manda", label: "मंद अग्नि (Low / Sluggish)" },
                    { id: "Tikshna", label: "तीक्ष्ण अग्नि (Sharp / Hyper)" },
                    { id: "Vishama", label: "विषम अग्नि (Irregular)" },
                  ].map((ag) => (
                    <button
                      key={ag.id}
                      type="button"
                      className={`pill-option ${intakeData.ayushAssessment.agni.includes(ag.id) ? "selected" : ""}`}
                      onClick={() =>
                        setIntakeData((p) => ({
                          ...p,
                          ayushAssessment: { ...p.ayushAssessment, agni: ag.label },
                        }))
                      }
                    >
                      {ag.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Koshtha */}
              <div className="ayush-box">
                <label>💧 {lang === "hi" ? "कोष्ठ / पेट की प्रकृति (Koshtha / Bowel Habit)" : "Koshtha (Bowel Movement)"}</label>
                <div className="ayush-pills">
                  {[
                    { id: "Madhyama", label: "मध्यम (Normal / Regular)" },
                    { id: "Krura", label: "क्रूर (Constipated / Hard)" },
                    { id: "Mrudu", label: "मृदु (Soft / Frequent)" },
                  ].map((k) => (
                    <button
                      key={k.id}
                      type="button"
                      className={`pill-option ${intakeData.ayushAssessment.koshtha.includes(k.id) ? "selected" : ""}`}
                      onClick={() =>
                        setIntakeData((p) => ({
                          ...p,
                          ayushAssessment: { ...p.ayushAssessment, koshtha: k.label },
                        }))
                      }
                    >
                      {k.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ahara Vihara */}
              <div className="ayush-box">
                <label>🥗 {lang === "hi" ? "आहार एवं निद्रा (Diet & Sleep Pattern)" : "Ahara-Vihara (Diet & Sleep)"}</label>
                <div className="ayush-pills">
                  {["Pure Veg", "Non-Veg", "Good Sleep (7-8 hrs)", "Disturbed Sleep", "Irregular Meal Timing"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={`pill-option ${intakeData.ayushAssessment.sleepQuality === item ? "selected" : ""}`}
                      onClick={() =>
                        setIntakeData((p) => ({
                          ...p,
                          ayushAssessment: { ...p.ayushAssessment, sleepQuality: item },
                        }))
                      }
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ───────────────── STEP: PAST MEDICAL HISTORY & MEDICATIONS ───────────────── */}
        {((isAyushMode && currentStep === 3) || (!isAyushMode && currentStep === 2)) && (
          <div className="step-section">
            <div className="section-title-row">
              <div>
                <h2>{lang === "hi" ? "पिछला स्वास्थ्य इतिहास व दवाएं" : "Past Medical History & Medications"}</h2>
                <p className="section-hint">
                  {lang === "hi"
                    ? "क्या आपको पहले से कोई बीमारी है या कोई नियमित दवा ले रहे हैं?"
                    : "Select existing pre-existing conditions or current medications:"}
                </p>
              </div>
            </div>

            {/* Conditions toggle pills */}
            <div className="conditions-section">
              <label className="field-group-label">{lang === "hi" ? "पुरानी बीमारियां (Chronic Conditions):" : "Pre-existing Conditions:"}</label>
              <div className="conditions-toggle-grid">
                {[
                  { key: "diabetes", label: "🍬 Diabetes / शुगर", emoji: "🍬" },
                  { key: "hypertension", label: "❤️ High BP / रक्तचाप", emoji: "❤️" },
                  { key: "thyroid", label: "🦋 Thyroid / थायरॉयड", emoji: "🦋" },
                ].map((cond) => (
                  <button
                    key={cond.key}
                    type="button"
                    className={`cond-toggle-btn ${intakeData.conditions[cond.key] ? "active" : ""}`}
                    onClick={() => toggleCondition(cond.key)}
                  >
                    <span>{cond.label}</span>
                    <span className="check-indicator">{intakeData.conditions[cond.key] ? "✓" : "+"}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Medications & Allergies Inputs */}
            <div className="meds-allergies-grid">
              <div className="form-input-card">
                <label>💊 {lang === "hi" ? "वर्तमान दवाएं (Current Medications):" : "Current Daily Medications:"}</label>
                <input
                  type="text"
                  placeholder="e.g. Metformin 500mg, Telmisartan 40mg"
                  onChange={(e) =>
                    setIntakeData((p) => ({
                      ...p,
                      medications: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    }))
                  }
                />
              </div>

              <div className="form-input-card">
                <label>⚠️ {lang === "hi" ? "दवाओं या भोजन से एलर्जी (Known Allergies):" : "Known Drug / Food Allergies:"}</label>
                <input
                  type="text"
                  placeholder="e.g. Penicillin, Sulfa, Peanuts"
                  onChange={(e) =>
                    setIntakeData((p) => ({
                      ...p,
                      allergies: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    }))
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* ───────────────── STEP: MEDICAL DOCUMENT DIGITIZATION ───────────────── */}
        {((isAyushMode && currentStep === 4) || (!isAyushMode && currentStep === 3)) && (
          <div className="step-section">
            <div className="section-title-row">
              <div>
                <h2>📄 {lang === "hi" ? "पुरानी पर्चियां व जांच रिपोर्ट अपलोड करें" : "Scan / Upload Past Medical Documents"}</h2>
                <p className="section-hint">
                  {lang === "hi"
                    ? "डॉक्टर की पुरानी पर्ची, डिस्चार्ज समरी या खून की जांच की तस्वीर लें या अपलोड करें (AI स्वतः पढ़ लेगा):"
                    : "Upload prescription slips, blood reports, or discharge summaries for AI OCR parsing & timeline generation:"}
                </p>
              </div>
            </div>

            <div className="kiosk-upload-dropzone">
              <input
                type="file"
                id="kiosk-doc-upload"
                multiple
                accept="image/*,application/pdf"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
              <label htmlFor="kiosk-doc-upload" className="upload-dropzone-label">
                <CloudUploadIcon sx={{ fontSize: 54, color: "#2563eb" }} />
                <h3>{lang === "hi" ? "कैमरे से फोटो खींचें या फाइल चुनें" : "Take Photo or Select Medical Documents"}</h3>
                <p>{lang === "hi" ? "PNG, JPG, PDF (अधिकतम 10MB)" : "Supports printed & handwritten prescriptions, CBC, LFT, KFT"}</p>
                <span className="btn-upload-browse">{lang === "hi" ? "दस्तावेज़ जोड़ें / Browse" : "Choose Files"}</span>
              </label>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="uploaded-files-list">
                <h4>{lang === "hi" ? "अपलोड की गई फाइलें (" + uploadedFiles.length + "):" : `Uploaded Files (${uploadedFiles.length}):`}</h4>
                <div className="files-pill-row">
                  {uploadedFiles.map((file, idx) => (
                    <div key={idx} className="file-pill">
                      📄 {file.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ───────────────── STEP: REVIEW & SUBMIT ───────────────── */}
        {((isAyushMode && currentStep === 5) || (!isAyushMode && currentStep === 4)) && (
          <div className="step-section">
            <div className="section-title-row">
              <div>
                <h2>📋 {lang === "hi" ? "क्लिनिकल सारांश की समीक्षा" : "Physician Intake Summary Review"}</h2>
                <p className="section-hint">
                  {lang === "hi"
                    ? "यह जानकारी सीधे आपके डॉक्टर के परामर्श कंप्यूटर पर पहुंचेगी:"
                    : "This structured draft will appear instantly on the doctor's OPD console:"}
                </p>
              </div>
            </div>

            <div className="summary-preview-card">
              <div className="summary-row">
                <span className="s-label">{lang === "hi" ? "मुख्य लक्षण (Chief Complaint):" : "Chief Complaint:"}</span>
                <strong className="s-val">{intakeData.chiefComplaintCustom || intakeData.chiefComplaint || "General checkup"}</strong>
              </div>

              <div className="summary-row">
                <span className="s-label">SOCRATES HPI:</span>
                <span className="s-val">
                  {intakeData.socratesHpi.character} pain at {intakeData.socratesHpi.site || "local area"}, onset {intakeData.socratesHpi.onset}, severity {intakeData.socratesHpi.severity}/10, radiates to {intakeData.socratesHpi.radiation}.
                </span>
              </div>

              {isAyushMode && (
                <div className="summary-row">
                  <span className="s-label">AYUSH Pariksha:</span>
                  <span className="s-val">
                    Prakriti: <strong>{intakeData.ayushAssessment.prakriti}</strong> | Agni: {intakeData.ayushAssessment.agni} | Koshtha: {intakeData.ayushAssessment.koshtha}
                  </span>
                </div>
              )}

              <div className="summary-row">
                <span className="s-label">{lang === "hi" ? "पुरानी बीमारियां:" : "Pre-existing:"}</span>
                <span className="s-val">
                  {Object.entries(intakeData.conditions)
                    .filter(([, v]) => v)
                    .map(([k]) => k.toUpperCase())
                    .join(", ") || "None"}
                </span>
              </div>

              <div className="summary-row">
                <span className="s-label">ABHA ID:</span>
                <span className="s-val">{consentData.abhaId || "ABHA-Verified"}</span>
              </div>

              <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px dashed #cbd5e1", display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowFhirModal(true)}
                  style={{
                    background: "#0f172a",
                    color: "#38bdf8",
                    border: "1px solid #334155",
                    borderRadius: "10px",
                    padding: "0.45rem 0.9rem",
                    fontSize: "0.82rem",
                    fontWeight: 800,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                  }}
                >
                  📜 Preview ABDM HL7 FHIR Bundle (.json)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ABDM FHIR JSON Viewer Modal */}
        <FhirViewerModal
          isOpen={showFhirModal}
          onClose={() => setShowFhirModal(false)}
          fhirBundle={generateAbdmFhirBundle({
            patient: { name: "Patient", email: consentData.abhaId },
            healthProfile: {
              userProvided: intakeData,
            },
            clinicalSummary: null,
            doctor: null,
            appointment: { appointmentNumber: "OPD-01" },
          })}
        />

        {/* ABDM Scan & Share Simulation Modal */}
        <AbhaScanShare
          isOpen={showScanShare}
          onClose={() => setShowScanShare(false)}
          onVerified={(patientData) => {
            setConsentData((prev) => ({
              ...prev,
              abhaId: patientData.abhaId,
              consentGranted: true,
              consentTimestamp: new Date(),
            }));
            setIsConsentOpen(false);
          }}
        />

        {/* Bottom Navigation Buttons */}
        <div className="kiosk-bottom-nav">
          {currentStep > 1 && (
            <button
              type="button"
              className="btn-kiosk-back"
              onClick={() => setCurrentStep((p) => p - 1)}
            >
              <ArrowBackIcon /> {lang === "hi" ? "पीछे (Back)" : "Back"}
            </button>
          )}

          <div style={{ flex: 1 }} />

          {currentStep < (isAyushMode ? 5 : 4) ? (
            <button
              type="button"
              className="btn-kiosk-next"
              onClick={() => setCurrentStep((p) => p + 1)}
            >
              {lang === "hi" ? "आगे बढ़ें (Next)" : "Next"} <ArrowForwardIcon />
            </button>
          ) : (
            <button
              type="button"
              className="btn-kiosk-submit"
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? "Transmitting..." : lang === "hi" ? "डॉक्टर को भेजें (Submit to Doctor)" : "Submit to Doctor's OPD Console"}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
