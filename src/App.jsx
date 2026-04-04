import { useState, useEffect } from "react";
import data from "./data/locales.json";

import Footer from "./components/Footer";
import Header from "./components/Header";
import LocaleNav from "./components/LocaleNav";
import FontPairingPanel from "./components/FontPairingPanel";
import PalettePanel from "./components/PalettePanel";
import StylePreview from "./components/StylePreview";
import LocaleHero from "./components/LocaleHero";
import GradientTool from "./components/GradientTool";
import LocaleGenerator from "./components/LocaleGenerator";

const baseLocales = data.world.flatMap((region) =>
  region.places.flatMap((place) =>
    place.locales.map((locale) => ({
      ...locale,
      placeName: place.name,
      regionName: region.region,
    })),
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

export default function App() {
  const [allLocales, setAllLocales] = useState(baseLocales);
  const [activeId, setActiveId] = useState(baseLocales[0].id);
  const [view, setView] = useState("atlas");
  const locale = allLocales.find((l) => l.id === activeId);

  useEffect(() => {
    if (locale?.fonts?.googleUrl) loadFont(locale.fonts.googleUrl);
  }, [locale]);

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
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            color: "#888",
            textTransform: "uppercase",
          }}
        >
          Est. 2025 — Global Aesthetic Reference
        </span>
        <button
          onClick={() => setView(view === "atlas" ? "generate" : "atlas")}
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            padding: "0.25rem 0.75rem",
            background: "transparent",
            color: view === "generate" ? "#F0EBE0" : "#888",
            border: `1px solid ${view === "generate" ? "#F0EBE0" : "#555"}`,
            cursor: "pointer",
          }}
        >
          {view === "atlas" ? "Generate Locale" : "← Atlas"}
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
          Vol. I — The Azores
        </span>
      </div>

      {/* VIEW TOGGLE */}
      {view === "atlas" ? (
        <>
          <Header locale={locale} />
          <LocaleNav
            allLocales={allLocales}
            activeId={activeId}
            setActiveId={setActiveId}
          />
          <LocaleHero locale={locale} />
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
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "2rem",
                }}
              >
                <FontPairingPanel locale={locale} />
                <StylePreview locale={locale} />
              </div>
            </div>
          </main>
        </>
      ) : (
        <LocaleGenerator
          onSave={(newLocale) => {
            setAllLocales((prev) => [...prev, newLocale]);
            setActiveId(newLocale.id);
            setView("atlas");
          }}
        />
      )}

      <Footer />
    </div>
  );
}
