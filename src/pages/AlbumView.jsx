import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import NewIslandModal from "../components/modals/NewIslandModal";
import DeleteButton from "../components/buttons/DeleteButton";
import TopBanner from "../components/layout/TopBanner";
import { useAuth } from "../hooks/useAuth";
import { useAuthGate } from "../hooks/useAuthGate";
import IslandNameEdit from "../components/atlas/IslandNameEdit";
import LocaleCard from "../components/atlas/LocaleCard";
import styles from "./AlbumView.module.css";
import NotFound from "./NotFound";


export default function AlbumView() {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { authGate, SignInGate } = useAuthGate();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showIslandModal, setShowIslandModal] = useState(false);

  useEffect(() => {
    async function fetchAlbum() {
      try {
        const snap = await getDoc(doc(db, "albums", albumId));
        if (snap.exists()) setPlace(snap.data());
      } catch (err) {
        console.error("Failed to fetch album:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAlbum();
  }, [albumId]);

  async function handleDeleteIsland(islandId) {
    const albumRef = doc(db, "albums", albumId);
    const snap = await getDoc(albumRef);
    const albumData = snap.data();
    const updatedIslands = albumData.islands.filter((i) => i.id !== islandId);
    await setDoc(albumRef, { ...albumData, islands: updatedIslands });
    setPlace({ ...albumData, islands: updatedIslands });
  }

  async function handleDeleteLocale(islandId, localeId) {
    const albumRef = doc(db, "albums", albumId);
    const snap = await getDoc(albumRef);
    const albumData = snap.data();
    const updatedIslands = albumData.islands.map((isl) => {
      if (isl.id === islandId) {
        return {
          ...isl,
          locales: isl.locales.filter((l) => l.id !== localeId),
        };
      }
      return isl;
    });
    await setDoc(albumRef, { ...albumData, islands: updatedIslands });
    setPlace({ ...albumData, islands: updatedIslands });
  }

  async function handleAddIsland(newIsland) {
    const albumRef = doc(db, "albums", albumId);
    const snap = await getDoc(albumRef);
    const albumData = snap.data();
    const updatedIslands = [...albumData.islands, newIsland];
    await setDoc(albumRef, { ...albumData, islands: updatedIslands });
    setPlace({ ...albumData, islands: updatedIslands });
    setShowIslandModal(false);
  }

  function handleIslandRename(islandId, newName) {
    setPlace((prev) => ({
      ...prev,
      islands: prev.islands.map((i) =>
        i.id === islandId ? { ...i, name: newName } : i,
      ),
    }));
  }

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (!place) return <NotFound />;

  return (
    <div className={styles.page}>
      <TopBanner leftText="← Atlas" leftTo="/atlas" onSignOut={() => {}} />

      <div className={styles.header}>
        <p className={styles.eyebrow}>Chromaterra — {place.country}</p>
        <h1 className={styles.headline}>{place.name}</h1>
      </div>

      <div className={styles.content}>
        {place.islands.map((island) => (
          <div key={island.id} className={styles.islandSection}>
            {/* Island header row */}
            <div className={styles.islandHeader}>
              {user ? (
                <IslandNameEdit
                  island={island}
                  albumId={albumId}
                  onRename={(newName) => handleIslandRename(island.id, newName)}
                />
              ) : (
                <span className={styles.islandName}>{island.name}</span>
              )}
              <div className={styles.islandDivider} />
              {user && (
                <DeleteButton
                  label={island.name}
                  onDelete={() => handleDeleteIsland(island.id)}
                />
              )}
            </div>

            {/* Locale cards */}
            <div className={styles.grid}>
              {island.locales.map((locale) => (
                <LocaleCard
                  key={locale.id}
                  locale={locale}
                  island={island}
                  albumId={albumId}
                  user={user}
                  onDelete={() => handleDeleteLocale(island.id, locale.id)}
                />
              ))}

              <div
                className={styles.addCard}
                onClick={() =>
                  authGate(() => navigate(`/${albumId}/${island.id}/generate`))
                }
              >
                <span className={styles.addLabel}>+ Add Neighborhood</span>
              </div>
            </div>
          </div>
        ))}

        <div
          className={styles.addAreaCard}
          onClick={() => authGate(() => setShowIslandModal(true))}
        >
          <span className={styles.addLabel}>+ Add Area</span>
        </div>
      </div>

      {showIslandModal && (
        <NewIslandModal
          onClose={() => setShowIslandModal(false)}
          onSave={handleAddIsland}
        />
      )}

      <SignInGate />
    </div>
  );
}
