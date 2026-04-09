
import { useInlineEdit } from "../hooks/useInlineEdit";

export default function CountryEdit({ album, onRename }) {
  const { editing, value, setValue, start, handleKeyDown } = useInlineEdit(
    album.country,
    onRename,
  );

  if (editing) {
    return (
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ margin: "0 0 0.4rem 0" }}
      >
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.55rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#888",
            border: "none",
            borderBottom: "1px solid #888",
            background: "transparent",
            outline: "none",
            width: "100%",
          }}
        />
      </div>
    );
  }

  return (
    <p
      onClick={(e) => {
        e.stopPropagation();
        start(e);
      }}
      title="Click to edit"
      style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.55rem",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "#888",
        margin: "0 0 0.4rem 0",
        cursor: "text",
      }}
    >
      {album.country}
    </p>
  );
}
