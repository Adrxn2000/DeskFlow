import React, { useEffect, useState, useCallback, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import TicketList from "../components/TicketList";
import * as ticketApi from "../api/ticketApi";

export default function AdminDashboardPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  async function handleStatusChange(id, status) {
    const previous = tickets;
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    try {
      await ticketApi.updateTicketStatus(id, status);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update ticket");
      setTickets(previous);
    }
  }

  const counts = useMemo(() => ({
    total: tickets.length,
    open: tickets.filter((t) => t.status === "OPEN").length,
    inProgress: tickets.filter((t) => t.status === "IN_PROGRESS").length,
    resolved: tickets.filter((t) => t.status === "RESOLVED").length,
  }), [tickets]);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ marginLeft: 240, padding: "32px 40px", flex: 1 }}>
        <h1 style={{ fontSize: 24, marginBottom: 4 }}>All Tickets</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 24 }}>
          Company-wide feed — update status as work progresses.
        </p>

        <div style={{ display: "flex", gap: 16, marginBottom: 28 }}>
          <StatCard label="Total" value={counts.total} color="var(--accent)" bg="var(--accent-soft)" />
          <StatCard label="Open" value={counts.open} color="var(--open)" bg="var(--open-bg)" />
          <StatCard label="In Progress" value={counts.inProgress} color="var(--progress)" bg="var(--progress-bg)" />
          <StatCard label="Resolved" value={counts.resolved} color="var(--resolved)" bg="var(--resolved-bg)" />
        </div>

        <TicketList tickets={tickets} loading={loading} error={error} isAdmin onStatusChange={handleStatusChange} />
      </main>
    </div>
  );
}