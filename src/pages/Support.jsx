import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Support.css";

const faqs = [
  {
    q: "How do I book an appointment?",
    a: "Go to the Doctors tab, pick your doctor, choose a date and available slot, then complete payment via UPI or card. You'll get a token number and PIN instantly.",
  },
  {
    q: "I forgot my appointment PIN. What do I do?",
    a: "Your PIN is sent via SMS to your registered phone number after payment. If you've deleted the message, please contact support — we can resend it.",
  },
  {
    q: "How does the AI report analysis work?",
    a: "When you upload a lab report (PDF or image), our system sends it to an AI model that extracts test values, flags abnormalities, and generates a plain-language Hinglish summary within minutes.",
  },
  {
    q: "Can I cancel or reschedule an appointment?",
    a: "Currently, cancellations must be done through the clinic directly. The reschedule feature is coming soon. Refund eligibility depends on clinic policy.",
  },
  {
    q: "My report analysis failed. What now?",
    a: 'Open the report → tap "Regenerate Summary". If it keeps failing, the file may be corrupted or an unsupported format. Try re-uploading a clear PDF.',
  },
  {
    q: "Is my medical data secure?",
    a: "Yes. All reports are stored encrypted on Cloudinary. We never share your data with third parties. Only your treating doctor can view your health profile during a consultation.",
  },
  {
    q: "What is the Patient ID Card?",
    a: "It's your unique DelhiMed identity (DM-XXXXX). Show the QR code at the clinic so the doctor can pull your health profile instantly — no paperwork needed.",
  },
];

const contactOptions = [
  {
    icon: "💬",
    label: "WhatsApp Support",
    sub: "Fastest · Mon–Sat, 9AM–7PM",
    action: "Chat Now",
    color: "#d5eab3",
    href: "https://wa.me/+918865836914",
  },
  {
    icon: "📧",
    label: "Email Us",
    sub: "aashay0503@gamil.com",
    action: "Send Mail",
    color: "#dce9ff",
    href: "mailto:aashay0503@gmail.com",
  },
  {
    icon: "📞",
    label: "Call Support",
    sub: "+91 8865836914",
    action: "Call Now",
    color: "#ffe6f0",
    href: "tel:+918865836914",
  },
];

export default function Support() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="sup-root">
      {/* Header */}
      <div className="sup-header">
        <div>
          <h1 className="sup-title">Help & Support</h1>
          <p className="sup-subtitle">We're here for you 🙌</p>
        </div>
      </div>

      {/* Search */}
      <div className="sup-search-wrap">
        <span className="sup-search-icon">🔍</span>
        <input
          className="sup-search"
          placeholder="Search FAQs…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button className="sup-search-clear" onClick={() => setSearch("")}>
            ×
          </button>
        )}
      </div>

      {/* Contact Options */}
      <section className="sup-section">
        <h2 className="sup-section-title">Contact Us</h2>
        <div className="sup-contact-grid">
          {contactOptions.map((c) => (
            <a
              key={c.label}
              className="sup-contact-card"
              href={c.href}
              target="_blank"
              rel="noreferrer"
              style={{ background: c.color }}
            >
              <span className="sup-contact-icon">{c.icon}</span>
              <span className="sup-contact-label">{c.label}</span>
              <span className="sup-contact-sub">{c.sub}</span>
              <span className="sup-contact-action">{c.action} →</span>
            </a>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="sup-section">
        <h2 className="sup-section-title">
          Frequently Asked Questions
          {search && (
            <span className="sup-faq-count"> · {filtered.length} results</span>
          )}
        </h2>

        {filtered.length === 0 ? (
          <div className="sup-empty">
            <span className="sup-empty-icon">🤷</span>
            <p>
              No FAQs matched "<strong>{search}</strong>"
            </p>
            <button
              className="sup-empty-feedback"
              onClick={() => navigate("/feedback")}
            >
              Ask us directly →
            </button>
          </div>
        ) : (
          <div className="sup-faq-list">
            {filtered.map((f, i) => (
              <div
                key={i}
                className={`sup-faq-item${openIndex === i ? " sup-faq-open" : ""}`}
              >
                <button
                  className="sup-faq-q"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                >
                  <span>{f.q}</span>
                  <span className="sup-faq-chevron">
                    {openIndex === i ? "▲" : "▼"}
                  </span>
                </button>
                {openIndex === i && <p className="sup-faq-a">{f.a}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Feedback CTA */}
      <div className="sup-feedback-cta">
        <p>Still have questions or something isn't working?</p>
        <button
          className="sup-feedback-btn"
          onClick={() => navigate("/feedback")}
        >
          Give Feedback
        </button>
      </div>
    </div>
  );
}
