import CopyButton from "./CopyButton";

export default function FontPairingPanel({ locale }) {
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
          Font Pairing
        </span>
        <div style={{ flex: 1, height: "1px", background: "#C8C0B0" }} />
      </div>

      <div
        style={{
          border: "1px solid #C8C0B0",
          background: "#F0EBE0",
        }}
      >
        {[
          {
            role: "Display",
            family: locale.fonts.display,
            weight: locale.fonts.displayWeight,
            size: "1.8rem",
            sample: locale.name,
          },
          {
            role: "Body",
            family: locale.fonts.body,
            weight: "400",
            size: "0.9rem",
            sample: "The light shifts slowly here.",
          },
          {
            role: "Mono",
            family: locale.fonts.mono,
            weight: "400",
            size: "0.75rem",
            sample: locale.fonts.mono.toLowerCase(),
          },
        ].map((f, i) => (
          <div
            key={f.role}
            style={{
              padding: "1rem 1.25rem",
              borderBottom: i < 2 ? "1px solid #C8C0B0" : "none",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.55rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#888",
                }}
              >
                {f.role}
              </span>
              <CopyButton value={f.family} label={f.family} />
            </div>
            <p
              style={{
                fontFamily: `'${f.family}', ${f.role === "Mono" ? "monospace" : "serif"}`,
                fontWeight: f.weight,
                fontSize: f.size,
                margin: 0,
                lineHeight: 1.2,
                color: "#1A1A18",
              }}
            >
              {f.sample}
            </p>
          </div>
        ))}
        <div
          style={{
            padding: "0.75rem 1.25rem",
            background: "#E8E3D8",
            borderTop: "1px solid #C8C0B0",
          }}
        >
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.72rem",
              color: "#666",
              fontStyle: "italic",
              margin: 0,
              letterSpacing: "0.02em",
            }}
          >
            {locale.fonts.note}
          </p>
        </div>
      </div>
    </section>
  );
}
