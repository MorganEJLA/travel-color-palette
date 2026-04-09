import { useInlineEdit } from "../hooks/useInlineEdit";
export default function AlbumCard({
  album,
  user,
  onClick,
  onDelete,
  onRename,
  onCountryRename,
}) {
  const { editing, value, setValue, start, save, handleKeyDown } =
    useInlineEdit(album.name, onRename);
  const ghostButtonStyle = {
    fontFamily: "'DM Mono', monospace",
    fontSize: "0.55rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "#888",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: 0,
  };
  return (
    <div
      onClick={!editing ? onClick : undefined}
      style={{
        border: "1px solid #C8C0B0",
        background: "#F0EBE0",
        cursor: editing ? "default" : "pointer",
        transition: "transform 0.1s",
      }}
      onMouseEnter={(e) =>
        !editing && (e.currentTarget.style.transform = "translateY(-2px)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div style={{ display: "flex", height: "6px" }}>
        {album.previewColors.map((hex, i) => (
          <div key={i} style={{ flex: 1, background: hex }} />
        ))}
      </div>
      <div style={{ padding: "1.25rem" }}>
        {user ? (
          <CountryEdit album={album} onRename={onCountryRename} />
        ) : (
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
        )}

        {editing ? (
          <input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            style={{
              fontFamily: "'Abril Fatface', cursive",
              fontSize: "1.8rem",
              fontWeight: 400,
              color: "#1A1A18",
              border: "none",
              borderBottom: "1px solid #1A1A18",
              background: "transparent",
              outline: "none",
              width: "100%",
              margin: "0 0 0.75rem 0",
              lineHeight: 1,
            }}
          />
        ) : (
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
        )}

        <p
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.6rem",
            color: "#888",
            letterSpacing: "0.1em",
            margin: "0 0 0.5rem 0",
          }}
        >
          {album.localeCount} locale{album.localeCount !== 1 ? "s" : ""}
        </p>

        {user && (
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            {editing ? (
              <button onClick={save} style={ghostButtonStyle}>
                Save
              </button>
            ) : (
              <button onClick={start} style={ghostButtonStyle}>
                Edit
              </button>
            )}
            <DeleteButton
              label={album.name}
              variant="text"
              onDelete={onDelete}
            />
          </div>
        )}
      </div>
    </div>
  );
}
