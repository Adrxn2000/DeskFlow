import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import SoftAurora from "../components/backgrounds/SoftAurora";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim() || !password) {
      setError("All fields are required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const profile = await register(name, email, password);
      navigate(profile.role === "ADMIN" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden", background: "var(--bg)" }}>
      <SoftAurora
        speed={0.6} scale={1.5} brightness={0.6} color1="#f0edfc" color2="#6c5dd3"
        noiseFrequency={2.5} noiseAmplitude={1} bandHeight={0.5} bandSpread={1}
        octaveDecay={0.1} layerOffset={0} colorSpeed={1}
        enableMouseInteraction mouseInfluence={0.25}
      />

      <button onClick={toggleTheme} style={styles.themeToggle}>
        {theme === "light" ? "🌙" : "☀️"}
      </button>

      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "grid", placeItems: "center", padding: 20 }}>
        <div style={styles.card}>
          <div style={styles.brand}>
            <span style={styles.logoMark}>D</span>
            <span style={{ fontWeight: 800, fontSize: 18 }}>DeskFlow</span>
          </div>

          <h2 style={styles.title}>Create your account</h2>
          <p style={styles.subtitle}>Employee access — get started in seconds.</p>

          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>Full name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Work email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  style={{ ...styles.input, paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  style={styles.eyeBtn}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {error && <p style={styles.error}>{error}</p>}

            <button type="submit" disabled={loading} style={styles.submit}>
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p style={styles.footerText}>
            Already have an account? <Link to="/login" style={styles.link}>Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  themeToggle: { position: "fixed", top: 20, right: 20, zIndex: 2, background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", fontSize: 13 },
  card: { width: 380, background: "var(--panel)", borderRadius: "var(--radius)", boxShadow: "var(--shadow)", padding: "36px 32px" },
  brand: { display: "flex", alignItems: "center", gap: 10, marginBottom: 28 },
  logoMark: { width: 34, height: 34, borderRadius: 9, background: "var(--accent)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 800 },
  title: { marginTop: 0, marginBottom: 4, fontSize: 21 },
  subtitle: { marginTop: 0, marginBottom: 24, fontSize: 13, color: "var(--text-muted)" },
  field: { marginBottom: 16 },
  label: { display: "block", fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.3 },
  input: { width: "100%", padding: "11px 13px", border: "1px solid var(--border)", borderRadius: 10, fontSize: 14, background: "var(--bg)" },
  eyeBtn: { position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", fontSize: 15, cursor: "pointer", padding: 6 },
  error: { color: "var(--high)", fontSize: 13, marginTop: -4, marginBottom: 12 },
  submit: { width: "100%", padding: "12px 0", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, marginTop: 4, cursor: "pointer" },
  footerText: { fontSize: 13, marginTop: 20, textAlign: "center", color: "var(--text-muted)" },
  link: { color: "var(--accent)", fontWeight: 600, textDecoration: "none" },
};