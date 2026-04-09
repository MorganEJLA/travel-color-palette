import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import LocaleHero from "../components/layout/LocaleHero";
import PalettePanel from "../components/panels/PalettePanel";
import GradientTool from "../components/panels/GradientTool";
import FontPairingPanel from "../components/panels/FontPairingPanel";
import StylePreview from "../components/StylePreview";
import Footer from "../components/layout/Footer";
import TopBanner from "../components/layout/TopBanner";
import NotFound from "./NotFound";
import { loadFont } from "../utils/loadFont";
import styles from "./LocaleView.module.css";

export default function LocaleView() {
  const { albumId, islandId, localeId } = useParams();
  const [locale, setLocale] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLocale() {
      try {
        const snap = await getDoc(doc(db, "albums", albumId));
        if (snap.exists()) {
          const albumData = snap.data();
          const island = albumData.islands.find((i) => i.id === islandId);
          const found = island?.locales.find((l) => l.id === localeId);
          if (found) {
            setLocale({
              ...found,
              placeName: albumData.name,
              islandName: island.name,
              islandId: island.id,
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch locale:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLocale();
  }, [albumId, islandId, localeId]);

  useEffect(() => {
    if (locale?.fonts?.googleUrl) loadFont(locale.fonts.googleUrl);
  }, [locale]);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (!locale) return <NotFound />;

  return (
    <div className={styles.page}>
      <TopBanner leftText="← Back" leftTo={`/${albumId}`} />
      <LocaleHero locale={locale} />
      <main className={styles.main}>
        <div className={styles.grid}>
          <PalettePanel locale={locale} />
          <GradientTool locale={locale} />
          <div className={styles.panelStack}>
            <FontPairingPanel locale={locale} />
            <StylePreview locale={locale} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
