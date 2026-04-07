export default function LocaleNav({ allLocales, activeId, setActiveId }) {
  return (
    <nav
      style={{
        borderBottom: "1px solid #C8C0B0",
        padding: "1rem 2.5rem",
        display: "flex",
        gap: "0.5rem",
        flexWrap: "wrap",
        background: "#E8E3D8",
      }}
    >
      <span
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.55rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#888",
          alignSelf: "center",
          marginRight: "0.5rem",
        }}
      >
        Regions —
      </span>
      {allLocales.map((l) => (
        <button
          key={l.id}
          onClick={() => setActiveId(l.id)}
          style={{
            background: l.id === activeId ? "#1A1A18" : "transparent",
            color: l.id === activeId ? "#F0EBE0" : "#1A1A18",
            border: "1.5px solid #1A1A18",
            borderRadius: "0",
            padding: "0.4rem 1.1rem",
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.72rem",
            fontWeight: l.id === activeId ? 600 : 400,
            cursor: "pointer",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            transition: "all 0.15s ease",
          }}
        >
          {l.name}
        </button>
      ))}
    </nav>
  );
}
