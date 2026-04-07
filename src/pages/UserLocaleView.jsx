import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../hooks/useAuth";
import TopBanner from "../components/layout/TopBanner";
import LocaleHero from "../components/layout/LocaleHero";
import PalettePanel from "../components/panels/PalettePanel";
import GradientTool from "../components/panels/GradientTool";
import FontPairingPanel from "../components/panels/FontPairingPanel";
import ShareToAtlasModal from "../components/modals/ShareToAtlasModal";

export default function UserLocaleView() {
  const { localeId } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [locale, setLocale] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    if (!user) return;
    async function fetchLocale() {
      const snap = await getDoc(
        doc(db, "users", user.uid, "generatedLocales", localeId),
      );
      if (snap.exists()) {
        setLocale(snap.data());
        if (snap.data().fonts?.googleUrl) {
          const existing = document.querySelector(
            `link[href="${snap.data().fonts.googleUrl}"]`,
          );
          if (!existing) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = snap.data().fonts.googleUrl;
            document.head.appendChild(link);
          }
        }
      }
      setFetching(false);
    }
    fetchLocale();
  }, [user, localeId]);

  if (loading || fetching)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#F0EBE0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.6rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#888",
        }}
      >
        Loading...
      </div>
    );

  if (!locale)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#F0EBE0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.6rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#888",
        }}
      >
        Locale not found.
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F0EBE0",
        fontFamily: "'DM Mono', monospace",
      }}
    >
      <TopBanner leftText="← My Palettes" leftTo="/profile" />

      <div style={{ padding: "2.5rem", maxWidth: "1200px" }}>
        <LocaleHero locale={locale} albumId={null} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "2rem",
            marginTop: "2.5rem",
          }}
        >
          <PalettePanel locale={locale} />
          <GradientTool locale={locale} />
          <FontPairingPanel locale={locale} />
        </div>

        {/* Actions */}
        <div
          style={{
            marginTop: "2.5rem",
            display: "flex",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          {!shared ? (
            <button
              onClick={() => setShowShareModal(true)}
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
              Share to Public Atlas →
            </button>
          ) : (
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#3d5941",
              }}
            >
              Shared to Atlas
            </span>
          )}

          <button
            onClick={() => navigate("/profile")}
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
            Back to Profile
          </button>
        </div>
      </div>

      {showShareModal && (
        <ShareToAtlasModal
          locale={locale}
          onClose={() => setShowShareModal(false)}
          onSuccess={() => {
            setShared(true);
            setShowShareModal(false);
          }}
        />
      )}
    </div>
  );
}
