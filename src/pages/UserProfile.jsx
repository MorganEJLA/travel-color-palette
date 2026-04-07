import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../hooks/useAuth";
import TopBanner from "../components/layout/TopBanner";
import DeleteButton from "../components/buttons/DeleteButton";
import ShareToAtlasModal from "../components/modals/ShareToAtlasModal";

export default function UserProfile() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [locales, setLocales] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [sharingLocale, setSharingLocale] = useState(null);
  useEffect(() => {
    if (!user) return;
    async function fetchLocales() {
      const snap = await getDocs(
        collection(db, "users", user.uid, "generatedLocales"),
      );
      const fetched = snap.docs.map((doc) => doc.data());
      setLocales(fetched);
      setFetching(false);
    }
    fetchLocales();
  }, [user]);

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

  if (!user)
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
        Please sign in to view your profile.
      </div>
    );

  // Build personal color strip from all palette swatches
  const allSwatches = locales.flatMap((l) => l.palette || []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F0EBE0",
        fontFamily: "'DM Mono', monospace",
      }}
    >
      <TopBanner leftText="Back to Atlas" leftTo="/atlas" />

      {/* Personal color strip */}
      {allSwatches.length > 0 && (
        <div style={{ display: "flex", height: "8px" }}>
          {allSwatches.map((swatch, i) => (
            <div
              key={i}
              title={swatch.name}
              style={{ flex: 1, background: swatch.hex }}
            />
          ))}
        </div>
      )}

      {/* Header */}
      <div style={{ padding: "3rem 2.5rem 2rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt={user.displayName}
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          )}
          <div>
            <p
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#888",
                margin: 0,
                marginBottom: "0.25rem",
              }}
            >
              My Palettes
            </p>
            <h1
              style={{
                fontFamily: "'Abril Fatface', cursive",
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                fontWeight: 400,
                lineHeight: 0.9,
                color: "#1A1A18",
                margin: 0,
              }}
            >
              {user.displayName}
            </h1>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <p
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.58rem",
              letterSpacing: "0.1em",
              color: "#aaa",
              margin: 0,
            }}
          >
            {locales.length} locale{locales.length !== 1 ? "s" : ""} generated
          </p>
          <button
            onClick={() => navigate("/atlas")}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.55rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              padding: "0.4rem 1rem",
              background: "transparent",
              color: "#1A1A18",
              border: "1px solid #C8C0B0",
              cursor: "pointer",
            }}
          >
            + Generate New Locale
          </button>
        </div>

        <div
          style={{
            height: "1px",
            width: "100%",
            background: "#C8C0B0",
            margin: "1.5rem 0 0",
          }}
        />
      </div>

      {/* Swatch grid */}
      {locales.length === 0 ? (
        <div style={{ padding: "0 2.5rem" }}>
          <p
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              color: "#888",
              textTransform: "uppercase",
            }}
          >
            No palettes yet — generate your first locale from an album.
          </p>
          <button
            onClick={() => navigate("/atlas")}
            style={{
              marginTop: "1rem",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              padding: "0.75rem 1.5rem",
              background: "#1A1A18",
              color: "#F0EBE0",
              border: "none",
              cursor: "pointer",
            }}
          >
            Go to Atlas
          </button>
        </div>
      ) : (
        <div
          style={{
            padding: "0 2.5rem 2.5rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {locales.map((locale) => (
            <div
              key={locale.id}
              onClick={() => navigate(`/profile/${locale.id}`)}
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
              {/* 5 swatches side by side */}
              <div style={{ display: "flex", height: "48px" }}>
                {locale.palette?.map((swatch, i) => (
                  <div
                    key={i}
                    title={swatch.name}
                    style={{ flex: 1, background: swatch.hex }}
                  />
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
                  {locale.islandName} — {locale.placeName}
                </p>
                <h2
                  style={{
                    fontFamily: "'Abril Fatface', cursive",
                    fontSize: "1.8rem",
                    fontWeight: 400,
                    color: "#1A1A18",
                    margin: "0 0 0.5rem 0",
                    lineHeight: 1,
                  }}
                >
                  {locale.name}
                </h2>
                <p
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.58rem",
                    color: "#888",
                    letterSpacing: "0.05em",
                    lineHeight: 1.6,
                    margin: "0 0 0.75rem 0",
                  }}
                >
                  {locale.mood}
                </p>
                <div
                  style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                >
                  {locale.palette?.map((swatch, i) => (
                    <span
                      key={i}
                      title={swatch.hex}
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.5rem",
                        letterSpacing: "0.1em",
                        color: "#aaa",
                        textTransform: "uppercase",
                      }}
                    >
                      {swatch.name}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSharingLocale(locale);
                }}
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.6rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  padding: "0.75rem 1.25rem",
                  background: "transparent",
                  color: "#888",
                  border: "none",
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left",
                }}
              >
                Share to Atlas
              </button>
              <DeleteButton
                label={locale.name}
                variant="text"
                style={{ padding: "0.75rem 1.25rem" }}
                onDelete={async () => {
                  await deleteDoc(
                    doc(db, "users", user.uid, "generatedLocales", locale.id),
                  );
                  setLocales((prev) => prev.filter((l) => l.id !== locale.id));
                }}
              />
            </div>
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
