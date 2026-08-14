import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { GearPage } from "./pages/GearPage";
import { PreCuePage } from "./pages/PreCuePage";
import { MixingStrategyPage } from "./pages/MixingStrategyPage";
import { CueingPage } from "./pages/CueingPage";
import { RemixPage } from "./pages/RemixPage";
import { SettingsPage } from "./pages/SettingsPage";
import { ControlsHubPage } from "./pages/ControlsHubPage";
import { DjingLayout } from "./pages/DjingLayout";
import { DjingHubPage } from "./pages/DjingHubPage";
import { PracticeHubPage } from "./pages/PracticeHubPage";
import { PhrasingPage } from "./pages/PhrasingPage";
import { EqMixingPage } from "./pages/EqMixingPage";
import { LoopingPage } from "./pages/LoopingPage";
import { QuantizePage } from "./pages/QuantizePage";
import { WaveformPage } from "./pages/WaveformPage";
import { SongPartsPage } from "./pages/SongPartsPage";
import { ChoosePage } from "./pages/ChoosePage";
import { BlendPage } from "./pages/BlendPage";
import { StylePage } from "./pages/StylePage";
import { LabsIndexPage } from "./pages/LabsIndexPage";
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

function CueingLegacyRedirect() {
  const { hash } = useLocation();
  if (hash === "#quantize") return <Navigate to="/djing/quantize" replace />;
  if (hash === "#loop-from-cue") return <Navigate to="/djing/looping#loop-from-cue" replace />;
  return <Navigate to="/djing/cueing" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="gear" element={<GearPage />} />
          <Route path="pre-cue" element={<PreCuePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="controls" element={<ControlsHubPage />} />
          <Route path="cheatsheet" element={<CheatSheetPage />} />
          <Route path="djing" element={<DjingLayout />}>
            <Route index element={<DjingHubPage />} />
            <Route path="phrasing" element={<PhrasingPage />} />
            <Route path="songs" element={<SongPartsPage />} />
            <Route path="waveform" element={<WaveformPage />} />
            <Route path="cueing" element={<CueingPage />} />
            <Route path="mixing" element={<MixingStrategyPage />} />
            <Route path="eq" element={<EqMixingPage />} />
            <Route path="choose" element={<ChoosePage />} />
            <Route path="blend" element={<BlendPage />} />
            <Route path="quantize" element={<QuantizePage />} />
            <Route path="looping" element={<LoopingPage />} />
            <Route path="remix" element={<RemixPage />} />
            <Route path="style" element={<StylePage />} />
          </Route>
          <Route path="practice" element={<PracticeHubPage />} />
          <Route path="tutorials" element={<TutorialsIndexPage />} />
          <Route path="tutorials/:tutorialId" element={<TutorialDetailPage />} />
          <Route path="labs" element={<LabsIndexPage />} />
          <Route path="labs/cue" element={<CueLabPage />} />
          <Route path="labs/hot-cue" element={<HotCueLabPage />} />
          <Route path="labs/filter" element={<FilterLabPage />} />
          <Route path="labs/neural" element={<NeuralLabPage />} />
          <Route path="labs/neural-pads" element={<NeuralPadsLabPage />} />
          <Route path="labs/pads" element={<PadsLabPage />} />
          <Route path="dj-basics" element={<Navigate to="/djing" replace />} />
          <Route path="cueing" element={<CueingLegacyRedirect />} />
          <Route path="mixing-strategy" element={<Navigate to="/djing/mixing" replace />} />
          <Route path="remix" element={<Navigate to="/djing/remix" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
