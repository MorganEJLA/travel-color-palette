import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ChromaterraWordmark from "../ChromaterraWordmark";
import SignInModal from "../modals/SignInModal";

export default function TopBanner({
  leftText = "Est. 2026 — Global Aesthetic Reference",
  leftTo = null,
  onSignOut = null,
}) {
  const navigate = useNavigate();
  const { user, signOutUser } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <>
      <style>{`
        @media (max-width: 600px) {
          .banner-left { display: none; }
          .banner-username { display: none; }
        }
      `}</style>
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
            className="banner-left"
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
            className="banner-left"
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
              className="banner-username"
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
          {user && (
            <button
              onClick={() => navigate("/profile")}
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
              My Profile
            </button>
          )}
          {user && (
            <button
              onClick={async () => {
                await signOutUser();
                if (onSignOut) {
                  onSignOut();
                } else {
                  navigate("/");
                }
              }}
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
          )}
          {!user && (
            <button
              onClick={() => setShowSignIn(true)}
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
              Sign In
            </button>
          )}
          <ChromaterraWordmark color="#888" />
        </div>
      </div>

      {showSignIn && (
        <SignInModal
          onClose={() => setShowSignIn(false)}
          onSuccess={() => {
            setShowSignIn(false);
            navigate("/profile");
          }}
        />
      )}
    </>
  );
}
