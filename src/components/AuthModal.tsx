import { useEffect, useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../api/client";
import { useAuth } from "../context/AuthContext";

const urlTokensInFlight = new Set<string>();

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function resolveRedirect(redirectParam: string | null): string {
  if (!redirectParam) return "/";
  if (redirectParam.startsWith("/")) return redirectParam;
  try {
    const target = new URL(redirectParam);
    if (typeof window !== "undefined" && target.origin === window.location.origin) {
      return `${target.pathname}${target.search}` || "/";
    }
  } catch {
    /* ignore */
  }
  return "/";
}

export function AuthModal() {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<Element | null>(null);
  const navigate = useNavigate();
  const {
    setUser,
    isAuthenticated,
    isLoading: authBootLoading,
    authModalOpen: open,
    authTab: tab,
    closeAuthModal: closeAuth,
    setAuthTab,
    searchParams,
    setSearchParams,
  } = useAuth();

  const redirectTo = resolveRedirect(searchParams.get("redirect"));
  const [email, setEmail] = useState(() => searchParams.get("email") || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [requestingToken, setRequestingToken] = useState(false);
  const [tokenRequested, setTokenRequested] = useState(false);
  const [code, setCode] = useState("");

  useEffect(() => {
    if (!open) return;
    setPassword("");
    setError("");
    setTokenRequested(false);
    setCode("");
    setRequestingToken(false);
    const emailParam = searchParams.get("email");
    if (emailParam) setEmail(emailParam);
  }, [open, tab, searchParams]);

  useEffect(() => {
    if (!open || authBootLoading || searchParams.get("token")) return;
    if (isAuthenticated) {
      closeAuth();
      navigate(redirectTo, { replace: true });
    }
  }, [open, authBootLoading, isAuthenticated, searchParams, redirectTo, closeAuth, navigate]);

  useEffect(() => {
    if (!open) return;
    const token = searchParams.get("token");
    if (!token || urlTokensInFlight.has(token)) return;

    urlTokensInFlight.add(token);
    setLoading(true);
    setError("");
    setAuthTab("login");

    authAPI
      .loginWithMagicToken(token)
      .then((data) => {
        setUser(data.user);
        setSearchParams(
          (prev) => {
            const next = new URLSearchParams(prev);
            next.delete("token");
            next.delete("auth");
            return next;
          },
          { replace: true },
        );
        closeAuth();
        navigate(redirectTo, { replace: true });
      })
      .catch((err: Error) => {
        urlTokensInFlight.delete(token);
        setError(err.message);
        setLoading(false);
        setSearchParams(
          (prev) => {
            const next = new URLSearchParams(prev);
            next.delete("token");
            return next;
          },
          { replace: true },
        );
      });
  }, [open, searchParams, redirectTo, setAuthTab, setSearchParams, setUser, navigate, closeAuth]);

  useEffect(() => {
    if (!open) return undefined;

    previouslyFocused.current = document.activeElement;
    const panel = panelRef.current;
    const focusables = () => [...(panel?.querySelectorAll(FOCUSABLE) ?? [])];

    const t = window.setTimeout(() => {
      const nodes = focusables();
      const firstTab = nodes.find((el) => el.getAttribute("role") === "tab") || nodes[0];
      (firstTab as HTMLElement | undefined)?.focus();
    }, 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeAuth();
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      const nodes = focusables();
      if (nodes.length === 0) return;
      const first = nodes[0] as HTMLElement;
      const last = nodes[nodes.length - 1] as HTMLElement;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
      (previouslyFocused.current as HTMLElement | null)?.focus?.();
    };
  }, [open, closeAuth]);

  if (!open) return null;

  const isRegister = tab === "register";
  const consumingToken = Boolean(loading && searchParams.get("token"));

  const handlePasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = isRegister
        ? await authAPI.register(email, password)
        : await authAPI.login(email, password);
      setUser(data.user);
      closeAuth();
      navigate(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestMagicLink = async () => {
    if (!email.trim()) {
      setError("Enter your email first");
      return;
    }
    setError("");
    setRequestingToken(true);
    try {
      await authAPI.requestMagicToken(email, isRegister ? "register" : "login");
      setTokenRequested(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setRequestingToken(false);
    }
  };

  const handleMagicCodeSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await authAPI.loginWithMagicToken(code);
      setUser(data.user);
      closeAuth();
      navigate(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal-backdrop" role="presentation">
      <button
        type="button"
        className="auth-modal-scrim"
        aria-label="Close sign in"
        onClick={closeAuth}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="auth-modal-panel"
      >
        <div className="auth-modal-head">
          <div>
            <h2 id={titleId}>{isRegister ? "Create account" : "Sign in"}</h2>
            <p className="auth-modal-tagline">Save Tidal tracks and sync your lab picks.</p>
          </div>
          <button type="button" className="auth-modal-close" onClick={closeAuth} aria-label="Close">
            ×
          </button>
        </div>

        <div role="tablist" aria-label="Account" className="auth-modal-tabs">
          <button
            type="button"
            role="tab"
            aria-selected={!isRegister}
            id="auth-tab-login"
            aria-controls="auth-panel"
            className={!isRegister ? "active" : undefined}
            onClick={() => setAuthTab("login")}
          >
            Sign in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={isRegister}
            id="auth-tab-register"
            aria-controls="auth-panel"
            className={isRegister ? "active" : undefined}
            onClick={() => setAuthTab("register")}
          >
            Create account
          </button>
        </div>

        <div
          id="auth-panel"
          role="tabpanel"
          className="auth-modal-body"
          aria-labelledby={isRegister ? "auth-tab-register" : "auth-tab-login"}
        >
          {error ? <p className="auth-modal-error">{error}</p> : null}

          {consumingToken ? (
            <p className="auth-modal-note">Signing you in…</p>
          ) : !tokenRequested ? (
            <form onSubmit={handlePasswordSubmit} className="auth-modal-form">
              <div className="auth-field">
                <label htmlFor="auth-email">Email</label>
                <input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
                <button
                  type="button"
                  className="auth-link-btn"
                  onClick={handleRequestMagicLink}
                  disabled={requestingToken || !email.trim()}
                >
                  {requestingToken ? "Sending…" : "Email me a magic link instead"}
                </button>
              </div>
              <div className="auth-field">
                <label htmlFor="auth-password">Password</label>
                <input
                  id="auth-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={isRegister ? 6 : undefined}
                  autoComplete={isRegister ? "new-password" : "current-password"}
                />
              </div>
              <button type="submit" className="auth-submit" disabled={loading}>
                {loading
                  ? isRegister
                    ? "Creating account…"
                    : "Signing in…"
                  : isRegister
                    ? "Create account"
                    : "Sign in"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleMagicCodeSubmit} className="auth-modal-form">
              <p className="auth-modal-hint">
                We sent a sign-in link and 6-digit code to <strong>{email}</strong>. Check your
                email or enter the code below.
              </p>
              <div className="auth-field">
                <label htmlFor="auth-magic-code">Sign-in code</label>
                <input
                  id="auth-magic-code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  required
                  className="auth-code-input"
                  placeholder="123456"
                />
              </div>
              <button type="submit" className="auth-submit" disabled={loading || code.length !== 6}>
                {loading
                  ? "Signing in…"
                  : isRegister
                    ? "Complete sign-up with code"
                    : "Sign in with code"}
              </button>
              <button
                type="button"
                className="auth-link-btn auth-link-btn-block"
                onClick={() => {
                  setTokenRequested(false);
                  setCode("");
                  setError("");
                }}
              >
                {isRegister ? "Create account with password instead" : "Back to password sign-in"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
