// StatusBadge.jsx
import React from "react";


const MAP = {
  OPEN: ["var(--open)", "var(--open-bg)"],
  IN_PROGRESS: ["var(--progress)", "var(--progress-bg)"],
  RESOLVED: ["var(--resolved)", "var(--resolved-bg)"],
  CLOSED: ["#666", "#eee"],
};
export default function StatusBadge({ status }) {
  const [color, bg] = MAP[status] || ["#666", "#eee"];
  return (
    <span style={{ fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 999, color, background: bg }}>
      {status.replace("_", " ")}
    </span>
  );
}