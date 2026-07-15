import React from "react";
import PriorityBadge from "./PriorityBadge";
import StatusBadge from "./StatusBadge";

export default function TicketCard({ ticket, isAdmin, onStatusChange }) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <strong>{ticket.title}</strong>
        <PriorityBadge priority={ticket.priority} />
      </div>

      <p style={{ color: "#555", fontSize: 14 }}>{ticket.description}</p>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "#888" }}>
          {isAdmin && ticket.createdBy ? `${ticket.createdBy.name} · ` : ""}
          {new Date(ticket.createdAt).toLocaleString()}
        </span>

        {isAdmin ? (
          <select
            value={ticket.status}
            onChange={(e) => onStatusChange(ticket.id, e.target.value)}
          >
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        ) : (
          <StatusBadge status={ticket.status} />
        )}
      </div>
    </div>
  );
}