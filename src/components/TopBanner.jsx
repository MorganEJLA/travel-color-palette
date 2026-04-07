import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ChromaterraWordmark from "./ChromaterraWordmark";

export default function TopBanner({
  leftText = "Est. 2025 — Global Aesthetic Reference",
  leftTo = null,
}) {
  const navigate = useNavigate();
  const { user, signOutUser } = useAuth();

  return (
    <div
      style={{
        background: "#1A1A18",
        padding: "0.4rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {leftTo ? (
        <button
          onClick={() => navigate(leftTo)}
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            color: "#888",
            textTransform: "uppercase",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          {leftText}
        </button>
      ) : (
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            color: "#888",
            textTransform: "uppercase",
          }}
        >
          {leftText}
        </span>
      )}

      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        {user && (
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              color: "#666",
              textTransform: "uppercase",
            }}
          >
            {user.displayName || user.email}
          </span>
        )}
        {user ? (
          <button
            onClick={signOutUser}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              color: "#888",
              textTransform: "uppercase",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            Sign Out
          </button>
        ) : null}
        <ChromaterraWordmark color="#888" />
      </div>
    </div>
  );
}
