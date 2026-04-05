import IconX from "./icons/IconX";

export default function DeleteButton({
  onDelete,
  label = "Delete",
  variant = "icon",
}) {
  return (
    <button
      onClick={async (e) => {
        e.stopPropagation();
        if (!confirm(`Delete ${label}?`)) return;
        await onDelete();
      }}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: "2px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: 0.5,
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.55rem",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: "#aaa",
        textDecoration: variant === "text" ? "underline" : "none",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.5")}
    >
      {variant === "text" ? "Delete" : <IconX />}
    </button>
  );
}
