import PriorityBadge from "./PriorityBadge";
import StatusBadge from "./StatusBadge";
import { relativeTime } from "../utils/formatTime";

export default function TicketCard({ ticket, isAdmin, onStatusChange }) {
  return (
    <div style={styles.card}>
      <div style={styles.top}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{ticket.title}</div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
            {ticket.description}
          </div>
        </div>
        <PriorityBadge priority={ticket.priority} />
      </div>

      <div style={styles.bottom}>
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
          {isAdmin && ticket.createdBy ? `${ticket.createdBy.name} · ` : ""}
          {relativeTime(ticket.createdAt)}
        </span>

        {isAdmin ? (
          <select
            value={ticket.status}
            onChange={(e) => onStatusChange(ticket.id, e.target.value)}
            style={styles.select}
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

const styles = {
  card: {
    background: "var(--panel)", borderRadius: "var(--radius)", color: "var(--text)",
    boxShadow: "var(--shadow)", padding: 18, marginBottom: 14,
  },
  top: { display: "flex", justifyContent: "space-between", gap: 16 },
  bottom: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 },
  select: {
    fontSize: 12, fontWeight: 600, border: "1px solid var(--border)",
    borderRadius: 8, padding: "6px 10px", background: "var(--bg)", color: "var(--text)",
  },
};