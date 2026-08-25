import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useSearchParams } from "react-router-dom";
import { authAPI, type AuthUser } from "../api/client";

type AuthTab = "login" | "register";

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authModalOpen: boolean;
  authTab: AuthTab;
  openAuthModal: (tab?: AuthTab | string) => void;
  closeAuthModal: () => void;
  setAuthTab: (tab: AuthTab | string) => void;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
  searchParams: URLSearchParams;
  setSearchParams: ReturnType<typeof useSearchParams>[1];
};

const AuthContext = createContext<AuthContextValue | null>(null);

function normalizeTab(value: string | null): AuthTab | null {
  if (value === "register" || value === "signup" || value === "sign-up") return "register";
  if (value === "login" || value === "signin" || value === "sign-in") return "login";
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTabState] = useState<AuthTab>("login");

  const setUser = useCallback((next: AuthUser | null) => {
    setUserState(next);
  }, []);

  const logout = useCallback(() => {
    setUserState(null);
  }, []);

  useEffect(() => {
    authAPI
      .me()
      .then((data) => setUserState(data.user))
      .catch(() => setUserState(null))
      .finally(() => setIsLoading(false));
  }, []);

  const syncFromParams = useCallback(() => {
    const authParam = normalizeTab(searchParams.get("auth"));
    const hasToken = Boolean(searchParams.get("token"));
    if (authParam) {
      setAuthTabState(authParam);
      setAuthModalOpen(true);
      return;
    }
    if (hasToken) {
      setAuthTabState("login");
      setAuthModalOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    syncFromParams();
  }, [syncFromParams]);

  const openAuthModal = useCallback(
    (nextTab: AuthTab | string = "login") => {
      const resolved = normalizeTab(nextTab) || "login";
      setAuthTabState(resolved);
      setAuthModalOpen(true);
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set("auth", resolved);
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("auth");
        return next;
      },
      { replace: true },
    );
  }, [setSearchParams]);

  const setAuthTab = useCallback(
    (nextTab: AuthTab | string) => {
      const resolved = normalizeTab(nextTab) || "login";
      setAuthTabState(resolved);
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set("auth", resolved);
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      authModalOpen,
      authTab,
      openAuthModal,
      closeAuthModal,
      setAuthTab,
      setUser,
      logout,
      searchParams,
      setSearchParams,
    }),
    [
      user,
      isLoading,
      authModalOpen,
      authTab,
      openAuthModal,
      closeAuthModal,
      setAuthTab,
      setUser,
      logout,
      searchParams,
      setSearchParams,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
