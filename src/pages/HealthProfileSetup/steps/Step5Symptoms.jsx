import { Typography, Chip } from "@mui/material";
import "./Step5Symptoms.css";

const SYMPTOM_OPTIONS = [
  "Fatigue",
  "Hair Loss",
  "Breathlessness",
  "Chest Pain",
  "Frequent Urination",
  "Excessive Thirst",
  "Weight Loss",
  "Weight Gain",
  "Headaches",
  "Joint Pain",
  "Back Pain",
  "Blurred Vision",
  "Nausea",
  "Swelling in legs",
  "Poor Sleep",
  "Anxiety",
  "Low Mood",
  "Brain Fog",
  "Irregular Heartbeat",
];

export default function Step5Symptoms({ data, onChange }) {
  const toggle = (symptom) => {
    if (data.includes(symptom)) {
      onChange(data.filter((s) => s !== symptom));
    } else {
      onChange([...data, symptom]);
    }
  };

  return (
    <div className="step5-root">
      <Typography className="hps-step-desc">
        Select any symptoms you are currently experiencing.
      </Typography>

      <div className="hps-card step5-symptoms-card">
        <Typography className="hps-card-title">Current Symptoms</Typography>
        <div className="hps-chips-list">
          {SYMPTOM_OPTIONS.map((symptom) => (
            <Chip
              key={symptom}
              label={symptom}
              onClick={() => toggle(symptom)}
              className={`hps-symptom-chip step5-symptom-chip${data.includes(symptom) ? " step5-symptom-chip--selected" : ""}`}
            />
          ))}
        </div>
      </div>

      {data.length > 0 && (
        <div className="step5-selected-note">
          <div className="step5-count-pill">
            <span className="step5-count-number">{data.length}</span>
            <span className="step5-count-label">
              symptom{data.length > 1 ? "s" : ""} selected
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
