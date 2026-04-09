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
import DeleteButton from "../components/buttons/DeleteButton";
import { useInlineEdit } from "../hooks/useInlineEdit";

const ghostButtonStyle = {
  fontFamily: "'DM Mono', monospace",
  fontSize: "0.55rem",
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: "#888",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  padding: 0,
};

function AlbumCard({ album, user, onClick, onDelete, onRename }) {
  const { editing, value, setValue, start, save, handleKeyDown } =
    useInlineEdit(album.name, onRename);

  return (
    <div
      onClick={!editing ? onClick : undefined}
      style={{
        border: "1px solid #C8C0B0",
        background: "#F0EBE0",
        cursor: editing ? "default" : "pointer",
        transition: "transform 0.1s",
      }}
      onMouseEnter={(e) =>
        !editing && (e.currentTarget.style.transform = "translateY(-2px)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div style={{ display: "flex", height: "6px" }}>
        {album.previewColors.map((hex, i) => (
          <div key={i} style={{ flex: 1, background: hex }} />
        ))}
      </div>
      <div style={{ padding: "1.25rem" }}>
        <p
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.55rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#888",
            margin: "0 0 0.4rem 0",
          }}
        >
          {album.country}
        </p>

        {editing ? (
          <input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            style={{
              fontFamily: "'Abril Fatface', cursive",
              fontSize: "1.8rem",
              fontWeight: 400,
              color: "#1A1A18",
              border: "none",
              borderBottom: "1px solid #1A1A18",
              background: "transparent",
              outline: "none",
              width: "100%",
              margin: "0 0 0.75rem 0",
              lineHeight: 1,
            }}
          />
        ) : (
          <h2
            style={{
              fontFamily: "'Abril Fatface', cursive",
              fontSize: "1.8rem",
              fontWeight: 400,
              color: "#1A1A18",
              margin: "0 0 0.75rem 0",
              lineHeight: 1,
            }}
          >
            {album.name}
          </h2>
        )}

        <p
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.6rem",
            color: "#888",
            letterSpacing: "0.1em",
            margin: "0 0 0.5rem 0",
          }}
        >
          {album.localeCount} locale{album.localeCount !== 1 ? "s" : ""}
        </p>

        {user && (
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            {editing ? (
              <button onClick={save} style={ghostButtonStyle}>
                Save
              </button>
            ) : (
              <button onClick={start} style={ghostButtonStyle}>
                Edit
              </button>
            )}
            <DeleteButton
              label={album.name}
              variant="text"
              onDelete={onDelete}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function AtlasHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [albums, setAlbums] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlbums() {
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
      setLoading(false);
    }
    fetchAlbums();
  }, []);

  if (loading)
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

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F0EBE0",
        fontFamily: "'Montserrat', sans-serif",
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
      }}
    >
      <TopBanner onSignOut={() => {}} />

      <div style={{ padding: "3rem 2.5rem 2rem" }}>
        <p
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#888",
            marginBottom: "0.5rem",
          }}
        >
          Chromaterra
        </p>
        <h1
          style={{
            fontFamily: "'Abril Fatface', cursive",
            fontSize: "clamp(3rem, 8vw, 6rem)",
            fontWeight: 400,
            lineHeight: 0.9,
            color: "#1A1A18",
            margin: "0 0 0.5rem 0",
          }}
        >
          My Atlas
        </h1>
        <div
          style={{
            height: "1px",
            width: "100%",
            background: "#C8C0B0",
            margin: "1.5rem 0",
          }}
        />
      </div>

      <div
        style={{
          padding: "0 2.5rem 2.5rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {albums.map((album) => (
          <AlbumCard
            key={album.id}
            album={album}
            user={user}
            onClick={() => navigate(`/${album.id}`)}
            onDelete={async () => {
              await deleteDoc(doc(db, "albums", album.id));
              setAlbums((prev) => prev.filter((a) => a.id !== album.id));
            }}
            onRename={async (newName) => {
              const ref = doc(db, "albums", album.id);
              await setDoc(ref, { name: newName }, { merge: true });
              setAlbums((prev) =>
                prev.map((a) =>
                  a.id === album.id ? { ...a, name: newName } : a,
                ),
              );
            }}
            onCountryRename={async (newCountry) => {
              const ref = doc(db, "albums", album.id);
              await setDoc(ref, { country: newCountry }, { merge: true });
              setAlbums((prev) =>
                prev.map((a) =>
                  a.id === album.id ? { ...a, country: newCountry } : a,
                ),
              );
            }}
          />
        ))}

        {user && (
          <div
            onClick={() => setShowModal(true)}
            style={{
              border: "1px dashed #C8C0B0",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "120px",
              padding: "1.25rem",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "#1A1A18")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "#C8C0B0")
            }
          >
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#888",
              }}
            >
              + New Album
            </span>
          </div>
        )}

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
    </div>
  );
}
