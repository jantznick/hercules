declare module 'express-session' {
  interface SessionData {
    userId?: string;
    email?: string;
    tidalPkceVerifier?: string;
    tidalOAuthState?: string;
  }
}

export {};
