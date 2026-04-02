import { useState, useEffect } from "react";
import CopyButton from "./CopyButton";

export default function GradientTool({ locale }) {
  const palette = locale.palette;
  const [colorA, setColorA] = useState(palette[0]?.hex || "#000000");
  const [colorB, setColorB] = useState(palette[1]?.hex || "#ffffff");
  const [type, setType] = useState("linear");
  const [angle, setAngle] = useState(135);

  useEffect(() => {
    setColorA(palette[0]?.hex || "#000000");
    setColorB(palette[1]?.hex || "#ffffff");
  }, [locale.id, palette]);
  const gradient =
    type === "linear"
      ? `linear-gradient(${angle}deg, ${colorA}, ${colorB})`
      : `radial-gradient(circle, ${colorA}, ${colorB})`;

  const css = `background: ${gradient};`;

  return (
    <section>
      {/* Section header — matches PalettePanel style */}
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
          Gradient Tool
        </span>
        <div style={{ flex: 1, height: "1px", background: "#C8C0B0" }} />
      </div>

      {/* Preview */}
      <div
        style={{
          width: "100%",
          height: "120px",
          background: gradient,
          border: "1px solid #C8C0B0",
          marginBottom: "1rem",
        }}
      />

      {/* Controls */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {/* Color A */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={labelStyle}>Color A</span>
          <select
            value={colorA}
            onChange={(e) => setColorA(e.target.value)}
            style={selectStyle}
          >
            {palette.map((s) => (
              <option key={s.hex} value={s.hex}>
                {s.name} — {s.hex}
              </option>
            ))}
          </select>
          <div
            style={{
              width: 24,
              height: 24,
              background: colorA,
              border: "1px solid #C8C0B0",
              flexShrink: 0,
            }}
          />
        </div>

        {/* Color B */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={labelStyle}>Color B</span>
          <select
            value={colorB}
            onChange={(e) => setColorB(e.target.value)}
            style={selectStyle}
          >
            {palette.map((s) => (
              <option key={s.hex} value={s.hex}>
                {s.name} — {s.hex}
              </option>
            ))}
          </select>
          <div
            style={{
              width: 24,
              height: 24,
              background: colorB,
              border: "1px solid #C8C0B0",
              flexShrink: 0,
            }}
          />
        </div>

        {/* Type toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={labelStyle}>Type</span>
          {["linear", "radial"].map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                padding: "0.3rem 0.75rem",
                border: "1px solid #C8C0B0",
                background: type === t ? "#1a1a1a" : "#F0EBE0",
                color: type === t ? "#F0EBE0" : "#1a1a1a",
                cursor: "pointer",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Angle — only for linear */}
        {type === "linear" && (
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <span style={labelStyle}>Angle</span>
            <input
              type="range"
              min="0"
              max="360"
              value={angle}
              onChange={(e) => setAngle(e.target.value)}
              style={{ flex: 1 }}
            />
            <span style={{ ...labelStyle, width: "2.5rem" }}>{angle}°</span>
          </div>
        )}

        {/* CSS output */}
        <div
          style={{
            background: "#1a1a1a",
            padding: "0.75rem 1rem",
            border: "1px solid #C8C0B0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.7rem",
              color: "#aaa",
              letterSpacing: "0.05em",
            }}
          >
            {css}
          </span>
          <CopyButton value={css} label="copy" />
        </div>
      </div>
    </section>
  );
}

const labelStyle = {
  fontFamily: "'DM Mono', monospace",
  fontSize: "0.6rem",
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: "#888",
  width: "3.5rem",
  flexShrink: 0,
};

const selectStyle = {
  fontFamily: "'DM Mono', monospace",
  fontSize: "0.65rem",
  padding: "0.3rem 0.5rem",
  border: "1px solid #C8C0B0",
  background: "#F0EBE0",
  color: "#1a1a1a",
  flex: 1,
};
