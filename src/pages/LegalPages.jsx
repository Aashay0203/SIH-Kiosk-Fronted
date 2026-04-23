import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LegalPages.css";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import HomeIcon from "@mui/icons-material/Home";
import GavelIcon from "@mui/icons-material/Gavel";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

const TABS = ["Terms & Conditions", "Refund Policy"];

export default function LegalPages() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="lp-root">
      <div className="lp-container">
        {/* Top Nav */}
        <div className="lp-top-nav">
          <button className="lp-nav-btn" onClick={() => navigate(-1)}>
            <ArrowBackIosNewIcon fontSize="small" /> Back
          </button>
          <button className="lp-nav-btn" onClick={() => navigate("/home")}>
            <HomeIcon fontSize="small" /> Home
          </button>
        </div>

        {/* Header */}
        <div className="lp-header">
          <h1 className="lp-title">Legal Information</h1>
          <p className="lp-subtitle">ClinicFlow · Last updated: April 2026</p>
        </div>

        {/* Tabs */}
        <div className="lp-tabs">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              className="lp-tab-btn"
              onClick={() => setActiveTab(i)}
              style={{
                color: activeTab === i ? "var(--blue)" : "var(--text-muted)",
              }}
            >
              {i === 0 ? (
                <GavelIcon fontSize="small" className="lp-tab-icon" />
              ) : (
                <CurrencyRupeeIcon fontSize="small" className="lp-tab-icon" />
              )}
              {tab}
              {activeTab === i && <span className="lp-tab-underline" />}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 0 ? <TermsContent /> : <RefundContent />}

        {/* Footer */}
        <p className="lp-footer-note">
          Questions? Contact us at{" "}
          <a className="lp-link" href="mailto:support@clinicflow.in">
            support@clinicflow.in
          </a>
        </p>
      </div>
    </div>
  );
}

function TermsContent() {
  return (
    <div className="lp-sections">
      <Section title="1. About ClinicFlow">
        ClinicFlow is a digital platform that connects patients with registered
        doctors and clinics in India. We provide appointment booking, queue
        management, and medical record storage services. We do not provide
        medical advice or treatment.
      </Section>

      <Section title="2. Acceptance of Terms">
        By using ClinicFlow, you agree to these Terms & Conditions. If you do
        not agree, please do not use the platform. We reserve the right to
        update these terms at any time.
      </Section>

      <Section title="3. User Responsibilities">
        <ul className="lp-list">
          <li>You must provide accurate personal and health information.</li>
          <li>
            You are responsible for keeping your login credentials secure.
          </li>
          <li>You must not misuse the platform for fraudulent bookings.</li>
          <li>
            You must arrive at the clinic within a reasonable time of your token
            being called.
          </li>
        </ul>
      </Section>

      <Section title="4. Our Role as an Intermediary">
        ClinicFlow is a technology platform. We are not a healthcare provider.
        The medical consultation, diagnosis, and treatment are solely the
        responsibility of the doctor and clinic. We facilitate the connection
        and booking — nothing more.
      </Section>

      <Section title="5. Appointment Bookings">
        <ul className="lp-list">
          <li>Bookings are token-based, not time-slot guaranteed.</li>
          <li>
            Actual wait times depend on the clinic and doctor availability.
          </li>
          <li>
            ClinicFlow is not liable for clinic delays, cancellations, or doctor
            unavailability.
          </li>
        </ul>
      </Section>

      <Section title="6. Medical Records & Data">
        <ul className="lp-list">
          <li>Reports you upload are stored securely on Cloudinary.</li>
          <li>
            AI-generated summaries are for reference only — not medical advice.
          </li>
          <li>You own your data. We do not sell it to third parties.</li>
          <li>Deleting your account removes all stored records permanently.</li>
        </ul>
      </Section>

      <Section title="7. Payments">
        <ul className="lp-list">
          <li>Consultation fees are collected on behalf of the clinic.</li>
          <li>A platform convenience fee may be charged per booking.</li>
          <li>
            All payments are processed via Razorpay / UPI. ClinicFlow does not
            store card details.
          </li>
        </ul>
      </Section>

      <Section title="8. Limitation of Liability">
        ClinicFlow shall not be liable for any medical outcomes, misdiagnosis,
        clinic negligence, or data loss due to unforeseen technical failures.
        Our maximum liability is limited to the platform fee paid for the
        specific transaction.
      </Section>

      <Section title="9. Governing Law">
        These terms are governed by the laws of India. Any disputes shall be
        subject to the jurisdiction of courts in Delhi, India.
      </Section>
    </div>
  );
}

function RefundContent() {
  return (
    <div className="lp-sections">
      {/* Highlight box */}
      <div className="lp-highlight-box">
        <span className="lp-highlight-icon">⚠️</span>
        <p>
          <strong>Important:</strong> ClinicFlow is only a middleman platform
          connecting patients with doctors. We do not directly provide medical
          services. Please read our refund policy carefully.
        </p>
      </div>

      <Section title="1. Platform Convenience Fee">
        The platform convenience fee charged by ClinicFlow at the time of
        booking is <strong>non-refundable</strong> under all circumstances. This
        fee covers the cost of appointment management, queue tracking, and
        digital record keeping provided by ClinicFlow.
      </Section>

      <Section title="2. Consultation Fee Refunds">
        Refunds for consultation fees are handled{" "}
        <strong>entirely offline by the clinic</strong>. ClinicFlow does not
        process, hold, or return consultation fees. To request a refund:
        <ul className="lp-list lp-list--mt">
          <li>Contact the clinic/doctor directly in person.</li>
          <li>
            The clinic/doctor has full discretion to approve or deny the refund.
          </li>
          <li>ClinicFlow has no authority to intervene in this process.</li>
        </ul>
      </Section>

      <Section title="3. When Refunds May Be Considered">
        A doctor or clinic may consider a refund in cases such as:
        <ul className="lp-list lp-list--mt">
          <li>
            Doctor was unavailable and the appointment was not rescheduled.
          </li>
          <li>Clinic cancelled the appointment without prior notice.</li>
          <li>Duplicate payment was made for the same appointment.</li>
        </ul>
        <p className="lp-note">
          Note: These scenarios do not guarantee a refund. It is at the sole
          discretion of the doctor/clinic.
        </p>
      </Section>

      <Section title="4. No-Show Policy">
        If a patient does not arrive when their token is called and misses their
        slot, no refund will be issued — either by ClinicFlow or the clinic.
      </Section>

      <Section title="5. Payment Failures">
        If a payment fails during booking but your account was debited, the
        amount will be automatically reversed to your original payment method
        within <strong>5–7 business days</strong> by your bank or Razorpay.
        Contact us at{" "}
        <a className="lp-link" href="mailto:support@clinicflow.in">
          support@clinicflow.in
        </a>{" "}
        if it is not reversed within this period.
      </Section>

      <Section title="6. How to Raise a Concern">
        <ul className="lp-list">
          <li>
            For platform/technical payment issues:{" "}
            <a className="lp-link" href="mailto:support@clinicflow.in">
              support@clinicflow.in
            </a>
          </li>
          <li>For consultation fee disputes: Contact your clinic directly.</li>
          <li>ClinicFlow will assist in providing booking proof if needed.</li>
        </ul>
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="lp-card">
      <h3 className="lp-section-title">{title}</h3>
      <div className="lp-section-body">{children}</div>
    </div>
  );
}
