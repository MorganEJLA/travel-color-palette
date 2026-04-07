export default function Header({ locale }) {
  return (
    <header
      style={{
        borderBottom: "3px solid #1A1A18",
        padding: "2rem 2.5rem 1.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative corner lines */}
      <div
        style={{
          position: "absolute",
          top: "12px",
          left: "12px",
          width: "40px",
          height: "40px",
          borderTop: "2px solid #1A1A18",
          borderLeft: "2px solid #1A1A18",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          width: "40px",
          height: "40px",
          borderTop: "2px solid #1A1A18",
          borderRight: "2px solid #1A1A18",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "0.5rem",
            }}
          >
            <div
              style={{ height: "1px", width: "40px", background: "#1A1A18" }}
            />
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#1A1A18",
              }}
            >
              Chromaterra
            </span>
            <div
              style={{ height: "1px", width: "40px", background: "#1A1A18" }}
            />
          </div>
          <h1
            style={{
              fontFamily: "'Abril Fatface', cursive",
              fontWeight: 400,
              fontSize: "clamp(3rem, 7vw, 5.5rem)",
              lineHeight: 0.9,
              margin: 0,
              letterSpacing: "-0.02em",
              color: "#1A1A18",
            }}
          >
            The
            <br />
            Azores
          </h1>
          <div
            style={{
              marginTop: "0.75rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                height: "1px",
                flex: 1,
                maxWidth: "80px",
                background: "#1A1A18",
              }}
            />
            <span
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.7rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              Portugal
            </span>
          </div>
        </div>

        {/* Palette preview dots — decorative */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.4rem",
            alignItems: "flex-end",
          }}
        >
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.55rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#888",
            }}
          >
            Active palette
          </span>
          <div style={{ display: "flex", gap: "6px" }}>
            {locale.palette.map((s) => (
              <div
                key={s.hex}
                style={{
                  width: "28px",
                  height: "28px",
                  background: s.hex,
                  border: "1.5px solid rgba(0,0,0,0.15)",
                }}
              />
            ))}
          </div>
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.55rem",
              letterSpacing: "0.1em",
              color: "#888",
            }}
          >
            {locale.name}
          </span>
        </div>
      </div>
    </header>
  );
}
