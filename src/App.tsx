import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { GearPage } from "./pages/GearPage";
import { DjBasicsPage } from "./pages/DjBasicsPage";
import { TutorialDetailPage, TutorialsIndexPage } from "./pages/TutorialsPages";
import {
  CheatSheetPage,
  CueLabPage,
  FilterLabPage,
  HotCueLabPage,
  NeuralLabPage,
  NeuralPadsLabPage,
  PadsLabPage,
} from "./pages/LabPages";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="gear" element={<GearPage />} />
          <Route path="dj-basics" element={<DjBasicsPage />} />
          <Route path="tutorials" element={<TutorialsIndexPage />} />
          <Route path="tutorials/:tutorialId" element={<TutorialDetailPage />} />
          <Route path="labs/cue" element={<CueLabPage />} />
          <Route path="labs/hot-cue" element={<HotCueLabPage />} />
          <Route path="labs/filter" element={<FilterLabPage />} />
          <Route path="labs/neural" element={<NeuralLabPage />} />
          <Route path="labs/neural-pads" element={<NeuralPadsLabPage />} />
          <Route path="labs/pads" element={<PadsLabPage />} />
          <Route path="cheatsheet" element={<CheatSheetPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
