import React from "react";

const COLORS = {
  OPEN: "#b8860b",
  IN_PROGRESS: "#3457d5",
  RESOLVED: "#4c8f5f",
  CLOSED: "#666",
};

export default function StatusBadge({ status }) {
  const color = COLORS[status] || "#666";
  return (
    <span
      style={{
        fontSize: 12,
        fontWeight: 700,
        padding: "3px 10px",
        borderRadius: 6,
        color: "#fff",
        background: color,
      }}
    >
      {status}
    </span>
  );
}