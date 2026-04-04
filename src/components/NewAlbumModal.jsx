import { useState } from "react";

export default function NewAlbumModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    country: "",
    island: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSave() {
    if (!form.name || !form.country || !form.island) return;

    const newAlbum = {
      id: form.name.toLowerCase().replace(/\s+/g, "-"),
      name: form.name,
      country: form.country,
      islands: [
        {
          id: form.island.toLowerCase().replace(/\s+/g, "-"),
          name: form.island,
          locales: [],
        },
      ],
    };

    onSave(newAlbum);
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
          maxWidth: "480px",
        }}
      >
        {/* Header */}
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
            New Album
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

        {/* Fields */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
            marginBottom: "2rem",
          }}
        >
          {[
            {
              label: "State / Locale",
              name: "name",
              placeholder: "e.g. California, São Miguel, Honshu",
            },
            {
              label: "World Region",
              name: "country",
              placeholder: "e.g. North America, Europe, Atlantic Islands",
            },
            {
              label: "Locale / Island",
              name: "island",
              placeholder: "e.g. Los Angeles, Furnas, Kyoto",
            },
          ].map((field) => (
            <div
              key={field.name}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.4rem",
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
                {field.label}
              </label>
              <input
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
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
          ))}
        </div>

        {/* Buttons */}
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
            Create Album
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
