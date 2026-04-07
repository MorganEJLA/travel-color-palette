import { useNavigate } from "react-router-dom";

export default function ChromaterraWordmark({ color = "#1A1A18" }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/")}
      style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.62rem",
        letterSpacing: "0.28em",
        textTransform: "uppercase",
        color: color,
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: 0,
      }}
    >
      Chromaterra
    </button>
  );
}
