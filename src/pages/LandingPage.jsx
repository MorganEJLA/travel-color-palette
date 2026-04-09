import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignInModal from "../components/modals/SignInModal";
import landingImage from "../img/LandingPageEllipses.svg";
import { useAuth } from "../hooks/useAuth";
import styles from "./LandingPage.module.css";

const COLOR_STRIP = [
  "#3B6E8C", "#4E8C6E", "#C9A84C", "#5ab8a8",
  "#c8503a", "#7a3ab8", "#b8982a", "#c8820a",
  "#1a4a8a", "#D4A820",
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [showSignIn, setShowSignIn] = useState(false);
  const { user } = useAuth();

  return (
    <div className={styles.page}>

      {/* Color strip */}
      <div className={styles.colorStrip}>
        {COLOR_STRIP.map((color, i) => (
          <div key={i} className={styles.colorSegment} style={{ background: color }} />
        ))}
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        <span className={styles.logo}>Chromaterra</span>
        <div className={styles.navLinks}>
          <button className={styles.navButton} onClick={() => navigate("/atlas")}>
            Atlas
          </button>
          {user ? (
            <button className={styles.navButton} onClick={() => navigate("/profile")}>
              My Profile
            </button>
          ) : (
            <button className={styles.navButton} onClick={() => setShowSignIn(true)}>
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* Body */}
      <div className={styles.body}>

        {/* Left — copy */}
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Your travels, distilled into color</p>
          <h1 className={styles.headline}>
            Every<br />
            Place<br />
            Has a<br />
            Palette
          </h1>
          <p className={styles.description}>
            Upload photos from your trip. Chromaterra extracts a color palette
            that captures how that place looked and felt — named, documented,
            and yours to keep.
          </p>
          <p className={styles.quote}>
            Upload photos from the Azores, New Orleans, or your own backyard.
            The color is already there — we just find it.
          </p>
          <button className={styles.cta} onClick={() => navigate("/atlas")}>
            Start Your Atlas →
          </button>
        </div>

        {/* Right — illustration */}
        <div className={styles.illustration}>
          <img src={landingImage} alt="Travel landmarks with color palettes" />
        </div>

      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <span>Chromaterra — Travel Color Atlas</span>
        <span>Vol. I</span>
      </footer>

      {showSignIn && (
        <SignInModal
          onClose={() => setShowSignIn(false)}
          onSuccess={() => navigate("/atlas")}
        />
      )}

    </div>
  );
}
