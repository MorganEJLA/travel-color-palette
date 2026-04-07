import { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function ShareToAtlasModal({ locale, onClose, onSuccess }) {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState("");
  const [selectedIslandId, setSelectedIslandId] = useState("");
  const [islands, setIslands] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAlbums() {
      const snap = await getDocs(collection(db, "albums"));
      const fetched = snap.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        islands: doc.data().islands || [],
      }));
      setAlbums(fetched);
      if (fetched.length > 0) {
        setSelectedAlbumId(fetched[0].id);
        setIslands(fetched[0].islands);
        if (fetched[0].islands.length > 0) {
          setSelectedIslandId(fetched[0].islands[0].id);
        }
      }
    }
    fetchAlbums();
  }, []);

  function handleAlbumChange(e) {
    const albumId = e.target.value;
    setSelectedAlbumId(albumId);
    const album = albums.find((a) => a.id === albumId);
    setIslands(album?.islands || []);
    setSelectedIslandId(album?.islands?.[0]?.id || "");
  }

  async function handleShare() {
    if (!selectedAlbumId || !selectedIslandId) {
      setError("Please select an album and island.");
      return;
    }
    setSaving(true);
    setError(null);

    try {
      const albumRef = doc(db, "albums", selectedAlbumId);
      const albumSnap = await getDoc(albumRef);
      const albumData = albumSnap.data();

      const updatedIslands = albumData.islands.map((island) => {
        if (island.id === selectedIslandId) {
          const alreadyExists = island.locales.some((l) => l.id === locale.id);
          if (alreadyExists) return island;
          return {
            ...island,
            locales: [
              ...island.locales,
              { ...locale, sharedFromProfile: true },
            ],
          };
        }
        return island;
      });

      await setDoc(albumRef, { ...albumData, islands: updatedIslands });
      onSuccess();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    }
    setSaving(false);
  }

  const inputStyle = {
    width: "100%",
    fontFamily: "'DM Mono', monospace",
    fontSize: "0.72rem",
    padding: "0.5rem 0.75rem",
    border: "1px solid #C8C0B0",
    background: "#F0EBE0",
    color: "#1A1A18",
    boxSizing: "border-box",
    marginTop: "0.4rem",
  };

  const labelStyle = {
    fontFamily: "'DM Mono', monospace",
    fontSize: "0.6rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "#888",
    display: "block",
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(26, 26, 24, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#F0EBE0",
          padding: "3rem",
          width: "100%",
          maxWidth: "440px",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.58rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#999",
                marginBottom: "0.5rem",
              }}
            >
              Share to Public Atlas
            </p>
            <h2
              style={{
                fontFamily: "'Abril Fatface', cursive",
                fontSize: "2rem",
                fontWeight: 400,
                color: "#1A1A18",
                lineHeight: 1,
              }}
            >
              {locale.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.6rem",
              color: "#aaa",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        {/* Palette preview */}
        <div style={{ display: "flex", height: "8px" }}>
          {locale.palette?.map((s, i) => (
            <div key={i} style={{ flex: 1, background: s.hex }} />
          ))}
        </div>

        <div style={{ height: "1px", background: "#C8C0B0" }} />

        {/* Album dropdown */}
        <div>
          <label style={labelStyle}>Album</label>
          <select
            value={selectedAlbumId}
            onChange={handleAlbumChange}
            style={inputStyle}
          >
            {albums.map((album) => (
              <option key={album.id} value={album.id}>
                {album.name}
              </option>
            ))}
          </select>
        </div>

        {/* Island dropdown */}
        <div>
          <label style={labelStyle}>Island / Area</label>
          <select
            value={selectedIslandId}
            onChange={(e) => setSelectedIslandId(e.target.value)}
            style={inputStyle}
          >
            {islands.map((island) => (
              <option key={island.id} value={island.id}>
                {island.name}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.6rem",
              color: "red",
              margin: 0,
            }}
          >
            {error}
          </p>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            onClick={handleShare}
            disabled={saving}
            style={{
              flex: 1,
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              padding: "0.8rem 1.6rem",
              background: saving ? "#888" : "#1A1A18",
              color: "#F0EBE0",
              border: "none",
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "Sharing..." : "Share to Atlas →"}
          </button>
          <button
            onClick={onClose}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              padding: "0.8rem 1.6rem",
              background: "transparent",
              color: "#888",
              border: "1px solid #C8C0B0",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
