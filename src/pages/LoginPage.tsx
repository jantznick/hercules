import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

/** /login and /register → home with ?auth=… (modal), preserving token/redirect/email. */
export function LoginPage({ mode = "login" }: { mode?: "login" | "register" }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    next.set("auth", mode);
    navigate({ pathname: "/", search: next.toString() }, { replace: true });
  }, [mode, navigate, searchParams]);

  return (
    <div className="auth-deeplink-loading">
      <p>Loading…</p>
    </div>
  );
}
