import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import TicketForm from "../components/TicketForm";
import TicketList from "../components/TicketList";
import * as ticketApi from "../api/ticketApi";

export default function EmployeeDashboardPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
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

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>My Tickets</h2>
        <div>
          <span style={{ marginRight: 12 }}>{user?.name}</span>
          <button onClick={handleLogout}>Log out</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>
        <TicketList tickets={tickets} loading={loading} error={error} isAdmin={false} />
        <TicketForm onSubmit={handleCreate} submitting={submitting} />
      </div>
    </div>
  );
}