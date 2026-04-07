import { useState } from "react";

export default function CopyButton({ value, label }) {
  const [copied, setCopied] = useState(false);

  const handle = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handle}
      style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.6rem",
        letterSpacing: "0.08em",
        background: copied ? "#1C1C1C" : "transparent",
        color: copied ? "#F5F0E8" : "#999",
        border: "1px solid",
        borderColor: copied ? "#1C1C1C" : "#D0C8B8",
        borderRadius: "2px",
        padding: "2px 7px",
        cursor: "pointer",
        transition: "all 0.15s ease",
        textTransform: "uppercase",
      }}
    >
      {copied ? "✓" : label}
    </button>
  );
}
