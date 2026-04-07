export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "3px solid #1A1A18",
        padding: "1rem 2.5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#1A1A18",
        flexWrap: "wrap",
        gap: "0.5rem",
      }}
    >
      <span
        style={{
          fontFamily: "'Abril Fatface', cursive",
          fontSize: "1rem",
          color: "#F0EBE0",
          letterSpacing: "0.02em",
        }}
      >
        Chromaterra
      </span>
      <span
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.55rem",
          letterSpacing: "0.15em",
          color: "#666",
          textTransform: "uppercase",
        }}
      >
        A Global Aesthetic Reference — Vol. I
      </span>
    </footer>
  );
}
