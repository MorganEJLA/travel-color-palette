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
  const bgLuminance = getLuminance(hexToRgb(bgHex));
  const isDark = bgLuminance < 0.2;
  const threshold = isDark ? 5.5 : 4.5;

  const candidates = [palette[3].hex, palette[2].hex, palette[1].hex];

  for (const hex of candidates) {
    if (getContrastRatio(bgHex, hex) >= threshold) return hex;
  }

  return candidates.reduce((best, hex) =>
    getContrastRatio(bgHex, hex) > getContrastRatio(bgHex, best) ? hex : best,
  );
}

export default function StylePreview({ locale }) {
  const primary = locale.palette[0].hex;
  const secondary = locale.palette[1].hex;
  const textColor = getReadableTextColor(primary, locale.palette);

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
          Style Preview
        </span>
        <div style={{ flex: 1, height: "1px", background: "#C8C0B0" }} />
      </div>

      <div
        style={{
          background: primary,
          padding: "2rem",
          position: "relative",
          overflow: "hidden",
          border: "3px solid #1A1A18",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 0,
            height: 0,
            borderStyle: "solid",
            borderWidth: "0 80px 80px 0",
            borderColor: `transparent ${secondary} transparent transparent`,
            opacity: 0.5,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-20px",
            left: "-20px",
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            border: `2px solid ${textColor}`,
            opacity: 0.2,
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <p
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.55rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: textColor,
              margin: "0 0 0.75rem 0",
              opacity: 0.7,
            }}
          >
            {locale.regionName} · {locale.island || locale.placeName}
          </p>

          <h4
            style={{
              fontFamily: `'${locale.fonts.display}', serif`,
              fontWeight: locale.fonts.displayWeight,
              fontSize: "2.2rem",
              color: textColor,
              margin: "0 0 0.5rem 0",
              lineHeight: 1,
            }}
          >
            {locale.name}
          </h4>

          <div
            style={{
              height: "2px",
              width: "40px",
              background: textColor,
              opacity: 0.5,
              margin: "0.75rem 0",
            }}
          />

          <p
            style={{
              fontFamily: `'${locale.fonts.body}', sans-serif`,
              fontSize: "0.78rem",
              color: textColor,
              opacity: 0.8,
              margin: "0 0 1.5rem 0",
              maxWidth: "220px",
              lineHeight: 1.6,
              fontWeight: 300,
            }}
          >
            {locale.mood.split(".")[0]}.
          </p>

          <div
            style={{
              display: "flex",
              gap: "0",
              marginTop: "1.25rem",
              alignItems: "center",
            }}
          >
            {locale.palette.map((s) => (
              <div
                key={s.hex}
                style={{
                  width: "24px",
                  height: "24px",
                  background: s.hex,
                  border: "1px solid rgba(255,255,255,0.25)",
                  flexShrink: 0,
                  margin: 0,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
