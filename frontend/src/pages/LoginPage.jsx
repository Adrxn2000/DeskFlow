import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import SoftAurora from "../components/backgrounds/SoftAurora";

const DEMO = {
  EMPLOYEE: { email: "employee@deskflow.com", password: "password123" },
  ADMIN: { email: "admin@deskflow.com", password: "password123" },
};

export default function LoginPage() {
  const [role, setRole] = useState("EMPLOYEE");
  const [email, setEmail] = useState(DEMO.EMPLOYEE.email);
  const [password, setPassword] = useState(DEMO.EMPLOYEE.password);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  function handleRoleToggle(nextRole) {
    setRole(nextRole);
    setEmail(DEMO[nextRole].email);
    setPassword(DEMO[nextRole].password);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Email and password are required");
      return;
    }
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

          <h2 style={styles.title}>Welcome back</h2>
          <p style={styles.subtitle}>Log in to manage your IT tickets.</p>

          <div style={styles.toggle}>
            <button type="button" onClick={() => handleRoleToggle("EMPLOYEE")} style={role === "EMPLOYEE" ? styles.toggleActive : styles.toggleBtn}>
              Employee
            </button>
            <button type="button" onClick={() => handleRoleToggle("ADMIN")} style={role === "ADMIN" ? styles.toggleActive : styles.toggleBtn}>
              IT Admin
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ ...styles.input, paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowPassword((s) => !s)} style={styles.eyeBtn} aria-label="Toggle password visibility">
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {error && <p style={styles.error}>{error}</p>}

            <button type="submit" disabled={loading} style={styles.submit}>
              {loading ? "Logging in..." : `Log in as ${role === "ADMIN" ? "IT Admin" : "Employee"}`}
            </button>
          </form>

          <p style={styles.hint}>Demo credentials are pre-filled for the selected role.</p>
          <p style={styles.footerText}>
            Don't have an account? <Link to="/register" style={styles.link}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  themeToggle: { position: "fixed", top: 20, right: 20, zIndex: 2, background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", fontSize: 13 },
  card: { width: 380, background: "var(--panel)", borderRadius: "var(--radius)", boxShadow: "var(--shadow)", padding: "36px 32px" },
  brand: { display: "flex", alignItems: "center", gap: 10, marginBottom: 24 },
  logoMark: { width: 34, height: 34, borderRadius: 9, background: "var(--accent)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 800 },
  title: { marginTop: 0, marginBottom: 4, fontSize: 21 },
  subtitle: { marginTop: 0, marginBottom: 20, fontSize: 13, color: "var(--text-muted)" },
  toggle: { display: "flex", background: "var(--bg)", borderRadius: 10, padding: 4, marginBottom: 22 },
  toggleBtn: { flex: 1, padding: "9px 0", border: "none", background: "transparent", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "var(--text-muted)", cursor: "pointer" },
  toggleActive: { flex: 1, padding: "9px 0", border: "none", background: "var(--panel)", borderRadius: 8, fontSize: 13, fontWeight: 700, color: "var(--accent)", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", cursor: "pointer" },
  field: { marginBottom: 16 },
  label: { display: "block", fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.3 },
  input:  { width: "100%", padding: "11px 13px", border: "1px solid var(--border)", borderRadius: 10, fontSize: 14, background: "var(--bg)", color: "var(--text)" },
  eyeBtn: { position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", fontSize: 15, cursor: "pointer", padding: 6 },
  error: { color: "var(--high)", fontSize: 13, marginTop: -4, marginBottom: 12 },
  submit: { width: "100%", padding: "12px 0", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, marginTop: 4, cursor: "pointer" },
  hint: { fontSize: 11, color: "var(--text-muted)", marginTop: 16, textAlign: "center" },
  footerText: { fontSize: 13, marginTop: 8, textAlign: "center", color: "var(--text-muted)" },
  link: { color: "var(--accent)", fontWeight: 600, textDecoration: "none" },
};