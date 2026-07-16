import React from "react";


const MAP = {
  LOW: ["var(--low)", "var(--low-bg)"],
  MEDIUM: ["var(--medium)", "var(--medium-bg)"],
  HIGH: ["var(--high)", "var(--high-bg)"],
  URGENT: ["var(--high)", "var(--high-bg)"],
};
export default function PriorityBadge({ priority }) {
  const [color, bg] = MAP[priority] || ["#666", "#eee"];
  return (
    <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 999, color, background: bg }}>
      {priority}
    </span>
  );
}