import { useEffect, useState, useCallback, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import TicketList from "../components/TicketList";
import * as ticketApi from "../api/ticketApi";

export default function AdminDashboardPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [search, setSearch] = useState("");

  const loadTickets = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      setTickets(await ticketApi.fetchTickets(params));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: fetch tickets on mount / filter change
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

  const visibleTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchesPriority = !priorityFilter || t.priority === priorityFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch = !q || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.createdBy?.name?.toLowerCase().includes(q);
      return matchesPriority && matchesSearch;
    });
  }, [tickets, priorityFilter, search]);

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

        <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
          <input
            placeholder="Search by title, description, or reporter..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 220, padding: "9px 13px", border: "1px solid var(--border)", borderRadius: 9, fontSize: 14, background: "var(--panel)", color: "var(--text)" }}
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selectStyle}>
            <option value="">All statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} style={selectStyle}>
            <option value="">All priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        <TicketList
          tickets={visibleTickets}
          loading={loading}
          error={error}
          isAdmin
          onStatusChange={handleStatusChange}
          emptyMessage={search || priorityFilter ? "No tickets match your filters." : undefined}
        />
      </main>
    </div>
  );
}

const selectStyle = {
  padding: "9px 13px", border: "1px solid var(--border)", borderRadius: 9,
  fontSize: 14, background: "var(--panel)", color: "var(--text)",
};