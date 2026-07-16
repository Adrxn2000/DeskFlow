import React, { useState } from "react";

const initialState = { title: "", description: "", priority: "MEDIUM" };

export default function TicketForm({ onSubmit, submitting }) {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      setError("Title and description are required");
      return;
    }
    setError("");
    await onSubmit(form);
    setForm(initialState);
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: "var(--panel)", borderRadius: "var(--radius)", boxShadow: "var(--shadow)", padding: 22 }}>
      <h3>Submit a new request</h3>

      <label>Title</label><br />
      <input
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        style={{ width: "100%", padding: "10px 12px", marginBottom: 12, border: "1px solid var(--border)", borderRadius: 9, fontSize: 14 }}
      /><br />

      <label>Description</label><br />
      <textarea
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        style={{ width: "100%", padding: "10px 12px", marginBottom: 12, border: "1px solid var(--border)", borderRadius: 9, fontSize: 14, minHeight: 80 }}
      /><br />

      <label>Priority</label><br />
      <select
        value={form.priority}
        onChange={(e) => setForm({ ...form, priority: e.target.value })}
        style={{ width: "100%", padding: "10px 12px", marginBottom: 12, border: "1px solid var(--border)", borderRadius: 9, fontSize: 14 }}
      >
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
      </select><br />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit" disabled={submitting} style={{ marginTop: 4, width: "100%", padding: "11px 0", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14 }}>
        {submitting ? "Submitting..." : "Submit request"}
      </button>
    </form>
  );
}