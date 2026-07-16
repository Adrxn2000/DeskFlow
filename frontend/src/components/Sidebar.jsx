
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const EMPLOYEE_NAV = [{ label: "My Tickets", icon: "🎫" }];
const ADMIN_NAV = [{ label: "All Tickets", icon: "📋" }];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const nav = user?.role === "ADMIN" ? ADMIN_NAV : EMPLOYEE_NAV;
  const { theme, toggleTheme } = useTheme();

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>
        <span style={styles.logoMark}>D</span>
        <span style={{ fontWeight: 800, fontSize: 18 }}>DeskFlow</span>
      </div>

      <nav style={{ marginTop: 32 }}>
        {nav.map((item) => (
          <div key={item.label} style={styles.navItemActive}>
            <span style={{ marginRight: 10 }}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </nav>

      <div style={styles.bottom}>
        <div style={styles.avatarRow}>
          <div style={styles.avatar}>{user?.name?.[0] || "U"}</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
              {user?.role === "ADMIN" ? "IT Administrator" : "Employee"}
            </div>
          </div>
        </div>
        <button onClick={toggleTheme} style={{ ...styles.logoutBtn, marginBottom: 8 }}>
                    {theme === "light" ? "🌙 Dark mode" : "☀️ Light mode"}
       </button>
        <button
          onClick={() => { logout(); navigate("/login"); }}
          style={styles.logoutBtn}
        >
          Log out
        </button>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: 240,
    minHeight: "100vh",
    background: "var(--sidebar)",
    borderRight: "1px solid var(--border)",
    padding: "24px 20px",
    position: "fixed",
    display: "flex",
    flexDirection: "column",
  },
  logo: { display: "flex", alignItems: "center", gap: 10 },
  logoMark: {
    width: 32, height: 32, borderRadius: 9,
    background: "var(--accent)", color: "#fff",
    display: "grid", placeItems: "center", fontWeight: 800,
  },
  navItemActive: {
    display: "flex", alignItems: "center",
    background: "var(--accent)", color: "#fff",
    padding: "11px 14px", borderRadius: 10,
    fontSize: 14, fontWeight: 600,
  },
  bottom: { marginTop: "auto", paddingTop: 20, borderTop: "1px solid var(--border)" },
  avatarRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 14 },
  avatar: {
    width: 36, height: 36, borderRadius: "50%",
    background: "var(--accent-soft)", color: "var(--accent)",
    display: "grid", placeItems: "center", fontWeight: 700,
  },
  logoutBtn: {
    width: "100%", padding: "9px 0", borderRadius: 8,
    border: "1px solid var(--border)", background: "transparent",
    fontSize: 13, fontWeight: 600, color: "var(--text)",
  },
};