// === AppointmentBook.jsx ===
import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import instance from "../api/axios";
import "./AppointmentBook.css";
import timeUtils from "../utils/TimeUtils.jsx";
import { CalendarIcon } from "../utils/Icon";

const ACTIVE_DAYS = [1, 2, 3, 4, 5, 6];
const DAYS_TO_SHOW = 7;
const { getAllActiveDates } = timeUtils;

// ── Skeleton Components ────────────────────────────────────
function DoctorHeaderSkeleton() {
  return (
    <div
      className="ab-header-card"
      aria-busy="true"
      aria-label="Loading doctor details"
    >
      <div className="ab-skeleton ab-skeleton--back" />
      <div className="ab-profile-top">
        <div className="ab-profile-text">
          <div className="ab-skeleton ab-skeleton--name" />
          <div className="ab-skeleton ab-skeleton--spec" />
          <div className="ab-skeleton ab-skeleton--price" />
        </div>
        <div className="ab-skeleton ab-skeleton--avatar" />
      </div>
      <div className="ab-vitals-grid">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="ab-vital-card">
            <div className="ab-skeleton ab-skeleton--vital-val" />
            <div className="ab-skeleton ab-skeleton--vital-lbl" />
          </div>
        ))}
      </div>
    </div>
  );
}

function TokenSkeleton() {
  return (
    <div
      className="ab-token-card"
      aria-busy="true"
      aria-label="Loading token info"
    >
      <div className="ab-vitals-grid">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="ab-vital-card">
            <div className="ab-skeleton ab-skeleton--vital-val" />
            <div className="ab-skeleton ab-skeleton--vital-lbl" />
          </div>
        ))}
      </div>
      <div className="ab-skeleton ab-skeleton--note" />
    </div>
  );
}

// ── Spinner ────────────────────────────────────────────────
function Spinner({ size = 18 }) {
  return (
    <span
      className="ab-spinner"
      role="status"
      aria-label="Loading"
      style={{ width: size, height: size }}
    />
  );
}

// ── Main Component ─────────────────────────────────────────
export default function AppointmentBook({ activeDays = ACTIVE_DAYS }) {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const allActiveDates = useMemo(
    () => getAllActiveDates(activeDays),
    [activeDays],
  );
  const [selectedDate, setSelectedDate] = useState(null);

  const [tokenInfo, setTokenInfo] = useState(null);
  const [tokenLoading, setTokenLoading] = useState(false);
  const [tokenError, setTokenError] = useState(false);

  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState("");

  // Fetch doctor
  useEffect(() => {
    if (!doctorId) return;
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await instance.get(`/doctors/${doctorId}`);
        setDoctor(res.data.details || res.data);
      } catch {
        setError("Could not load doctor details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [doctorId]);

  // Seed first date
  useEffect(() => {
    if (allActiveDates.length > 0 && !selectedDate) {
      setSelectedDate(allActiveDates[0]);
    }
  }, [allActiveDates, selectedDate]);

  // Fetch token count
  useEffect(() => {
    if (!selectedDate || !doctorId) return;
    const fetchTokenCount = async () => {
      try {
        setTokenLoading(true);
        setTokenInfo(null);
        setTokenError(false);
        const res = await instance.get(
          `/appointments/token-count?doctorId=${doctorId}&date=${selectedDate.isoDate}`,
        );
        setTokenInfo(res.data);
      } catch {
        setTokenInfo(null);
        setTokenError(true);
      } finally {
        setTokenLoading(false);
      }
    };
    fetchTokenCount();
  }, [selectedDate, doctorId]);

  const handleBook = async () => {
    console.log("I am at Handel book");
    if (!selectedDate) return;
    setIsBooking(true);
    setBookingError("");
    try {
      const payload = {
        doctorId,
        date: selectedDate.isoDate,
        slotTime: "00:00",
      };
      console.log("Payload",payload);
      const res = await instance.post("/appointments/book", payload);
      console.log(res,"RES");
      console.log("📦 Book response:", res.data);
      navigate("/payment", {
        state: {
          appointmentId: res.data.appointmentId,
          orderId: res.data.orderId,
          paymentSessionId: res.data.paymentSessionId,
          fees: res.data.fees,
          doctorName: doctor?.name,
          dateDisplay: `${selectedDate.day} ${selectedDate.month} ${selectedDate.year}`,
          timeDisplay: `Token #${tokenInfo?.nextToken || "—"}`,
        },
      });
    } catch (err) {
      console.log(err);
      setBookingError(
        err?.response?.data?.message || "Booking failed. Please try again.",
      );
    } finally {
      setIsBooking(false);
    }
  };

  const formatWait = (mins) => {
    if (!mins && mins !== 0) return "—";
    if (mins >= 60) return `${Math.floor(mins / 60)}h ${mins % 60}m`;
    return `${mins}m`;
  };

  const today = new Date().toISOString().split("T")[0];
  const canBook = selectedDate && tokenInfo && !isBooking && !tokenLoading;

  // ── Error State ────────────────────────────────────────
  if (error) {
    return (
      <main className="ab-page">
        <div className="ab-state-screen">
          <span className="ab-state-emoji" role="img" aria-label="Error">
            😓
          </span>
          <h2 className="ab-state-title">Couldn't load doctor</h2>
          <p className="ab-state-body">
            There was a problem fetching doctor details. Please try again.
          </p>
          <button
            className="ab-cta-btn ab-cta-btn--active"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="ab-page">
      {/* ── Doctor Header ── */}
      {loading ? (
        <DoctorHeaderSkeleton />
      ) : (
        <div className="ab-header-card">
          <button
            className="ab-back-btn"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            ← Back
          </button>

          <div className="ab-profile-top">
            <div className="ab-profile-text">
              <h1 className="ab-doctor-name">{doctor?.name}</h1>
              <p className="ab-doctor-spec">{doctor?.speciality}</p>
              <p className="ab-session-price">₹{doctor?.fees} / Session</p>
            </div>
            <div className="ab-avatar-frame">
              <img
                src={
                  doctor?.image ||
                  "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/45.png"
                }
                alt={doctor?.name || "Doctor"}
                className="ab-avatar"
                onError={(e) => {
                  e.target.src =
                    "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/45.png";
                }}
              />
            </div>
          </div>

          <div
            className="ab-vitals-grid"
            role="list"
            aria-label="Doctor statistics"
          >
            <div className="ab-vital-card" role="listitem">
              <p className="ab-vital-val">
                {doctor?.experience ? `${doctor.experience}y+` : "—"}
              </p>
              <p className="ab-vital-lbl">Experience</p>
            </div>
            <div className="ab-vital-card" role="listitem">
              <p className="ab-vital-val">
                {doctor?.totalPatients ? `${doctor.totalPatients}+` : "—"}
              </p>
              <p className="ab-vital-lbl">Patients</p>
            </div>
            <div className="ab-vital-card" role="listitem">
              <p className="ab-vital-val">
                {doctor?.totalReviews ? `${doctor.totalReviews}+` : "—"}
              </p>
              <p className="ab-vital-lbl">Reviews</p>
            </div>
            <div
              className="ab-vital-card ab-vital-card--rating"
              role="listitem"
            >
              <div className="ab-rating-group">
                <p className="ab-vital-val">{doctor?.rating ?? "—"}</p>
                <span aria-label="star" role="img">
                  ⭐
                </span>
              </div>
              <p className="ab-vital-lbl">Rating</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Booking Panel ── */}
      <section className="ab-panel" aria-label="Appointment booking">
        {/* ── Date Section ── */}
        <div className="ab-section">
          <div className="ab-section-header">
            <CalendarIcon aria-hidden="true" />
            <h2 className="ab-section-label">Choose a date</h2>
          </div>

          {selectedDate && (
            <p className="ab-month-context" aria-live="polite">
              {allActiveDates[0]?.month} {allActiveDates[0]?.year}
            </p>
          )}

          <div className="ab-date-row" role="group" aria-label="Date selection">
            {allActiveDates.slice(0, DAYS_TO_SHOW).map((item) => {
              const isSelected = selectedDate?.isoDate === item.isoDate;
              const isToday = item.isoDate === today;
              return (
                <button
                  key={item.isoDate}
                  className={`ab-date-btn${isSelected ? " ab-date-btn--selected" : ""}${isToday ? " ab-date-btn--today" : ""}`}
                  onClick={() => setSelectedDate(item)}
                  aria-pressed={isSelected}
                  aria-label={`${item.weekday} ${item.day} ${item.month}${isToday ? ", today" : ""}`}
                >
                  <span className="ab-date-weekday">{item.weekday}</span>
                  <span className="ab-date-num">{item.day}</span>
                  {isToday && (
                    <span className="ab-today-dot" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Token Section ── */}
        {selectedDate && (
          <div
            className="ab-section"
            aria-live="polite"
            aria-label="Token information"
          >
            <h2 className="ab-section-label">Appointment Token</h2>

            {tokenLoading ? (
              <TokenSkeleton />
            ) : tokenError ? (
              <div className="ab-token-error">
                <span
                  role="img"
                  aria-label="Error"
                  className="ab-token-error__emoji"
                >
                  🔌
                </span>
                <p className="ab-token-error__msg">Couldn't fetch slot info</p>
                <button
                  className="ab-retry-btn"
                  onClick={() => setSelectedDate({ ...selectedDate })}
                >
                  Retry
                </button>
              </div>
            ) : tokenInfo ? (
              <div className="ab-token-card">
                <div
                  className="ab-vitals-grid"
                  role="list"
                  aria-label="Token details"
                >
                  <div className="ab-vital-card" role="listitem">
                    <p className="ab-vital-val">#{tokenInfo.nextToken}</p>
                    <p className="ab-vital-lbl">Your Token</p>
                  </div>
                  <div className="ab-vital-card" role="listitem">
                    <p className="ab-vital-val">{tokenInfo.bookedCount}</p>
                    <p className="ab-vital-lbl">Booked</p>
                  </div>
                  <div className="ab-vital-card" role="listitem">
                    <p className="ab-vital-val">
                      {formatWait(tokenInfo.approxWaitMinutes)}
                    </p>
                    <p className="ab-vital-lbl">Approx Wait</p>
                  </div>
                  <div
                    className="ab-vital-card ab-vital-card--time"
                    role="listitem"
                  >
                    <p className="ab-vital-val">
                      {tokenInfo.appointmentStartTime || "—"}
                    </p>
                    <p className="ab-vital-lbl">Your Time</p>
                  </div>
                </div>
                <p className="ab-clinic-note">
                  💡 Clinic starts at {tokenInfo.startTime || doctor?.startTime}
                  . Your appointment is expected around{" "}
                  <strong>{tokenInfo.appointmentStartTime}</strong>.
                </p>
              </div>
            ) : null}
          </div>
        )}

        {/* ── Booking Error ── */}
        {bookingError && (
          <div className="ab-booking-error" role="alert">
            {bookingError}
          </div>
        )}

        {/* ── CTA ── */}
        <button
          className={`ab-book-btn${canBook ? " ab-book-btn--active" : ""}`}
          disabled={!canBook}
          onClick={handleBook}
          aria-busy={isBooking}
          aria-disabled={!canBook}
        >
          {isBooking ? (
            <>
              <Spinner size={16} />
              <span>Booking…</span>
            </>
          ) : canBook ? (
            `Book Token #${tokenInfo.nextToken} · ${selectedDate.day} ${selectedDate.month}`
          ) : (
            "Select a date to book"
          )}
        </button>
      </section>
    </main>
  );
}
