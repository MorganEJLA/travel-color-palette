import { useParams, useNavigate } from "react-router-dom";
import data from "../data/locales.json";

const allPlaces = data.world.flatMap((region) =>
  region.places.map((place) => ({
    ...place,
    regionName: region.region,
  })),
);

export default function AlbumView() {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const place = allPlaces.find((p) => p.id === albumId);

  if (!place) return <p>Album not found.</p>;

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
        <button
          onClick={() => navigate("/")}
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            color: "#888",
            textTransform: "uppercase",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          ← My Atlas
        </button>
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

      {/* ALBUM HEADER */}
      <div
        style={{
          padding: "3rem 2.5rem 2rem",
          borderBottom: "3px solid #1A1A18",
        }}
      >
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
          Chromaterra — {place.country}
        </p>
        <h1
          style={{
            fontFamily: "'Abril Fatface', cursive",
            fontSize: "clamp(3rem, 8vw, 6rem)",
            fontWeight: 400,
            lineHeight: 0.9,
            color: "#1A1A18",
            margin: 0,
          }}
        >
          {place.name}
        </h1>
      </div>

      {/* ISLANDS + LOCALES */}
      <div style={{ padding: "2.5rem" }}>
        {place.islands.map((island) => (
          <div key={island.id} style={{ marginBottom: "3rem" }}>
            {/* Island header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1.5rem",
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
                {island.name}
              </span>
              <div style={{ flex: 1, height: "1px", background: "#C8C0B0" }} />
            </div>

            {/* Locale cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {island.locales.map((locale) => (
                <div
                  key={locale.id}
                  onClick={() =>
                    navigate(`/${albumId}/${island.id}/${locale.id}`)
                  }
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
                  <div style={{ display: "flex", height: "6px" }}>
                    {locale.palette.slice(0, 3).map((s, i) => (
                      <div key={i} style={{ flex: 1, background: s.hex }} />
                    ))}
                  </div>
                  <div style={{ padding: "1.25rem" }}>
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
                      {locale.name}
                    </h2>
                    <p
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.6rem",
                        color: "#888",
                        letterSpacing: "0.05em",
                        lineHeight: 1.5,
                        margin: 0,
                      }}
                    >
                      {locale.mood}
                    </p>
                  </div>
                </div>
              ))}

              {/* Add locale card */}
              <div
                onClick={() => navigate(`/${albumId}/${island.id}/generate`)}
                style={{
                  border: "1px dashed #C8C0B0",
                  background: "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "120px",
                  transition: "border-color 0.1s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "#1A1A18")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "#C8C0B0")
                }
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
                  + Add Locale
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
