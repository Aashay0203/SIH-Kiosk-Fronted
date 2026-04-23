// === AdminHome.jsx ===
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import instance from "../api/axios";
import PinModal from "../components/PinModal";
import "./AdminHome.css";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function AdminHome() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedAppt, setSelectedAppt] = useState(null);

  useEffect(() => {
    fetchToday();
  }, []);

  const fetchToday = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError("");
      const res = await instance.get("/admin/today");
      setAppointments(res.data.appointments);
      setStats(res.data.stats);
    } catch {
      setError("Failed to load today's appointments.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCheckedIn = (appointmentId) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a._id === appointmentId ? { ...a, status: "arrived" } : a,
      ),
    );
    setStats((prev) => ({
      ...prev,
      arrived: (prev.arrived || 0) + 1,
      booked: Math.max((prev.booked || 0) - 1, 0),
    }));
  };

  const filtered = appointments.filter((a) => {
    const q = search.toLowerCase();
    return (
      a.patientId?.name?.toLowerCase().includes(q) ||
      String(a.appointmentNumber).includes(q) ||
      a.patientId?.phone?.toString().includes(q)
    );
  });

  const todayDisplay = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const statusConfig = {
    booked: { label: "Waiting", className: "ah-badge--waiting" },
    arrived: { label: "Arrived", className: "ah-badge--arrived" },
    served: { label: "Served", className: "ah-badge--served" },
  };

  if (loading) return <SkeletonLoader />;

  return (
    <div className="ah-page">
      <header className="ah-header">
        <div className="ah-header-left">
          <h1 className="ah-title">Reception Dashboard</h1>
          <p className="ah-date">{todayDisplay}</p>
        </div>

        <nav className="ah-header-actions" aria-label="Dashboard actions">
          <button
            className="ah-btn ah-btn--primary"
            onClick={() => navigate("/doctorSignup")}
            aria-label="Add new doctor"
          >
            <PersonAddIcon className="ah-btn-icon" />
            <span className="ah-btn-label">Add Doctor</span>
          </button>

          <button
            className={`ah-btn ah-btn--ghost ah-refresh-btn${refreshing ? " ah-refresh-btn--spinning" : ""}`}
            onClick={() => fetchToday(true)}
            aria-label="Refresh appointments"
            disabled={refreshing}
          >
            <RefreshIcon className="ah-btn-icon" />
          </button>

          <button
            className="ah-btn ah-btn--danger"
            onClick={() => {
              logout();
              navigate("/login");
            }}
            aria-label="Logout"
          >
            <LogoutIcon className="ah-btn-icon" />
            <span className="ah-btn-label">Logout</span>
          </button>
        </nav>
      </header>

      <div
        className="ah-stats-bar"
        role="region"
        aria-label="Today's statistics"
      >
        <div className="ah-stat">
          <p className="ah-stat-num">{stats.total ?? 0}</p>
          <p className="ah-stat-label">Total</p>
        </div>
        <div className="ah-stat">
          <p className="ah-stat-num ah-stat-num--waiting">
            {stats.booked ?? 0}
          </p>
          <p className="ah-stat-label">Waiting</p>
        </div>
        <div className="ah-stat">
          <p className="ah-stat-num ah-stat-num--arrived">
            {stats.arrived ?? 0}
          </p>
          <p className="ah-stat-label">Arrived</p>
        </div>
        <div className="ah-stat">
          <p className="ah-stat-num ah-stat-num--served">{stats.served ?? 0}</p>
          <p className="ah-stat-label">Served</p>
        </div>
      </div>

      <main className="ah-main">
        <div className="ah-search-wrap">
          <input
            className="ah-search"
            placeholder="Search by name, phone or token…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search appointments"
          />
        </div>

        {error && (
          <div className="ah-error" role="alert">
            <span>{error}</span>
            <button className="ah-error-retry" onClick={() => fetchToday()}>
              Retry
            </button>
          </div>
        )}

        <div className="ah-list" role="list" aria-label="Appointment cards">
          {filtered.length === 0 ? (
            <div className="ah-empty" role="status">
              <span className="ah-empty-icon">📭</span>
              <p className="ah-empty-title">No appointments found</p>
              <p className="ah-empty-sub">
                {search
                  ? "Try a different search term"
                  : "Today's schedule is clear"}
              </p>
              {search && (
                <button
                  className="ah-btn ah-btn--ghost ah-empty-cta"
                  onClick={() => setSearch("")}
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            filtered.map((appt) => {
              const sc = statusConfig[appt.status] || statusConfig.booked;
              return (
                <article
                  key={appt._id}
                  className={`ah-card ah-card--${appt.status}`}
                  role="listitem"
                >
                  <div className="ah-card-top">
                    <div className="ah-card-avatar" aria-hidden="true">
                      {appt.patientId?.name?.[0]?.toUpperCase() || "P"}
                    </div>
                    <div className="ah-card-info">
                      <p className="ah-card-name">
                        {appt.patientId?.name || "Patient"}
                      </p>
                      <p className="ah-card-phone">
                        {appt.patientId?.phone || "—"}
                      </p>
                    </div>
                    <span className={`ah-badge ${sc.className}`}>
                      {sc.label}
                    </span>
                  </div>

                  <div className="ah-card-meta">
                    <div className="ah-meta-chip">
                      <span className="ah-meta-label">Token</span>
                      <span className="ah-meta-value">
                        #{appt.appointmentNumber}
                      </span>
                    </div>
                    <div className="ah-meta-chip">
                      <span className="ah-meta-label">Doctor</span>
                      <span className="ah-meta-value">
                        {appt.doctorId?.name || "—"}
                      </span>
                    </div>
                    <div className="ah-meta-chip">
                      <span className="ah-meta-label">Payment</span>
                      <span className="ah-meta-value">
                        {appt.paymentStatus === "paid" ? "✅ Paid" : "💵 Cash"}
                      </span>
                    </div>
                  </div>

                  {appt.status === "booked" && (
                    <button
                      className="ah-checkin-btn"
                      onClick={() => setSelectedAppt(appt)}
                    >
                      Check In Patient
                    </button>
                  )}
                  {appt.status === "arrived" && (
                    <div className="ah-status-note ah-status-note--arrived">
                      ✅ Patient is at the clinic
                    </div>
                  )}
                  {appt.status === "served" && (
                    <div className="ah-status-note ah-status-note--served">
                      Consultation complete
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>
      </main>

      {selectedAppt && (
        <PinModal
          appointment={selectedAppt}
          onClose={() => setSelectedAppt(null)}
          onSuccess={handleCheckedIn}
        />
      )}
    </div>
  );
}

function SkeletonLoader() {
  return (
    <div className="ah-page" aria-busy="true" aria-label="Loading appointments">
      <div className="ah-skeleton-header">
        <div className="ah-skeleton ah-skeleton--title" />
        <div className="ah-skeleton ah-skeleton--date" />
      </div>
      <div className="ah-skeleton-stats">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="ah-skeleton-stat">
            <div className="ah-skeleton ah-skeleton--num" />
            <div className="ah-skeleton ah-skeleton--label" />
          </div>
        ))}
      </div>
      <div className="ah-main">
        <div className="ah-search-wrap">
          <div className="ah-skeleton ah-skeleton--search" />
        </div>
        <div className="ah-list">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="ah-skeleton-card">
              <div className="ah-skeleton-card-top">
                <div className="ah-skeleton ah-skeleton--avatar" />
                <div className="ah-skeleton-card-info">
                  <div className="ah-skeleton ah-skeleton--name" />
                  <div className="ah-skeleton ah-skeleton--phone" />
                </div>
                <div className="ah-skeleton ah-skeleton--badge" />
              </div>
              <div className="ah-skeleton-card-meta">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="ah-skeleton ah-skeleton--chip" />
                ))}
              </div>
              <div className="ah-skeleton ah-skeleton--btn" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
