import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../hooks/useAuth";
import TopBanner from "../components/layout/TopBanner";
import ShareToAtlasModal from "../components/modals/ShareToAtlasModal";
import ProfileLocaleCard from "../components/profile/ProfileLocaleCard";
import styles from "./UserProfile.module.css";

export default function UserProfile() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [locales, setLocales] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [sharingLocale, setSharingLocale] = useState(null);

  useEffect(() => {
    if (!user) return;
    async function fetchLocales() {
      try {
        const snap = await getDocs(
          collection(db, "users", user.uid, "generatedLocales"),
        );
        const fetched = snap.docs.map((doc) => doc.data());
        setLocales(fetched);
      } catch (err) {
        console.error("Failed to fetch locales:", err);
      } finally {
        setFetching(false);
      }
    }
    fetchLocales();
  }, [user]);

  async function handleDelete(localeId) {
    await deleteDoc(doc(db, "users", user.uid, "generatedLocales", localeId));
    setLocales((prev) => prev.filter((l) => l.id !== localeId));
  }

  if (loading || fetching)
    return <div className={styles.loading}>Loading...</div>;
  if (!user)
    return (
      <div className={styles.loading}>Please sign in to view your profile.</div>
    );

  const allSwatches = locales.flatMap((l) => l.palette || []);

  return (
    <div className={styles.page}>
      <TopBanner leftText="Back to Atlas" leftTo="/atlas" />

      {allSwatches.length > 0 && (
        <div className={styles.colorStrip}>
          {allSwatches.map((swatch, i) => (
            <div
              key={i}
              title={swatch.name}
              className={styles.colorSegment}
              style={{ background: swatch.hex }}
            />
          ))}
        </div>
      )}

      <div className={styles.header}>
        <div className={styles.userRow}>
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt={user.displayName}
              className={styles.avatar}
            />
          )}
          <div>
            <p className={styles.eyebrow}>My Palettes</p>
            <h1 className={styles.headline}>{user.displayName}</h1>
          </div>
        </div>

        <div className={styles.metaRow}>
          <p className={styles.count}>
            {locales.length} locale{locales.length !== 1 ? "s" : ""} generated
          </p>
          <button
            className={styles.generateBtn}
            onClick={() => navigate("/atlas")}
          >
            + Generate New Locale
          </button>
        </div>

        <div className={styles.divider} />
      </div>

      {locales.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>
            No palettes yet — generate your first locale from an album.
          </p>
          <button
            className={styles.atlasBtn}
            onClick={() => navigate("/atlas")}
          >
            Go to Atlas
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {locales.map((locale) => (
            <ProfileLocaleCard
              key={locale.id}
              locale={locale}
              onShare={() => setSharingLocale(locale)}
              onDelete={() => handleDelete(locale.id)}
            />
          ))}
        </div>
      )}

      {sharingLocale && (
        <ShareToAtlasModal
          locale={sharingLocale}
          onClose={() => setSharingLocale(null)}
          onSuccess={() => setSharingLocale(null)}
        />
      )}
    </div>
  );
}
