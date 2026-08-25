import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import HomeIcon from "@mui/icons-material/Home";
import api from "../../api/axios";
import "./KioskConverse.css";

// Estimated question count for the progress dots — the interview length
// is adaptive (Gemini decides isComplete), so this is a rough visual cue,
// not a hard total.
const ESTIMATED_QUESTIONS = 8;

export default function KioskConverse() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState("What brings you in today?");
  const [mcqOptions, setMcqOptions] = useState([]);
  const [transcript, setTranscript] = useState([]);
  const [turnCount, setTurnCount] = useState(0);
  const [redFlag, setRedFlag] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const audioRef = useRef(null);
  const hasGreetedRef = useRef(false);

  useEffect(() => {
    if (hasGreetedRef.current) return;
    hasGreetedRef.current = true;

    const loadGreeting = async () => {
      try {
        const res = await api.get(`/kiosk/${sessionId}/greeting`);
        setQuestion(res.data.question);
        if (res.data.audioUrl && audioRef.current) {
          audioRef.current.src = `data:audio/wav;base64,${res.data.audioUrl}`;
          audioRef.current.play().catch(() => {
            // Autoplay can still be blocked on some browsers even after a
            // prior click — the mic button remains the fallback interaction.
          });
        }
      } catch {
        // Keep the default English fallback text already in state —
        // a failed greeting shouldn't block the patient from starting.
      }
    };

    loadGreeting();
  }, [sessionId]);

  const submitTurn = async (payload, isAudio) => {
    setProcessing(true);
    setError("");
    try {
      const body = isAudio ? payload : JSON.stringify(payload);
      const headers = isAudio
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" };

      const res = await api.post(`/kiosk/${sessionId}/voice-answer`, body, {
        headers,
      });
      const data = res.data;

      setTranscript((prev) => [
        ...prev,
        { role: "patient", text: data.transcribedText },
        { role: "ai", text: data.nextQuestion },
      ]);
      setQuestion(data.nextQuestion);
      setMcqOptions(data.mcqOptions || []);
      setIsComplete(!!data.isComplete);
      setRedFlag(data.redFlag || null);
      setTurnCount((c) => c + 1);

      if (data.audioUrl && audioRef.current) {
        audioRef.current.src = data.audioUrl;
        audioRef.current.play().catch(() => {});
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.errors?.join(", ") ||
        err.response?.data?.message ||
        "Couldn't process that answer. Please try again.";
      setError(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  const handleMicClick = async () => {
    if (recording) {
      mediaRecorderRef.current?.stop();
      setRecording(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", blob, "answer.webm");
        submitTurn(formData, true);
        stream.getTracks().forEach((t) => t.stop());
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch (err) {
      setError(
        "Microphone access is needed to answer by voice. You can tap an option below instead.",
      );
    }
  };

  const handleMcqSelect = (optionText) => {
    submitTurn({ answerText: optionText }, false);
  };

  const handleContinue = () => {
    navigate(`/kiosk/${sessionId}/docs`);
  };

  return (
    <div className="mk-converse-root">
      <div className="mk-converse-container">
        <div className="pn-top-nav">
          <button className="pn-nav-btn" onClick={() => navigate(-1)}>
            <ArrowBackIosNewIcon fontSize="small" /> Back
          </button>
          <button className="pn-nav-btn" onClick={() => navigate("/home")}>
            <HomeIcon fontSize="small" /> Home
          </button>
        </div>

        <div className="mk-converse-progress">
          {Array.from({ length: ESTIMATED_QUESTIONS }).map((_, i) => (
            <div
              key={i}
              className={`mk-converse-dot ${i < turnCount ? "filled" : ""}`}
            />
          ))}
        </div>

        {redFlag && (
          <div className="mk-converse-redflag">
            <WarningAmberIcon fontSize="small" />
            Flagged for priority triage: {redFlag}. Please let the front desk
            know now.
          </div>
        )}

        <div className="mk-converse-question-card">
          <div className="mk-converse-ai-avatar">AI</div>
          <p className="mk-converse-question-text">{question}</p>
        </div>

        {transcript.length > 0 && (
          <div className="mk-converse-transcript">
            {transcript.slice(-6).map((t, i) => (
              <div
                key={i}
                className={`mk-converse-turn ${t.role === "patient" ? "patient" : ""}`}
              >
                {t.text}
              </div>
            ))}
          </div>
        )}

        {mcqOptions.length > 0 && !isComplete && (
          <div className="mk-converse-mcq-row">
            {mcqOptions.map((opt, i) => (
              <button
                key={i}
                className="mk-converse-mcq-chip"
                onClick={() => handleMcqSelect(opt)}
                disabled={processing}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {error && <div className="pn-error">{error}</div>}

        {!isComplete && (
          <div className="mk-converse-voice-area">
            <button
              className={`mk-converse-mic-btn ${recording ? "recording" : ""}`}
              onClick={handleMicClick}
              disabled={processing}
            >
              {processing ? (
                <CircularProgress size={22} sx={{ color: "#ffffff" }} />
              ) : recording ? (
                <StopIcon fontSize="medium" />
              ) : (
                <MicIcon fontSize="medium" />
              )}
            </button>
            <span className="mk-converse-mic-label">
              {recording
                ? "Listening… tap to stop"
                : processing
                  ? "Processing…"
                  : "Tap to speak, or choose an option above"}
            </span>
          </div>
        )}

        <button
          className="mk-converse-continue-btn"
          onClick={handleContinue}
          disabled={!isComplete}
        >
          Continue to Documents
        </button>

        <audio ref={audioRef} hidden />
      </div>
    </div>
  );
}
