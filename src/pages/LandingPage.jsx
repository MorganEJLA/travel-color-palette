import { useState } from "react";
import SignInModal from "../components/SignInModal";
import { useNavigate } from "react-router-dom";
import landingImage from "../img/LandingPageEllipses.svg";

export default function LandingPage() {
  const navigate = useNavigate();
  const [showSignIn, setShowSignIn] = useState(false);
  return (
    <div
      style={{
        background: "#F0EBE0",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'DM Mono', monospace",
      }}
    >
      {/* Color strip */}
      <div style={{ display: "flex", height: "4px" }}>
        {[
          "#3B6E8C",
          "#4E8C6E",
          "#C9A84C",
          "#5ab8a8",
          "#c8503a",
          "#7a3ab8",
          "#b8982a",
          "#c8820a",
          "#1a4a8a",
          "#D4A820",
        ].map((c, i) => (
          <div key={i} style={{ flex: 1, background: c }} />
        ))}
      </div>

      {/* Nav */}
      <nav
        style={{
          padding: "1.2rem 2.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: "0.62rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#1A1A18",
          }}
        >
          Chromaterra
        </span>
        <div style={{ display: "flex", gap: "2rem" }}>
          <button
            onClick={() => navigate("/atlas")}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.58rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#999",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            Atlas
          </button>
          <button
            onClick={() => setShowSignIn(true)}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.58rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#999",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Body */}
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "center",
          padding: "1rem 2.5rem 2rem 3.5rem",
          gap: "1.5rem",
        }}
      >
        {/* Left — copy */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p
            style={{
              fontSize: "0.58rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#999",
              marginBottom: "1.2rem",
            }}
          >
            Your travels, distilled into color
          </p>
          <h1
            style={{
              fontFamily: "'Abril Fatface', cursive",
              fontSize: "clamp(3rem, 6vw, 4.5rem)",
              fontWeight: 400,
              lineHeight: 0.92,
              color: "#1A1A18",
              margin: "0 0 1.8rem 0",
            }}
          >
            Every
            <br />
            Place
            <br />
            Has a<br />
            Palette
          </h1>
          <p
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.06em",
              lineHeight: 1.9,
              color: "#777",
              maxWidth: "380px",
              marginBottom: "1.5rem",
            }}
          >
            Upload photos from your trip. Chromaterra extracts a color palette
            that captures how that place looked and felt — named, documented,
            and yours to keep.
          </p>
          <p
            style={{
              fontSize: "0.58rem",
              letterSpacing: "0.06em",
              lineHeight: 1.9,
              color: "#aaa",
              maxWidth: "380px",
              marginBottom: "2.2rem",
              borderLeft: "2px solid #C8C0B0",
              paddingLeft: "0.85rem",
            }}
          >
            Upload photos from the Azores, New Orleans, or your own backyard.
            The color is already there — we just find it.
          </p>
          <button
            onClick={() => navigate("/atlas")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
              background: "#1A1A18",
              color: "#F0EBE0",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.58rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              padding: "0.8rem 1.6rem",
              border: "none",
              cursor: "pointer",
              width: "fit-content",
              marginBottom: "1rem",
            }}
          >
            Start Your Atlas →
          </button>
        </div>

        {/* Right — illustration */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "500px",
          }}
        >
          <img
            src={landingImage}
            alt="Travel landmarks with color palettes"
            style={{
              width: "100%",
              maxWidth: "480px",
              height: "auto",
              display: "block",
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          padding: "1rem 2.5rem",
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid #C8C0B0",
        }}
      >
        <span
          style={{
            fontSize: "0.52rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#bbb",
          }}
        >
          Chromaterra — Travel Color Atlas
        </span>
        <span
          style={{
            fontSize: "0.52rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#bbb",
          }}
        >
          Vol. I
        </span>
      </footer>
      {showSignIn && (
        <SignInModal
          onClose={() => setShowSignIn(false)}
          onSuccess={(user) => {
            console.log("Signed in as:", user.email);
            navigate("/atlas");
          }}
        />
      )}
    </div>
  );
}
