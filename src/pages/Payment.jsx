import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import instance from "../api/axios";
import { SuccessOverlay } from "../components/PaymentUtils";
import { loadCashfreeScript } from "../utils/paymentScript";
import { useLanguage } from "../context/LanguageContext";
import { playTap, playSuccess } from "../utils/audioFX";
import { fireCelebrationConfetti } from "../utils/confettiFX";
import { toast } from "sonner";
import "./Payment.css";
import {
  CreditCardIcon,
  WalletIcon,
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  ShieldIcon,
} from "../utils/Icon";

// ─────────────────────────────────────────────
//  PAYMENT METHODS CONFIG
// ─────────────────────────────────────────────

/** Format ₹ display string — Cashfree uses actual rupees, not paise */
const formatAmount = (amount) =>
  `₹${Number(amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

const PAYMENT_METHODS = [
  {
    id: "cashfree",
    label: "Pay Online",
    sublabel: "Cards, UPI, Netbanking & more",
    Icon: CreditCardIcon,
  },
  {
    id: "cash",
    label: "Cash on Visit",
    sublabel: "Pay at the clinic",
    Icon: WalletIcon,
  },
];

// ─────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  // ── Pull state passed from AppointmentBook ──
  const {
    appointmentId,
    orderId,
    paymentSessionId,
    fees,
    doctorName,
    dateDisplay,
    timeDisplay,
  } = location.state || {};

  // ── Guard ─────────────────────────────────
  useEffect(() => {
    if (!paymentSessionId || !appointmentId) {
      navigate("/", { replace: true });
    }
  }, [paymentSessionId, appointmentId, navigate]);

  // ── State ─────────────────────────────────
  const [selectedMethod, setSelectedMethod] = useState("cashfree");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMethod, setSuccessMethod] = useState("");
  const [rawPin, setRawPin] = useState("");
  const [appointmentNumber, setAppointmentNumber] = useState(null);

  // ── CASHFREE ONLINE FLOW ──────────────────
  const handleCashfree = async () => {
    setError("");
    setLoading(true);

    const loaded = await loadCashfreeScript();
    if (!loaded) {
      setError(
        "Failed to load payment gateway. Check your internet connection.",
      );
      setLoading(false);
      return;
    }

    try {
      const cashfree = window.Cashfree({
        mode: import.meta.env.VITE_CASHFREE_ENV || "sandbox",
      });

      const result = await cashfree.checkout({
        paymentSessionId,
        redirectTarget: "_modal",
      });

      if (result.error) {
        setError(result.error.message || "Payment failed. Please try again.");
        setLoading(false);
        return;
      }

      // Payment done — verify server-side
      const res = await instance.post("/payment/verify", { orderId });
      setRawPin(res.data.rawPin);
      setAppointmentNumber(res.data.appointmentNumber);
      setSuccessMethod("cashfree");
      setShowSuccess(true);
      playSuccess();
      fireCelebrationConfetti();
      toast.success("Payment Successful! Token Generated.");
    } catch (err) {
      console.error("Cashfree payment failed:", err);
      setError(
        err?.response?.data?.message ||
          "Payment received but verification failed. Please contact support.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ── CASH ON VISIT FLOW ────────────────────
  const handleCash = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await instance.post("/payment/cash-confirm", {
        appointmentId,
      });
      setRawPin(res.data.rawPin);
      setAppointmentNumber(res.data.appointmentNumber);
      setSuccessMethod("cash");
      setShowSuccess(true);
      playSuccess();
      fireCelebrationConfetti();
      toast.success("Appointment Confirmed at Clinic!");
    } catch (err) {
      console.error("Cash confirm failed:", err);
      setError(
        err?.response?.data?.message ||
          "Could not confirm appointment. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ── PAY BUTTON HANDLER ────────────────────
  const handlePay = () => {
    playTap();
    if (selectedMethod === "cashfree") handleCashfree();
    else if (selectedMethod === "cash") handleCash();
  };

  // ── AFTER SUCCESS ─────────────────────────
  const handleDone = () => navigate("/my-appointments", { replace: true });

  // ── RENDER ────────────────────────────────
  if (!paymentSessionId || !appointmentId) return null;

  return (
    <div className="payment-page">
      {showSuccess && (
        <SuccessOverlay
          method={successMethod}
          onDone={handleDone}
          rawPin={rawPin}
          appointmentNumber={appointmentNumber}
          doctorName={doctorName}
          dateDisplay={dateDisplay}
        />
      )}

      <div className="payment-container">
        {/* ── Header ── */}
        <button className="pay-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeftIcon /> Back
        </button>

        <h1 className="pay-title">Complete Payment</h1>

        {/* ── Order Summary Card ── */}
        <div className="order-summary-card">
          <p className="order-label">Appointment Summary</p>

          <div className="order-row">
            <span className="order-row-key">Doctor</span>
            <span className="order-row-val">{doctorName || "—"}</span>
          </div>

          <div className="order-row">
            <span className="order-row-key">
              <CalendarIcon /> Date
            </span>
            <span className="order-row-val">{dateDisplay || "—"}</span>
          </div>

          <div className="order-row">
            <span className="order-row-key">
              <ClockIcon /> Time
            </span>
            <span className="order-row-val">{timeDisplay || "—"}</span>
          </div>

          <div className="order-divider" />

          <div className="order-row total-row">
            <span className="order-row-key">Total</span>
            <span className="order-amount">{formatAmount(fees)}</span>
          </div>

          <p className="order-receipt-id">Order ID: {orderId}</p>
        </div>

        {/* ── Payment Method Selector ── */}
        <div className="method-section">
          <p className="method-section-label">Select Payment Method</p>

          <div className="method-list">
            {PAYMENT_METHODS.map(({ id, label, sublabel, Icon }) => (
              <button
                key={id}
                className={`method-item ${selectedMethod === id ? "selected" : ""}`}
                onClick={() => {
                  setSelectedMethod(id);
                  setError("");
                }}
              >
                <div className="method-icon-wrap">
                  <Icon />
                </div>
                <div className="method-text">
                  <span className="method-label">{label}</span>
                  <span className="method-sublabel">{sublabel}</span>
                </div>
                <div className="method-radio">
                  {selectedMethod === id && (
                    <div className="method-radio-dot" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Error ── */}
        {error && <div className="pay-error-msg">{error}</div>}

        {/* ── Pay CTA ── */}
        <button
          className={`pay-cta-btn ${selectedMethod ? "active" : ""}`}
          onClick={handlePay}
          disabled={loading || !selectedMethod}
        >
          {loading
            ? "Processing…"
            : selectedMethod === "cash"
              ? "Confirm — Pay at Clinic"
              : `Pay ${formatAmount(fees)}`}
        </button>

        {/* ── Trust Badge ── */}
        <div className="trust-badge">
          <ShieldIcon />
          <span>256-bit SSL secured · Powered by Cashfree</span>
        </div>
      </div>
    </div>
  );
}
