import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import data from "../data/locales.json";

import LocaleHero from "../components/LocaleHero";
import PalettePanel from "../components/PalettePanel";
import GradientTool from "../components/GradientTool";
import FontPairingPanel from "../components/FontPairingPanel";
import StylePreview from "../components/StylePreview";
import Footer from "../components/Footer";

const allLocales = data.world.flatMap((region) =>
  region.places.flatMap((place) =>
    place.islands.flatMap((island) =>
      island.locales.map((locale) => ({
        ...locale,
        placeName: place.name,
        islandName: island.name,
        islandId: island.id,
        regionName: region.region,
      })),
    ),
  ),
);

function loadFont(googleUrl) {
  const existing = document.querySelector(`link[href="${googleUrl}"]`);
  if (existing) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = googleUrl;
  document.head.appendChild(link);
}

export default function LocaleView() {
  const { albumId, islandId, localeId } = useParams();
  const navigate = useNavigate();
  const locale = allLocales.find(
    (l) => l.id === localeId && l.islandId === islandId,
  );

  useEffect(() => {
    if (locale?.fonts?.googleUrl) loadFont(locale.fonts.googleUrl);
  }, [locale]);

  if (!locale) return <p>Locale not found.</p>;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F0EBE0",
        color: "#1A1A18",
        fontFamily: "'Montserrat', sans-serif",
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
      }}
    >
      {/* TOP BANNER */}
      <div
        style={{
          background: "#1A1A18",
          padding: "0.4rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => navigate(`/${albumId}`)}
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            color: "#888",
            textTransform: "uppercase",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          ← {locale.placeName}
        </button>
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            color: "#888",
            textTransform: "uppercase",
          }}
        >
          Chromaterra
        </span>
      </div>

      {/* HERO */}
      <LocaleHero locale={locale} />

      {/* MAIN CONTENT */}
      <main style={{ padding: "2.5rem", maxWidth: "1200px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "2rem",
          }}
        >
          <PalettePanel locale={locale} />
          <GradientTool locale={locale} />
          <div
            style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
          >
            <FontPairingPanel locale={locale} />
            <StylePreview locale={locale} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
