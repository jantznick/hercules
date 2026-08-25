/**
 * Local dev: empty VITE_API_URL → Vite proxy `/api` → apps/api on :3001.
 * Production: set VITE_API_URL to the public API origin (we append `/api` unless it already ends with it).
 */
function resolveApiBase(): string {
  const raw = (import.meta.env.VITE_API_URL || "").trim();
  if (!raw) return "/api";
  const base = raw.replace(/\/$/, "");
  return base.endsWith("/api") ? base : `${base}/api`;
}

const API_BASE = resolveApiBase();

export type AuthUser = {
  id: string;
  email: string;
  createdAt: string;
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error((error as { error?: string }).error || "Request failed");
  }
  if (response.status === 204) return null as T;
  return response.json() as Promise<T>;
}

export const authAPI = {
  register: (email: string, password: string) =>
    request<{ user: AuthUser }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  login: (email: string, password: string) =>
    request<{ user: AuthUser }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  requestMagicToken: (email: string, intent: "login" | "register" = "login") =>
    request<{ message: string }>("/auth/magic-token/request", {
      method: "POST",
      body: JSON.stringify({ email, intent }),
    }),
  loginWithMagicToken: (token: string) =>
    request<{ user: AuthUser }>("/auth/magic-token/login", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),
  logout: () => request<{ message: string }>("/auth/logout", { method: "POST" }),
  me: () => request<{ user: AuthUser }>("/auth/me"),
};
