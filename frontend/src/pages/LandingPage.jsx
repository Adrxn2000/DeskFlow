import { Link } from "react-router-dom";
import SoftAurora from "../components/backgrounds/SoftAurora";

export default function LandingPage() {
  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden", background: "var(--bg)" }}>
      <SoftAurora
        speed={0.6}
        scale={1.5}
        brightness={0.6}
        color1="#f0edfc"
        color2="#6c5dd3"
        noiseFrequency={2.5}
        noiseAmplitude={1}
        bandHeight={0.5}
        bandSpread={1}
        octaveDecay={0.1}
        layerOffset={0}
        colorSpeed={1}
        enableMouseInteraction
        mouseInfluence={0.25}
      />

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", textAlign: "center", padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <span style={{ width: 40, height: 40, borderRadius: 10, background: "var(--accent)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 20 }}>D</span>
          <span style={{ fontWeight: 800, fontSize: 22 }}>DeskFlow</span>
        </div>

        <h1 style={{ fontSize: 42, maxWidth: 600, lineHeight: 1.2, marginBottom: 12 }}>
          IT support requests, handled properly.
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-muted)", maxWidth: 480, marginBottom: 32 }}>
          Submit tickets, track status, and resolve issues - all in one place for your team.
        </p>

        <div style={{ display: "flex", gap: 12 }}>
          <Link to="/login" style={{ padding: "12px 24px", background: "var(--accent)", color: "#fff", borderRadius: 10, fontWeight: 700, textDecoration: "none" }}>
            Log in
          </Link>
          <Link to="/register" style={{ padding: "12px 24px", background: "var(--panel)", border: "1px solid var(--border)", color: "var(--text)", borderRadius: 10, fontWeight: 700, textDecoration: "none" }}>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}