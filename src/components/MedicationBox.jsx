import { useEffect, useState } from "react";
import instance from "../api/axios";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import "./MedicationBox.css";
import { useLanguage } from "../context/LanguageContext";

function MedicationBox() {
  const [meds, setMeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    fetchMed(1);
  }, []);

  useEffect(() => {
    fetchMed(1);

    // Calculate ms remaining until midnight IST
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istNow = new Date(now.getTime() + istOffset);

    const midnight = new Date(istNow);
    midnight.setUTCHours(18, 30, 0, 0); // 18:30 UTC = 12:00 AM IST next day

    // If midnight already passed today, set for next midnight
    if (istNow >= midnight) {
      midnight.setUTCDate(midnight.getUTCDate() + 1);
    }

    const msUntilMidnight = midnight.getTime() - now.getTime();

    // Reset all meds to pending at midnight IST
    const timer = setTimeout(async () => {
      try {
        await instance.patch("/medications/reset-daily");
        setMeds((prev) => prev.map((med) => ({ ...med, taken: false })));
      } catch (err) {
        console.log(err);
      }
    }, msUntilMidnight);

    return () => clearTimeout(timer);
  }, []);

  const fetchMed = async (pageNum = 1) => {
    try {
      setLoading(true);
      const res = await instance.get(`/medications?page=${pageNum}&limit=10`);
      const newMeds = res.data.data || [];
      const pagination = res.data.pagination;

      if (pageNum === 1) {
        setMeds(newMeds);
      } else {
        setMeds((prev) => [...prev, ...newMeds]);
      }

      if (pagination && pageNum >= pagination.totalPages) {
        setHasMore(false);
      } else if (newMeds.length < 10) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMed(nextPage);
    }
  };

  const toggleTaken = async (id, currentStatus) => {
    try {
      // Optimistic update — change UI instantly before API responds
      setMeds((prev) =>
        prev.map((med) =>
          med._id === id ? { ...med, taken: !currentStatus } : med,
        ),
      );
      await instance.patch(`/medications/${id}`, { taken: !currentStatus });
    } catch (err) {
      // Revert if API fails
      setMeds((prev) =>
        prev.map((med) =>
          med._id === id ? { ...med, taken: currentStatus } : med,
        ),
      );
      console.log(err);
    }
  };

  if (loading) return <p style={{ padding: "16px", color: "var(--text-muted)" }}>{t("loading", "Loading...")}</p>;

  return (
    <div className="med-box">
      <div className="med-box-header">
        <h3 className="med-box-title">{t("medicationSchedule", "Medication Schedule")}</h3>
      </div>
      <List>
        {meds.map((med) => (
          <ListItem key={med._id} className="med-item">
            <ListItemAvatar>
              <Avatar className="med-avatar">💊</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={`${med.name} — ${med.dosage}`}
              secondary={med.time}
            />
            <button
              className={`med-badge ${med.taken ? "taken" : "pending"}`}
              onClick={() => toggleTaken(med._id, med.taken)}
            >
              {med.taken ? t("taken", "✓ Taken") : t("pending", "Pending")}
            </button>
          </ListItem>
        ))}
      </List>

      {hasMore && meds.length > 0 && (
        <button 
          className="load-more-btn"
          onClick={loadMore} 
          disabled={loading}
        >
          {loading ? t("loading", "Loading...") : t("loadMore", "Load More")}
        </button>
      )}
    </div>
  );
}

export default MedicationBox;
