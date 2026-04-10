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
import styles from "./UserLocaleView.module.css";
import NotFound from "./NotFound";
import { loadFont } from "../utils/loadFont";

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
      try {
        const snap = await getDoc(
          doc(db, "users", user.uid, "generatedLocales", localeId),
        );
        if (snap.exists()) {
          const data = snap.data();
          setLocale(data);
          if (data.fonts?.googleUrl) loadFont(data.fonts.googleUrl);
        }
      } catch (err) {
        console.error("Failed to fetch locale:", err);
      } finally {
        setFetching(false);
      }
    }
    fetchLocale();
  }, [user, localeId]);

  if (loading || fetching)
    return <div className={styles.loading}>Loading...</div>;

  if (!locale) return;
  <NotFound />;

  return (
    <div className={styles.page}>
      <TopBanner leftText="← My Palettes" leftTo="/profile" />

      <div className={styles.content}>
        <LocaleHero locale={locale} albumId={null} />

        <div className={styles.grid}>
          <PalettePanel locale={locale} />
          <GradientTool locale={locale} />
          <FontPairingPanel locale={locale} />
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          {!shared ? (
            <button
              className={styles.shareBtn}
              onClick={() => setShowShareModal(true)}
            >
              Share to Public Atlas →
            </button>
          ) : (
            <span className={styles.sharedConfirm}>Shared to Atlas</span>
          )}

          <button
            className={styles.backBtn}
            onClick={() => navigate("/profile")}
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
