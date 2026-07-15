import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import TicketList from "../components/TicketList";
import * as ticketApi from "../api/ticketApi";

export default function AdminDashboardPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const loadTickets = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await ticketApi.fetchTickets();
      setTickets(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

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

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>All Tickets (Admin)</h2>
        <div>
          <span style={{ marginRight: 12 }}>{user?.name}</span>
          <button onClick={handleLogout}>Log out</button>
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <TicketList
          tickets={tickets}
          loading={loading}
          error={error}
          isAdmin
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
}