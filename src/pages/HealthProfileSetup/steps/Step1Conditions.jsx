import { Typography, Switch } from "@mui/material";
import "./Step1Conditions.css";

const CONDITIONS = [
  {
    key: "diabetes",
    label: "Diabetes",
    desc: "Type 1, Type 2, or Pre-diabetic",
    index: 0,
  },
  {
    key: "hypertension",
    label: "High Blood Pressure",
    desc: "Hypertension or on BP medication",
    index: 1,
  },
  {
    key: "thyroid",
    label: "Thyroid Disorder",
    desc: "Hypothyroid or Hyperthyroid",
    index: 2,
  },
];

export default function Step1Conditions({ data, onChange }) {
  const toggle = (key) => onChange({ ...data, [key]: !data[key] });

  return (
    <div className="step1-root">
      <Typography className="hps-step-desc">
        Select any conditions you have been diagnosed with.
      </Typography>

      <div className="hps-card step1-conditions-card">
        {CONDITIONS.map(({ key, label, desc, index }) => (
          <div
            className={`hps-check-row step1-condition-row${data[key] ? " step1-condition-row--active" : ""}`}
            key={key}
            style={{ "--row-index": index }}
          >
            <div className="step1-label-group">
              <Typography className="hps-check-label">{label}</Typography>
              <Typography className="step1-check-desc">{desc}</Typography>
            </div>
            <Switch
              checked={!!data[key]}
              onChange={() => toggle(key)}
              color="primary"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
