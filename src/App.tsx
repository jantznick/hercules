import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { GearBoxPage, GearPage } from "./pages/GearPage";
import { PreCuePage } from "./pages/PreCuePage";
import { MixingStrategyPage } from "./pages/MixingStrategyPage";
import { TechniquesPage } from "./pages/TechniquesPage";
import { CueingPage } from "./pages/CueingPage";
import { RemixPage } from "./pages/RemixPage";
import { RemixFilterPage } from "./pages/RemixFilterPage";
import { RemixPadsPage } from "./pages/RemixPadsPage";
import { RemixNeuralPage } from "./pages/RemixNeuralPage";
import { SettingsPage } from "./pages/SettingsPage";
import { DjingLayout } from "./pages/DjingLayout";
import { DjingHubPage } from "./pages/DjingHubPage";
import { PhrasingPage } from "./pages/PhrasingPage";
import { EqMixingPage } from "./pages/EqMixingPage";
import { LoopingPage } from "./pages/LoopingPage";
import { QuantizePage } from "./pages/QuantizePage";
import { WaveformPage } from "./pages/WaveformPage";
import { SongPartsPage } from "./pages/SongPartsPage";
import { ChoosePage } from "./pages/ChoosePage";
import { BlendPage } from "./pages/BlendPage";
import { TransitionsPage } from "./pages/TransitionsPage";
import { JumpsPage } from "./pages/JumpsPage";
import { BeatmatchPage } from "./pages/BeatmatchPage";
import { StylePage } from "./pages/StylePage";
import { LabsIndexPage } from "./pages/LabsIndexPage";
import { TutorialDetailPage, TutorialsIndexPage } from "./pages/TutorialsPages";
import {
  CheatSheetPage,
  CueLabPage,
  FilterLabPage,
  HardwareCrossfaderLabPage,
  HardwareEqLabPage,
  HardwareFilterLabPage,
  HardwareFreePlayPage,
  HardwarePlayCueLabPage,
  HotCueLabPage,
  MidiProbePage,
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
          <Route path="gear/box" element={<GearBoxPage />} />
          <Route path="pre-cue" element={<PreCuePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="controls" element={<Navigate to="/cheatsheet" replace />} />
          <Route path="cheatsheet" element={<CheatSheetPage />} />
          <Route path="djing" element={<DjingLayout />}>
            <Route index element={<DjingHubPage />} />
            <Route path="phrasing" element={<PhrasingPage />} />
            <Route path="songs" element={<SongPartsPage />} />
            <Route path="waveform" element={<WaveformPage />} />
            <Route path="cueing" element={<CueingPage />} />
            <Route path="mixing" element={<MixingStrategyPage />} />
            <Route path="beatmatch" element={<BeatmatchPage />} />
            <Route path="techniques" element={<TechniquesPage />} />
            <Route path="transitions" element={<TransitionsPage />} />
            <Route path="jumps" element={<JumpsPage />} />
            <Route path="eq" element={<EqMixingPage />} />
            <Route path="choose" element={<ChoosePage />} />
            <Route path="blend" element={<BlendPage />} />
            <Route path="quantize" element={<QuantizePage />} />
            <Route path="looping" element={<LoopingPage />} />
            <Route path="remix" element={<RemixPage />} />
            <Route path="filter" element={<RemixFilterPage />} />
            <Route path="pads-fx" element={<RemixPadsPage />} />
            <Route path="neural" element={<RemixNeuralPage />} />
            <Route path="style" element={<StylePage />} />
          </Route>
          <Route path="practice" element={<Navigate to="/tutorials" replace />} />
          <Route path="tutorials" element={<TutorialsIndexPage />} />
          <Route path="tutorials/:tutorialId" element={<TutorialDetailPage />} />
          <Route path="labs" element={<LabsIndexPage />} />
          <Route path="labs/midi" element={<MidiProbePage />} />
          <Route path="labs/hw-play-cue" element={<HardwarePlayCueLabPage />} />
          <Route path="labs/hw-filter" element={<HardwareFilterLabPage />} />
          <Route path="labs/hw-eq" element={<HardwareEqLabPage />} />
          <Route path="labs/hw-crossfader" element={<HardwareCrossfaderLabPage />} />
          <Route path="labs/hw-free" element={<HardwareFreePlayPage />} />
          <Route path="labs/cue" element={<CueLabPage />} />
          <Route path="labs/hot-cue" element={<HotCueLabPage />} />
          <Route path="labs/filter" element={<FilterLabPage />} />
          <Route path="labs/neural" element={<NeuralLabPage />} />
          <Route path="labs/pads" element={<PadsLabPage />} />
          <Route path="labs/neural-pads" element={<NeuralPadsLabPage />} />
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
