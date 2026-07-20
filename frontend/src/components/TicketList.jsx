import React from "react";
import TicketCard from "./TicketCard";

export default function TicketList({ tickets, loading, error, isAdmin, onStatusChange, emptyMessage }) {
  if (loading) {
    return (
      <div>
        {[1, 2, 3].map((i) => (
          <div key={i} style={skeletonStyles.card}>
            <div style={{ ...skeletonStyles.bar, width: "60%", height: 14 }} />
            <div style={{ ...skeletonStyles.bar, width: "90%", height: 12, marginTop: 10 }} />
            <div style={{ ...skeletonStyles.bar, width: "40%", height: 12, marginTop: 8 }} />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: "var(--high-bg)", color: "var(--high)", borderRadius: "var(--radius)", padding: 16, fontSize: 14 }}>
        {error}
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div style={{ background: "var(--panel)", border: "1px dashed var(--border)", borderRadius: "var(--radius)", padding: 40, textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>{isAdmin ? "🎉" : "📋"}</div>
        <p style={{ margin: 0, fontWeight: 700 }}>
          {isAdmin ? "You're all caught up" : "No tickets yet"}
        </p>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-muted)" }}>
          {emptyMessage || (isAdmin ? "Nothing needs attention right now." : "Submit your first request using the form.")}
        </p>
      </div>
    );
  }

  return (
    <div>
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} isAdmin={isAdmin} onStatusChange={onStatusChange} />
      ))}
    </div>
  );
}

const skeletonStyles = {
  card: { background: "var(--panel)", borderRadius: "var(--radius)", boxShadow: "var(--shadow)", padding: 18, marginBottom: 14 },
  bar: { background: "var(--border)", borderRadius: 6, animation: "pulse 1.5s ease-in-out infinite" },
};