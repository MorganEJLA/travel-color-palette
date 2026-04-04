import { BrowserRouter, Routes, Route } from "react-router-dom";
import AtlasHome from "./pages/AtlasHome";
import AlbumView from "./pages/AlbumView";
import LocaleView from "./pages/LocaleView";
import GeneratorView from "./pages/GeneratorView";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AtlasHome />} />
        <Route path="/:albumId" element={<AlbumView />} />
        <Route path="/:albumId/:islandId/:localeId" element={<LocaleView />} />
        <Route
          path="/:albumId/:islandId/generate"
          element={<GeneratorView />}
        />
      </Routes>
    </BrowserRouter>
  );
}
