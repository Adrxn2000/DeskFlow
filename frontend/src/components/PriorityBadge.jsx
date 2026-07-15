import React from "react";

const COLORS = {
  LOW: "#4c8f5f",
  MEDIUM: "#b8860b",
  HIGH: "#c53030",
  URGENT: "#c53030",
};

export default function PriorityBadge({ priority }) {
  const color = COLORS[priority] || "#666";
  return (
    <span
      style={{
        fontSize: 12,
        fontWeight: 600,
        padding: "3px 10px",
        borderRadius: 12,
        color: "#fff",
        background: color,
      }}
    >
      {priority}
    </span>
  );
}