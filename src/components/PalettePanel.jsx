import CopyButton from "./CopyButton";

export default function PalettePanel({ locale }) {
  return (
    <section>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1.25rem",
        }}
      >
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#888",
          }}
        >
          Color Palette
        </span>
        <div style={{ flex: 1, height: "1px", background: "#C8C0B0" }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        {locale.palette.map((swatch, i) => (
          <div
            key={swatch.hex}
            style={{
              display: "flex",
              alignItems: "stretch",
              border: "1px solid #C8C0B0",
              borderBottom:
                i === locale.palette.length - 1 ? "1px solid #C8C0B0" : "none",
            }}
          >
            <div
              style={{
                width: "64px",
                minHeight: "64px",
                background: swatch.hex,
                flexShrink: 0,
              }}
            />
            <div
              style={{
                flex: 1,
                padding: "0.75rem 1rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "4px",
                borderLeft: "1px solid #C8C0B0",
                background: "#F0EBE0",
              }}
            >
              <p
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  margin: 0,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                {swatch.name}
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.72rem",
                    color: "#666",
                    letterSpacing: "0.05em",
                  }}
                >
                  {swatch.hex}
                </span>
                <CopyButton value={swatch.hex} label="copy" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
