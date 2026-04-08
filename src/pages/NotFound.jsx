import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        background: "#F0EBE0",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'DM Mono', monospace",
      }}
    >
      {/* Color strip */}
      <div style={{ display: "flex", height: "4px" }}>
        {[
          "#3B6E8C",
          "#4E8C6E",
          "#C9A84C",
          "#5ab8a8",
          "#c8503a",
          "#7a3ab8",
          "#b8982a",
          "#c8820a",
          "#1a4a8a",
          "#D4A820",
        ].map((c, i) => (
          <div key={i} style={{ flex: 1, background: c }} />
        ))}
      </div>

      {/* Nav */}
      <nav
        style={{
          padding: "1.2rem 2.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: "0.62rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#1A1A18",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          Chromaterra
        </span>
      </nav>

      {/* Body */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 2.5rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "0.58rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#999",
            marginBottom: "1.2rem",
          }}
        >
          Location not found
        </p>
        <h1
          style={{
            fontFamily: "'Abril Fatface', cursive",
            fontSize: "clamp(5rem, 16vw, 10rem)",
            fontWeight: 400,
            lineHeight: 0.92,
            color: "#1A1A18",
            margin: "0 0 1.8rem 0",
          }}
        >
          404
        </h1>
        <p
          style={{
            fontSize: "0.6rem",
            letterSpacing: "0.06em",
            lineHeight: 1.9,
            color: "#777",
            maxWidth: "380px",
            marginBottom: "2.2rem",
            borderLeft: "2px solid #C8C0B0",
            paddingLeft: "0.85rem",
            textAlign: "left",
          }}
        >
          This place isn't on the map. The coordinates you followed don't lead
          anywhere we've charted yet.
        </p>
        <button
          onClick={() => navigate("/")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.75rem",
            background: "#1A1A18",
            color: "#F0EBE0",
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.58rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            padding: "0.8rem 1.6rem",
            border: "none",
            cursor: "pointer",
          }}
        >
          Back to Atlas →
        </button>
      </div>

      {/* Footer */}
      <footer
        style={{
          padding: "1rem 2.5rem",
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid #C8C0B0",
        }}
      >
        <span
          style={{
            fontSize: "0.52rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#bbb",
          }}
        >
          Chromaterra — Travel Color Atlas
        </span>
        <span
          style={{
            fontSize: "0.52rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#bbb",
          }}
        >
          Vol. I
        </span>
      </footer>
    </div>
  );
}
