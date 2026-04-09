import { useNavigate, useParams } from "react-router-dom";

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  };
}

function getLuminance({ r, g, b }) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(hex1, hex2) {
  const l1 = getLuminance(hexToRgb(hex1));
  const l2 = getLuminance(hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function getReadableTextColor(bgHex, palette) {
  const candidates = [palette[3].hex, palette[2].hex, palette[1].hex];

  for (const hex of candidates) {
    if (getContrastRatio(bgHex, hex) >= 3.5) return hex;
  }

  // last resort — return whichever candidate has the best contrast
  return candidates.reduce((best, hex) =>
    getContrastRatio(bgHex, hex) > getContrastRatio(bgHex, best) ? hex : best,
  );
}

export default function LocaleHero({ locale }) {
  const primary = locale.palette[0].hex;
  const secondary = locale.palette[1].hex;
  const accent = locale.palette[2].hex;

  const textColor = getReadableTextColor(primary, locale.palette);

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
            color: textColor,
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
            color: textColor,
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
              background: textColor,
              opacity: 0.5,
            }}
          />
        </div>
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.95rem",
            color: textColor,
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
