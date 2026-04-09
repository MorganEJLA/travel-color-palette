import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import TopBanner from "../components/layout/TopBanner";
import NewAlbumModal from "../components/modals/NewAlbumModal";
import AlbumCard from "../components/atlas/AlbumCard";
import styles from "./AtlasHome.module.css";

export default function AtlasHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [albums, setAlbums] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlbums() {
      try {
        const snapshot = await getDocs(collection(db, "albums"));
        const fetched = snapshot.docs.map((doc) => {
          const data = doc.data();
          const allLocales = data.islands?.flatMap((i) => i.locales) || [];
          return {
            id: doc.id,
            name: data.name,
            country: data.country,
            localeCount: allLocales.length,
            previewColors:
              data.islands?.[0]?.locales?.[0]?.palette
                ?.slice(0, 3)
                .map((s) => s.hex) || [],
          };
        });
        setAlbums(fetched);
      } catch (err) {
        console.error("Failed to fetch albums:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAlbums();
  }, []);

  async function handleDelete(albumId) {
    await deleteDoc(doc(db, "albums", albumId));
    setAlbums((prev) => prev.filter((a) => a.id !== albumId));
  }

  async function handleRename(albumId, newName) {
    const ref = doc(db, "albums", albumId);
    await setDoc(ref, { name: newName }, { merge: true });
    setAlbums((prev) =>
      prev.map((a) => (a.id === albumId ? { ...a, name: newName } : a)),
    );
  }

  async function handleCountryRename(albumId, newCountry) {
    const ref = doc(db, "albums", albumId);
    await setDoc(ref, { country: newCountry }, { merge: true });
    setAlbums((prev) =>
      prev.map((a) => (a.id === albumId ? { ...a, country: newCountry } : a)),
    );
  }

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.page}>
      <TopBanner onSignOut={() => {}} />

      <div className={styles.header}>
        <p className={styles.eyebrow}>Chromaterra</p>
        <h1 className={styles.headline}>Atlas</h1>
        <div className={styles.divider} />
      </div>

      <div className={styles.grid}>
        {albums.map((album) => (
          <AlbumCard
            key={album.id}
            album={album}
            user={user}
            onClick={() => navigate(`/${album.id}`)}
            onDelete={() => handleDelete(album.id)}
            onRename={(newName) => handleRename(album.id, newName)}
            onCountryRename={(newCountry) =>
              handleCountryRename(album.id, newCountry)
            }
          />
        ))}

        {user && (
          <div
            className={styles.newAlbumCard}
            onClick={() => setShowModal(true)}
          >
            <span className={styles.newAlbumLabel}>+ New Album</span>
          </div>
        )}
      </div>

      {showModal && (
        <NewAlbumModal
          onClose={() => setShowModal(false)}
          onSave={async (newAlbum) => {
            await setDoc(doc(db, "albums", newAlbum.id), newAlbum);
            setAlbums((prev) => [
              ...prev,
              {
                id: newAlbum.id,
                name: newAlbum.name,
                country: newAlbum.country,
                localeCount: 0,
                previewColors: [],
              },
            ]);
          }}
        />
      )}
    </div>
  );
}
