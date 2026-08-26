import { tidalAPI } from "../api/client";

export type TidalPlayerModule = typeof import("@tidal-music/player");

let playerModulePromise: Promise<TidalPlayerModule> | null = null;
let sdkReady = false;

export function loadTidalPlayerModule(): Promise<TidalPlayerModule> {
  if (!playerModulePromise) {
    playerModulePromise = import("@tidal-music/player");
  }
  return playerModulePromise;
}

/**
 * Bootstrap Player SDK once and attach a credentials provider that refreshes
 * via our session-gated /api/tidal/player-session bridge.
 */
export async function ensureTidalPlayerSdk(): Promise<TidalPlayerModule> {
  const mod = await loadTidalPlayerModule();
  if (!sdkReady) {
    mod.bootstrap({
      outputDevices: false,
      players: [
        { itemTypes: ["track"], player: "shaka" },
        { itemTypes: ["track"], player: "browser" },
      ],
    });

    mod.setCredentialsProvider({
      bus: () => {},
      getCredentials: async () => {
        const session = await tidalAPI.playerSession();
        return {
          clientId: session.clientId,
          token: session.accessToken,
          requestedScopes: ["playback", "search.read"],
          expires: new Date(session.expiresAt).getTime(),
        };
      },
    });

    sdkReady = true;
  }
  return mod;
}

export function mountTidalMediaElement(mod: TidalPlayerModule, host: HTMLElement | null): void {
  if (!host) return;
  const el = mod.getMediaElement();
  if (!el) return;
  if (el.parentElement !== host) {
    host.replaceChildren(el);
  }
}

export async function playTidalTrack(
  productId: string,
  sourceId: string,
  host: HTMLElement | null,
): Promise<TidalPlayerModule> {
  const mod = await ensureTidalPlayerSdk();
  mod.load({
    productId,
    productType: "track",
    sourceId,
    sourceType: "reference",
  });
  await mod.play();
  mountTidalMediaElement(mod, host);
  return mod;
}
