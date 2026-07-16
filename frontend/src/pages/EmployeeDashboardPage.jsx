import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import TicketForm from "../components/TicketForm";
import TicketList from "../components/TicketList";
import * as ticketApi from "../api/ticketApi";

export default function EmployeeDashboardPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadTickets = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setTickets(await ticketApi.fetchTickets());
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTickets(); }, [loadTickets]);

  async function handleCreate(form) {
    setSubmitting(true);
    try {
      const ticket = await ticketApi.createTicket(form);
      setTickets((prev) => [ticket, ...prev]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create ticket");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ marginLeft: 240, padding: "32px 40px", flex: 1 }}>
        <h1 style={{ fontSize: 24, marginBottom: 4 }}>My Tickets</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 24 }}>
          Track and submit your IT support requests.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, alignItems: "start" }}>
          <TicketList tickets={tickets} loading={loading} error={error} isAdmin={false} />
          <TicketForm onSubmit={handleCreate} submitting={submitting} />
        </div>
      </main>
    </div>
  );
}