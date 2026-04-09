import imageCompression from "browser-image-compression";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import TopBanner from "../components/layout/TopBanner";
import LocaleHero from "../components/layout/LocaleHero";
import PalettePanel from "../components/panels/PalettePanel";
import GradientTool from "../components/panels/GradientTool";
import StylePreview from "../components/StylePreview";
import FontPairingPanel from "../components/panels/FontPairingPanel";
import styles from "./GeneratorView.module.css";
import { FONT_PAIRS } from "../data/fontPairs";
import { loadFont } from "../utils/loadFont";
import { useAuth } from "../hooks/useAuth";

export default function GeneratorView() {
  const { albumId, islandId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [place, setPlace] = useState(null);
  const [island, setIsland] = useState(null);
  const [fontMood, setFontMood] = useState("Serif & Classic");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generatedLocale, setGeneratedLocale] = useState(null);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: "",
  });
  const [generateCount, setGenerateCount] = useState(0);
  const MAX_GENERATES = 5;
  const MAX_IMAGES = 7;

  useEffect(() => {
    async function fetchAlbum() {
      try {
        const snap = await getDoc(doc(db, "albums", albumId));
        if (snap.exists()) {
          const albumData = snap.data();
          setPlace(albumData);
          const foundIsland = albumData.islands.find((i) => i.id === islandId);
          setIsland(foundIsland);
        }
      } catch (err) {
        console.error("Failed to fetch album:", err);
        setError("Failed to load album data");
      }
    }
    fetchAlbum();
  }, [albumId, islandId]);

  function handleFormChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleImageUpload(e) {
    if (e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    const options = {
      maxSizeMB: 0.3,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    };
    const compressed = await Promise.all(
      files.map((f) => imageCompression(f, options)),
    );
    setImages((prev) => {
      const combined = [...prev, ...compressed];
      return combined.slice(0, MAX_IMAGES);
    });
  }

  async function toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleGenerate() {
    if (generateCount >= MAX_GENERATES) {
      setError("Maximum generations reached for this session.");
      return;
    }
    if (!form.name || images.length === 0) {
      setError("Please enter a locale name and upload at least one image.");
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedLocale(null);

    try {
      const imageContents = await Promise.all(
        images.map(async (file) => ({
          type: "image",
          source: {
            type: "base64",
            media_type: file.type,
            data: await toBase64(file),
          },
        })),
      );
      const pairs = FONT_PAIRS[fontMood];
      const selectedPair = pairs[Math.floor(Math.random() * pairs.length)];

      const prompt = `You are a color research tool for a design atlas called Chromaterra.

    I am analyzing images from: ${form.name}, located on ${island?.name || ""}, in the ${place?.name || ""}.

    Analyze all the images and extract a color palette that represents the true visual character of this location.

    Return ONLY a valid JSON object with no markdown, no backticks, no explanation:

    {
    "id": "${form.name.toLowerCase().replace(/\s+/g, "-")}",
    "name": "${form.name}",
    "placeName": "${place?.name || ""}",
    "islandName": "${island?.name || ""}",
    "islandId": "${islandId}",
    "regionName": "Atlantic Islands",
    "mood": "A 1-2 sentence evocative description of the location.",
    "palette": [
        { "name": "Swatch Name 1", "hex": "#xxxxxx" },
        { "name": "Swatch Name 2", "hex": "#xxxxxx" },
        { "name": "Swatch Name 3", "hex": "#xxxxxx" },
        { "name": "Swatch Name 4", "hex": "#xxxxxx" },
        { "name": "Swatch Name 5", "hex": "#xxxxxx" }
    ],
    "fonts": {
        "display": "${selectedPair.display}",
        "displayWeight": "${selectedPair.displayWeight}",
        "body": "${selectedPair.body}",
        "mono": "${selectedPair.mono}",
        "googleUrl": "${selectedPair.googleUrl}",
        "note": "A short note about why these fonts suit the location."
    }
    }

    Rules:
    - Swatch names should be poetic and location-specific
    - Hex values must be accurate to what you see in the images
    - Mood should be evocative and under 30 words
    - Palette order matters: swatch 1 is the background color, swatch 2 is primary text/UI, swatch 3 is secondary/accent, swatch 4 is the hero text color, swatch 5 is a supporting tone
    - Swatch 4 must meet WCAG AA contrast compliance — a minimum contrast ratio of 4.5:1 against swatch 1. Prefer light neutrals like cream, off-white, pale stone, or mist that feel appropriate to the location
    - Return ONLY the JSON, nothing else.`;

      const response = await fetch("/api/anthropic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: [...imageContents, { type: "text", text: prompt }],
            },
          ],
        }),
      });

      const data = await response.json();
      console.log("API response:", JSON.stringify(data));
      const text = data.content[0].text;
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setGeneratedLocale(parsed);
      if (parsed.fonts?.googleUrl) loadFont(parsed.fonts.googleUrl);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Check the console for details.");
    }
    setGenerateCount((prev) => prev + 1);
    setLoading(false);
  }
  async function handleSave() {
    if (!user) {
      setError("You need to be signed in to save.");
      return;
    }
    const userLocaleRef = doc(
      db,
      "users",
      user.uid,
      "generatedLocales",
      generatedLocale.id,
    );
    await setDoc(userLocaleRef, {
      ...generatedLocale,
      savedAt: new Date().toISOString(),
    });
    navigate("/profile");
  }
  return (
    <div className={styles.page}>
      <TopBanner leftText={`← ${place?.name}`} leftTo={`/${albumId}`} />

      <div className={styles.content}>
        {/* Header */}
        <div className={styles.pageHeader}>
          <span className={styles.pageHeaderLabel}>
            Add Locale — {island?.name}
          </span>
          <div className={styles.pageHeaderDivider} />
        </div>

        {/* Form */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Locale Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleFormChange}
            placeholder="e.g. Mistérios Negros"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Font Mood</label>
          <select
            value={fontMood}
            onChange={(e) => setFontMood(e.target.value)}
            className={styles.select}
          >
            {Object.keys(FONT_PAIRS).map((mood) => (
              <option key={mood} value={mood}>
                {mood}
              </option>
            ))}
          </select>
        </div>

        {/* Upload */}
        <div className={styles.uploadGroup}>
          <label className={styles.label}>Reference Images</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className={styles.fileInput}
          />
          {images.length > 0 && (
            <div>
              <div className={styles.imagePreviews}>
                {images.map((file, i) => (
                  <div key={i} className={styles.imageThumb}>
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`upload ${i + 1}`}
                    />
                    <button
                      className={styles.removeImageBtn}
                      onClick={() => {
                        setImages((prev) => {
                          const updated = prev.filter((_, idx) => idx !== i);
                          if (updated.length === 0 && fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                          return updated;
                        });
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <button
                className={styles.clearBtn}
                onClick={() => {
                  setImages([]);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={loading || generateCount >= MAX_GENERATES}
          className={styles.generateBtn}
        >
          {loading ? "Analyzing images..." : "Generate Locale"}
        </button>

        {error && <p className={styles.error}>{error}</p>}

        {/* Generated result */}
        {generatedLocale && (
          <>
            <LocaleHero locale={generatedLocale} />
            <div className={styles.resultGrid}>
              <PalettePanel locale={generatedLocale} />
              <GradientTool locale={generatedLocale} />
              <FontPairingPanel locale={generatedLocale} />
            </div>
            <div className={styles.stylePreviewWrap}>
              <StylePreview locale={generatedLocale} />
            </div>
            <div className={styles.saveRow}>
              <button className={styles.saveBtn} onClick={handleSave}>
                Save to Atlas
              </button>
              <button
                className={styles.editBtn}
                onClick={() => setGeneratedLocale(null)}
              >
                Edit Images
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
