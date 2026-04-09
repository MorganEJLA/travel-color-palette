import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import NewIslandModal from "../components/modals/NewIslandModal";
import DeleteButton from "../components/buttons/DeleteButton";
import TopBanner from "../components/layout/TopBanner";
import { useAuth } from "../hooks/useAuth";
import { useAuthGate } from "../hooks/useAuthGate";
import { useInlineEdit } from "../hooks/useInlineEdit";
import NotFound from "./NotFound";

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

function IslandNameEdit({ island, albumId, onRename }) {
  const { editing, value, setValue, start, save, handleKeyDown } =
    useInlineEdit(island.name, async (newName) => {
      const albumRef = doc(db, "albums", albumId);
      const snap = await getDoc(albumRef);
      const albumData = snap.data();
      const updatedIslands = albumData.islands.map((i) =>
        i.id === island.id ? { ...i, name: newName } : i,
      );
      await setDoc(albumRef, { ...albumData, islands: updatedIslands });
      onRename(newName);
    });

  if (editing) {
    return (
      <div
        style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
        onClick={(e) => e.stopPropagation()}
      >
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#888",
            border: "none",
            borderBottom: "1px solid #888",
            background: "transparent",
            outline: "none",
          }}
        />
        <button onClick={save} style={ghostButtonStyle}>
          Save
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <span
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.6rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#888",
        }}
      >
        {island.name}
      </span>
      <button onClick={start} style={ghostButtonStyle}>
        Edit
      </button>
    </div>
  );
}

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
      const snap = await getDoc(doc(db, "albums", albumId));
      if (snap.exists()) {
        setPlace(snap.data());
      }
      setLoading(false);
    }
    fetchAlbum();
  }, [albumId]);

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

  if (!place) return <NotFound />;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F0EBE0",
        fontFamily: "'Montserrat', sans-serif",
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
      }}
    >
      <TopBanner leftText="← My Atlas" leftTo="/atlas" onSignOut={() => {}} />

      <div
        style={{
          padding: "3rem 2.5rem 2rem",
          borderBottom: "3px solid #1A1A18",
        }}
      >
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
          Chromaterra — {place.country}
        </p>
        <h1
          style={{
            fontFamily: "'Abril Fatface', cursive",
            fontSize: "clamp(3rem, 8vw, 6rem)",
            fontWeight: 400,
            lineHeight: 0.9,
            color: "#1A1A18",
            margin: 0,
          }}
        >
          {place.name}
        </h1>
      </div>

      <div style={{ padding: "2.5rem" }}>
        {place.islands.map((island) => (
          <div key={island.id} style={{ marginBottom: "3rem" }}>
            {/* Island header row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              {user ? (
                <IslandNameEdit
                  island={island}
                  albumId={albumId}
                  onRename={(newName) => {
                    setPlace((prev) => ({
                      ...prev,
                      islands: prev.islands.map((i) =>
                        i.id === island.id ? { ...i, name: newName } : i,
                      ),
                    }));
                  }}
                />
              ) : (
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#888",
                  }}
                >
                  {island.name}
                </span>
              )}

              <div style={{ flex: 1, height: "1px", background: "#C8C0B0" }} />

              {user && (
                <DeleteButton
                  label={island.name}
                  onDelete={async () => {
                    const albumRef = doc(db, "albums", albumId);
                    const snap = await getDoc(albumRef);
                    const albumData = snap.data();
                    const updatedIslands = albumData.islands.filter(
                      (i) => i.id !== island.id,
                    );
                    await setDoc(albumRef, {
                      ...albumData,
                      islands: updatedIslands,
                    });
                    setPlace({ ...albumData, islands: updatedIslands });
                  }}
                />
              )}
            </div>

            {/* Locale cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {island.locales.map((locale) => (
                <div
                  key={locale.id}
                  onClick={() =>
                    navigate(`/${albumId}/${island.id}/${locale.id}`)
                  }
                  style={{
                    border: "1px solid #C8C0B0",
                    background: "#F0EBE0",
                    cursor: "pointer",
                    transition: "transform 0.1s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "translateY(-2px)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "translateY(0)")
                  }
                >
                  <div style={{ display: "flex", height: "6px" }}>
                    {locale.palette.slice(0, 3).map((s, i) => (
                      <div key={i} style={{ flex: 1, background: s.hex }} />
                    ))}
                  </div>
                  <div style={{ padding: "1.25rem" }}>
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
                      {locale.name}
                    </h2>
                    <p
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.6rem",
                        color: "#888",
                        letterSpacing: "0.05em",
                        lineHeight: 1.5,
                        margin: "0 0 0.75rem 0",
                      }}
                    >
                      {locale.mood}
                    </p>
                    {user && (
                      <DeleteButton
                        label={locale.name}
                        variant="text"
                        onDelete={async () => {
                          const albumRef = doc(db, "albums", albumId);
                          const snap = await getDoc(albumRef);
                          const albumData = snap.data();
                          const updatedIslands = albumData.islands.map(
                            (isl) => {
                              if (isl.id === island.id) {
                                return {
                                  ...isl,
                                  locales: isl.locales.filter(
                                    (l) => l.id !== locale.id,
                                  ),
                                };
                              }
                              return isl;
                            },
                          );
                          await setDoc(albumRef, {
                            ...albumData,
                            islands: updatedIslands,
                          });
                          setPlace({ ...albumData, islands: updatedIslands });
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}

              <div
                onClick={() =>
                  authGate(() => navigate(`/${albumId}/${island.id}/generate`))
                }
                style={{
                  border: "1px dashed #C8C0B0",
                  background: "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "120px",
                  transition: "border-color 0.1s",
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
                  + Add Neighborhood
                </span>
              </div>
            </div>
          </div>
        ))}

        <div
          onClick={() => authGate(() => setShowIslandModal(true))}
          style={{
            border: "1px dashed #C8C0B0",
            background: "transparent",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            marginTop: "1rem",
            transition: "border-color 0.1s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#1A1A18")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#C8C0B0")}
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
            + Add Area
          </span>
        </div>
      </div>

      {showIslandModal && (
        <NewIslandModal
          onClose={() => setShowIslandModal(false)}
          onSave={async (newIsland) => {
            const albumRef = doc(db, "albums", albumId);
            const snap = await getDoc(albumRef);
            const albumData = snap.data();
            const updatedIslands = [...albumData.islands, newIsland];
            await setDoc(albumRef, { ...albumData, islands: updatedIslands });
            setPlace({ ...albumData, islands: updatedIslands });
            setShowIslandModal(false);
          }}
        />
      )}

      <SignInGate />
    </div>
  );
}
