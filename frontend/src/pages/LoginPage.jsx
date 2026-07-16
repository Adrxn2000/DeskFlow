import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function LoginPage() {
  const [email, setEmail] = useState("employee@deskflow.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const profile = await login(email, password);
      navigate(profile.role === "ADMIN" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--bg)" }}>
      <button onClick={toggleTheme} style={{ position: "fixed", top: 20, right: 20, background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", fontSize: 13 }}>
  {theme === "light" ? "🌙" : "☀️"}
</button>
      <div style={{ width: 360, background: "var(--panel)", borderRadius: "var(--radius)", boxShadow: "var(--shadow)", padding: 32 }}>
        <h2 style={{ marginTop: 0 }}>DeskFlow Login</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 13, fontWeight: 600 }}>Email</label><br />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", marginTop: 4, border: "1px solid var(--border)", borderRadius: 9, fontSize: 14 }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 13, fontWeight: 600 }}>Password</label><br />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", marginTop: 4, border: "1px solid var(--border)", borderRadius: 9, fontSize: 14 }}
            />
          </div>
          {error && <p style={{ color: "var(--high)", fontSize: 13 }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: "11px 0", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, marginTop: 6 }}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
        <p style={{ fontSize: 12, marginTop: 16, color: "var(--text-muted)" }}>
          Demo: employee@deskflow.com / admin@deskflow.com, password: password123
        </p>
        <p style={{ fontSize: 13, marginTop: 12, textAlign: "center" }}>
          Don't have an account? <a href="/register">Sign up</a>
        </p>
      </div>
    </div>
  );
}