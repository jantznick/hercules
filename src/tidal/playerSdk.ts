import { tidalAPI } from "../api/client";

export type TidalPlayerModule = typeof import("@tidal-music/player");

let playerModulePromise: Promise<TidalPlayerModule> | null = null;
let sdkReady = false;

/** Demo / reference listening does not need analytics batching. */
const noopEventSender = {
  sendEvent() {},
};

export function loadTidalPlayerModule(): Promise<TidalPlayerModule> {
  if (!playerModulePromise) {
    playerModulePromise = import("@tidal-music/player");
  }
  return playerModulePromise;
}

/**
 * Bootstrap Player SDK once and attach a credentials provider that refreshes
 * via our session-gated /api/tidal/player-session bridge.
 *
 * Requires setEventSender — load() throws "Playback not allowed without an
 * event sender" otherwise. Callers must await load() before play(); otherwise
 * play() rejects with "No active player".
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

    // Official demo uses a noop sender outside Cypress; types expect event-producer.
    mod.setEventSender(noopEventSender as Parameters<typeof mod.setEventSender>[0]);

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
  // load is async and is what assigns activePlayer; play() without awaiting load
  // rejects with "No active player".
  await mod.load({
    productId,
    productType: "track",
    sourceId,
    sourceType: "reference",
  });

  if (!mod.getMediaProduct()) {
    throw new Error(
      "Tidal stream did not become active (check Connect Tidal, playback scope, and HTTPS).",
    );
  }

  await mod.play();
  mountTidalMediaElement(mod, host);
  return mod;
}
