import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { GUIDES, isGenreId, type GenreGuide, type GenreId } from "./genres";

const STORAGE_KEY = "mix-ultra-djing-genre";

type GenreContextValue = {
  genre: GenreId;
  setGenre: (id: GenreId) => void;
  guide: GenreGuide;
};

const GenreContext = createContext<GenreContextValue | null>(null);

function readStored(): GenreId {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw && isGenreId(raw)) return raw;
  } catch {
    /* ignore */
  }
  return "any";
}

export function GenreProvider({ children }: { children: ReactNode }) {
  const [genre, setGenreState] = useState<GenreId>(readStored);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, genre);
    } catch {
      /* ignore */
    }
  }, [genre]);

  const value = useMemo(
    () => ({
      genre,
      setGenre: setGenreState,
      guide: GUIDES[genre],
    }),
    [genre],
  );

  return <GenreContext.Provider value={value}>{children}</GenreContext.Provider>;
}

export function useGenre() {
  const ctx = useContext(GenreContext);
  if (!ctx) throw new Error("useGenre must be used within GenreProvider");
  return ctx;
}
