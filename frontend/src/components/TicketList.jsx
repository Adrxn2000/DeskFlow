import React from "react";
import TicketCard from "./TicketCard";

export default function TicketList({ tickets, loading, error, isAdmin, onStatusChange }) {
  if (loading) return <p>Loading tickets...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (tickets.length === 0) return <p>No tickets yet.</p>;

  return (
    <div>
      {tickets.map((ticket) => (
        <TicketCard
          key={ticket.id}
          ticket={ticket}
          isAdmin={isAdmin}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}