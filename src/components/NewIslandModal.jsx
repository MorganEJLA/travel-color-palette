import { useState } from "react";

export default function NewIslandModal({ onClose, onSave }) {
  const [name, setName] = useState("");

  function handleSave() {
    if (!name) return;
    onSave({
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name: name,
      locales: [],
    });
    onClose();
  }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 100,
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "#F0EBE0",
          border: "1px solid #C8C0B0",
          padding: "2.5rem",
          zIndex: 101,
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "2rem",
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
            New Island / Region
          </span>
          <div style={{ flex: 1, height: "1px", background: "#C8C0B0" }} />
          <button
            onClick={onClose}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.6rem",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#888",
            }}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.4rem",
            marginBottom: "2rem",
          }}
        >
          <label
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#888",
            }}
          >
            Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Graciosa"
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              padding: "0.5rem 0.75rem",
              border: "1px solid #C8C0B0",
              background: "#F0EBE0",
              color: "#1A1A18",
              width: "100%",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            onClick={handleSave}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              padding: "0.75rem 2rem",
              background: "#1A1A18",
              color: "#F0EBE0",
              border: "none",
              cursor: "pointer",
            }}
          >
            Add Island
          </button>
          <button
            onClick={onClose}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              padding: "0.75rem 2rem",
              background: "transparent",
              color: "#888",
              border: "1px solid #C8C0B0",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
