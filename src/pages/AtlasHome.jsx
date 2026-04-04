import { useNavigate } from "react-router-dom";
import data from "../data/locales.json";

const albums = data.world.flatMap((region) =>
  region.places.map((place) => ({
    id: place.id,
    name: place.name,
    country: place.country,
    localeCount: place.locales.length,
    previewColors:
      place.locales[0]?.palette.slice(0, 3).map((s) => s.hex) || [],
  })),
);

export default function AtlasHome() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F0EBE0",
        fontFamily: "'Montserrat', sans-serif",
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
      }}
    >
      {/* TOP BANNER */}
      <div
        style={{
          background: "#1A1A18",
          padding: "0.4rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            color: "#888",
            textTransform: "uppercase",
          }}
        >
          Est. 2025 — Global Aesthetic Reference
        </span>
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            color: "#888",
            textTransform: "uppercase",
          }}
        >
          Chromaterra
        </span>
      </div>

      {/* HEADER */}
      <div style={{ padding: "3rem 2.5rem 2rem" }}>
        <p
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#888",
            marginBottom: "0.5rem",
          }}
        >
          Chromaterra
        </p>
        <h1
          style={{
            fontFamily: "'Abril Fatface', cursive",
            fontSize: "clamp(3rem, 8vw, 6rem)",
            fontWeight: 400,
            lineHeight: 0.9,
            color: "#1A1A18",
            margin: "0 0 0.5rem 0",
          }}
        >
          My Atlas
        </h1>
        <div
          style={{
            height: "1px",
            width: "100%",
            background: "#C8C0B0",
            margin: "1.5rem 0",
          }}
        />
      </div>

      {/* ALBUM GRID */}
      <div
        style={{
          padding: "0 2.5rem 2.5rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {albums.map((album) => (
          <div
            key={album.id}
            onClick={() => navigate(`/${album.id}`)}
            style={{
              border: "1px solid #C8C0B0",
              background: "#F0EBE0",
              cursor: "pointer",
              transition: "transform 0.1s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-2px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            {/* Color strip */}
            <div style={{ display: "flex", height: "6px" }}>
              {album.previewColors.map((hex, i) => (
                <div key={i} style={{ flex: 1, background: hex }} />
              ))}
            </div>

            {/* Card content */}
            <div style={{ padding: "1.25rem" }}>
              <p
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.55rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#888",
                  margin: "0 0 0.4rem 0",
                }}
              >
                {album.country}
              </p>
              <h2
                style={{
                  fontFamily: "'Abril Fatface', cursive",
                  fontSize: "1.8rem",
                  fontWeight: 400,
                  color: "#1A1A18",
                  margin: "0 0 0.75rem 0",
                  lineHeight: 1,
                }}
              >
                {album.name}
              </h2>
              <p
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.6rem",
                  color: "#888",
                  letterSpacing: "0.1em",
                }}
              >
                {album.localeCount} locale{album.localeCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        ))}

        {/* New Album card */}
        <div
          style={{
            border: "1px dashed #C8C0B0",
            background: "transparent",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "120px",
            padding: "1.25rem",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#1A1A18")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#C8C0B0")}
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
            + New Album
          </span>
        </div>
      </div>
    </div>
  );
}
