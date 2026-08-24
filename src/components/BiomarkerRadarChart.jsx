import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function BiomarkerRadarChart({ data }) {
  const defaultData = [
    { subject: "Cardiac", value: 92, fullMark: 100 },
    { subject: "Pulmonary", value: 85, fullMark: 100 },
    { subject: "Hepatic", value: 78, fullMark: 100 },
    { subject: "Renal", value: 95, fullMark: 100 },
    { subject: "Metabolic", value: 88, fullMark: 100 },
    { subject: "Immunity", value: 90, fullMark: 100 },
  ];

  const chartData = data || defaultData;

  return (
    <div style={{ width: "100%", height: 240, position: "relative" }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
          <PolarGrid stroke="rgba(56, 189, 248, 0.2)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "var(--text-secondary, #94a3b8)", fontSize: 11, fontWeight: 700 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />
          <Radar
            name="Biomarker Health Index"
            dataKey="value"
            stroke="#38bdf8"
            fill="url(#radarGradient)"
            fillOpacity={0.6}
          />
          <defs>
            <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#2563eb" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card-bg, #151e2e)",
              borderColor: "var(--border, #243044)",
              borderRadius: "10px",
              color: "#f1f5f9",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
