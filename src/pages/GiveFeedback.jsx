import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useLanguage } from "../context/LanguageContext";
import "./GiveFeedback.css";

const CATEGORIES = [
  { emoji: "🐛", label: "Bug Report" },
  { emoji: "✨", label: "Feature Request" },
  { emoji: "😊", label: "General Feedback" },
  { emoji: "💳", label: "Payment Issue" },
  { emoji: "🤖", label: "AI Analysis Issue" },
  { emoji: "📅", label: "Appointment Issue" },
];

const RATINGS = ["😞", "😐", "🙂", "😄", "🤩"];

export default function GiveFeedback() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [rating, setRating] = useState(null);
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const charLimit = 500;

  const handleSubmit = async () => {
    if (!rating) return setError("Please select a rating.");
    if (!category) return setError("Please choose a category.");
    if (message.trim().length < 10)
      return setError("Please write at least 10 characters.");

    setError("");
    setLoading(true);

    try {
      await axios.post("/feedback", {
        rating: rating + 1, // 1–5
        category,
        message: message.trim(),
      });
      setSubmitted(true);
    } catch (err) {
      console.warn("Feedback endpoint not yet active:", err.message);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="fb-root fb-success-root">
        <div className="fb-success-card">
          <span className="fb-success-anim">🎉</span>
          <h2 className="fb-success-title">Thank you!</h2>
          <p className="fb-success-msg">
            Your feedback helps make DelhiMed better for everyone. We'll review
            it soon.
          </p>
          <button className="fb-success-btn" onClick={() => navigate(-1)}>
            Back to App
          </button>
          <button
            className="fb-success-link"
            onClick={() => {
              setSubmitted(false);
              setRating(null);
              setCategory("");
              setMessage("");
            }}
          >
            Submit another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fb-root">
      {/* Header */}
      <div className="fb-header">
        <div>
          <h1 className="fb-title">{t("giveFeedback", "Give Feedback")}</h1>
          <p className="fb-subtitle">Your voice shapes DelhiMed 🚀</p>
        </div>
      </div>

      <div className="fb-body">
        {/* Rating */}
        <div className="fb-card">
          <p className="fb-card-label">How's your experience so far?</p>
          <div className="fb-rating-row">
            {RATINGS.map((emoji, i) => (
              <button
                key={i}
                className={`fb-rating-btn${rating === i ? " fb-rating-active" : ""}`}
                onClick={() => setRating(i)}
                title={["Poor", "Fair", "Good", "Great", "Amazing"][i]}
              >
                <span className="fb-rating-emoji">{emoji}</span>
                <span className="fb-rating-label">
                  {["Poor", "Fair", "Good", "Great", "Amazing"][i]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="fb-card">
          <p className="fb-card-label">What's this about?</p>
          <div className="fb-cat-grid">
            {CATEGORIES.map((c) => (
              <button
                key={c.label}
                className={`fb-cat-btn${category === c.label ? " fb-cat-active" : ""}`}
                onClick={() => setCategory(c.label)}
              >
                <span className="fb-cat-emoji">{c.emoji}</span>
                <span className="fb-cat-label">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div className="fb-card">
          <p className="fb-card-label">Tell us more</p>
          <textarea
            className="fb-textarea"
            placeholder="Describe your experience, the issue you faced, or the feature you'd love to see…"
            value={message}
            onChange={(e) =>
              e.target.value.length <= charLimit && setMessage(e.target.value)
            }
            rows={5}
          />
          <div className="fb-char-count">
            <span
              className={message.length > charLimit - 50 ? "fb-char-warn" : ""}
            >
              {message.length}
            </span>
            /{charLimit}
          </div>
        </div>

        {/* Error */}
        {error && <div className="fb-error">⚠️ {error}</div>}

        {/* Submit */}
        <button
          className="fb-submit-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <span className="fb-spinner" /> : "Submit Feedback ✨"}
        </button>

        <p className="fb-disclaimer">
          Feedback is anonymous unless you contact support directly.
        </p>
      </div>
    </div>
  );
}
