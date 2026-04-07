import { useNavigate, useParams } from "react-router-dom";
export default function LocaleHero({ locale }) {
  const primary = locale.palette[0].hex;
  const secondary = locale.palette[1].hex;
  const accent = locale.palette[2].hex;
  const light = locale.palette[3].hex;

  const navigate = useNavigate();
  const { albumId } = useParams();
  return (
    <div
      style={{
        background: primary,
        padding: "3rem 2.5rem 2rem",
        borderBottom: "3px solid #1A1A18",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Big decorative circle */}
      <div
        style={{
          position: "absolute",
          top: "-60px",
          right: "-60px",
          width: "280px",
          height: "280px",
          borderRadius: "50%",
          background: secondary,
          opacity: 0.25,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-40px",
          left: "30%",
          width: "160px",
          height: "160px",
          borderRadius: "50%",
          background: accent,
          opacity: 0.15,
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <p
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: light,
            margin: "0 0 0.5rem 0",
            opacity: 0.85,
          }}
        >
          <span
            onClick={() => navigate(`/${albumId}`)}
            style={{ cursor: "pointer", textDecoration: "none" }}
          >
            {locale.placeName}
          </span>
          {locale.islandName && (
            <>
              {" / "}
              <span
                onClick={() => navigate(`/${albumId}`)}
                style={{ cursor: "pointer", textDecoration: "none" }}
              >
                {locale.islandName}
              </span>
            </>
          )}
        </p>
        <h2
          style={{
            fontFamily: "'Abril Fatface', cursive",
            fontWeight: 400,
            fontSize: "clamp(3.5rem, 8vw, 6rem)",
            color: light,
            margin: "0 0 1rem 0",
            lineHeight: 0.9,
            letterSpacing: "-0.02em",
          }}
        >
          {locale.name}
        </h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              height: "1px",
              width: "30px",
              background: light,
              opacity: 0.5,
            }}
          />
        </div>
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.95rem",
            color: light,
            lineHeight: 1.7,
            maxWidth: "480px",
            opacity: 0.85,
            fontStyle: "italic",
            fontWeight: 300,
          }}
        >
          {locale.mood}
        </p>
      </div>
    </div>
  );
}
