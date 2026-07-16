import React from "react";

export default function StatCard({ label, value, color, bg }) {
  return (
    <div style={{
      background: "var(--panel)", borderRadius: "var(--radius)",
      boxShadow: "var(--shadow)", padding: "18px 20px", flex: 1,
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 9, background: bg,
        display: "grid", placeItems: "center", marginBottom: 12,
      }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
      </div>
      <div style={{ fontSize: 24, fontWeight: 800 }}>{value}</div>
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{label}</div>
    </div>
  );
}