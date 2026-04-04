import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import LocaleHero from "../components/LocaleHero";
import PalettePanel from "../components/PalettePanel";
import GradientTool from "../components/GradientTool";
import FontPairingPanel from "../components/FontPairingPanel";
import { FONT_PAIRS } from "../data/fontPairs";

export default function GeneratorView() {
  const { albumId, islandId } = useParams();
  const navigate = useNavigate();

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
  const MAX_GENERATES = 3;
  useEffect(() => {
    async function fetchAlbum() {
      const snap = await getDoc(doc(db, "albums", albumId));
      if (snap.exists()) {
        const albumData = snap.data();
        setPlace(albumData);
        const foundIsland = albumData.islands.find((i) => i.id === islandId);
        setIsland(foundIsland);
      }
    }
    fetchAlbum();
  }, [albumId, islandId]);
  function handleFormChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleImageUpload(e) {
    setImages(Array.from(e.target.files));
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
    - Return ONLY the JSON, nothing else`;

      const response = await fetch("/api/anthropic/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
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
      const text = data.content[0].text;
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setGeneratedLocale(parsed);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Check the console for details.");
    }
    setGenerateCount((prev) => prev + 1);
    setLoading(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F0EBE0",
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
          ← {place?.name}
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

      <div style={{ padding: "2.5rem", maxWidth: "1200px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "2rem",
          }}
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
            Add Locale — {island?.name}
          </span>
          <div style={{ flex: 1, height: "1px", background: "#C8C0B0" }} />
        </div>

        {/* Form */}
        <div style={{ marginBottom: "1.5rem", maxWidth: "400px" }}>
          <label
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#888",
              display: "block",
              marginBottom: "0.4rem",
            }}
          >
            Locale Name
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleFormChange}
            placeholder="e.g. Mistérios Negros"
            style={{
              width: "100%",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              padding: "0.5rem 0.75rem",
              border: "1px solid #C8C0B0",
              background: "#F0EBE0",
              color: "#1A1A18",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div style={{ marginBottom: "1.5rem", maxWidth: "400px" }}>
          <label
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#888",
              display: "block",
              marginBottom: "0.4rem",
            }}
          >
            Font Mood
          </label>
          <select
            value={fontMood}
            onChange={(e) => setFontMood(e.target.value)}
            style={{
              width: "100%",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              padding: "0.5rem 0.75rem",
              border: "1px solid #C8C0B0",
              background: "#F0EBE0",
              color: "#1A1A18",
              boxSizing: "border-box",
            }}
          >
            {Object.keys(FONT_PAIRS).map((mood) => (
              <option key={mood} value={mood}>
                {mood}
              </option>
            ))}
          </select>
        </div>
        {/* Upload */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#888",
              display: "block",
              marginBottom: "0.4rem",
            }}
          >
            Reference Images
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              color: "#1A1A18",
            }}
          />
          {images.length > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginTop: "0.4rem",
              }}
            >
              <p
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.6rem",
                  color: "#888",
                  margin: 0,
                }}
              >
                {images.length} image{images.length > 1 ? "s" : ""} selected
              </p>
              <button
                onClick={() => {
                  setImages([]);
                  document.querySelector("input[type='file']").value = "";
                }}
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.6rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  background: "transparent",
                  border: "none",
                  color: "#888",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={loading || generateCount >= MAX_GENERATES}
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            padding: "0.75rem 2rem",
            background: loading ? "#888" : "#1A1A18",
            color: "#F0EBE0",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: "2.5rem",
          }}
        >
          {loading ? "Analyzing images..." : "Generate Locale"}
        </button>

        {error && (
          <p
            style={{
              color: "red",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.7rem",
            }}
          >
            {error}
          </p>
        )}

        {/* Generated result */}
        {generatedLocale && (
          <>
            <LocaleHero locale={generatedLocale} />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "2rem",
                marginTop: "2.5rem",
              }}
            >
              <PalettePanel locale={generatedLocale} />
              <GradientTool locale={generatedLocale} />
              <FontPairingPanel locale={generatedLocale} />
            </div>

            {/* Save button */}
            <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
              <button
                onClick={async () => {
                  const albumRef = doc(db, "albums", albumId);
                  const albumSnap = await getDoc(albumRef);
                  const albumData = albumSnap.data();

                  const updatedIslands = albumData.islands.map((island) => {
                    if (island.id === islandId) {
                      return {
                        ...island,
                        locales: [...island.locales, generatedLocale],
                      };
                    }
                    return island;
                  });

                  await setDoc(albumRef, {
                    ...albumData,
                    islands: updatedIslands,
                  });
                  navigate(`/${albumId}`);
                }}
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "0.75rem 2rem",
                  background: "#3d5941",
                  color: "#F0EBE0",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Save to Atlas
              </button>
              <button
                onClick={() => setGeneratedLocale(null)}
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "0.75rem 2rem",
                  background: "transparent",
                  color: "#888",
                  border: "1px solid #C8C0B0",
                  cursor: "pointer",
                }}
              >
                Regenerate
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
