import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("EMPLOYEE");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const profile = await register(name, email, password, role);
      navigate(profile.role === "ADMIN" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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
        <h2 style={{ marginTop: 0 }}>Create an account</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 13, fontWeight: 600 }}>Full name</label><br />
            <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 13, fontWeight: 600 }}>Email</label><br />
            <input value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 13, fontWeight: 600 }}>Password</label><br />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 13, fontWeight: 600 }}>Account type</label><br />
            <select value={role} onChange={(e) => setRole(e.target.value)} style={inputStyle}>
              <option value="EMPLOYEE">Employee</option>
              <option value="ADMIN">IT Admin</option>
            </select>
          </div>

          {error && <p style={{ color: "var(--high)", fontSize: 13 }}>{error}</p>}

          <button type="submit" disabled={loading} style={{ width: "100%", padding: "11px 0", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, marginTop: 6 }}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p style={{ fontSize: 13, marginTop: 16, textAlign: "center" }}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "10px 12px", marginTop: 4,
  border: "1px solid var(--border)", borderRadius: 9, fontSize: 14,
};