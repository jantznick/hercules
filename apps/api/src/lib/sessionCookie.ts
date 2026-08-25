const isProduction = process.env.NODE_ENV === 'production';
const cookieDomain = process.env.COOKIE_DOMAIN || undefined;

export const sessionCookieName = 'connect.sid';

export function sessionCookieOptions() {
  return {
    secure: isProduction,
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
    domain: cookieDomain,
    path: '/',
  };
}

export function clearSessionCookieOptions() {
  return {
    domain: cookieDomain,
    path: '/',
    sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
    secure: isProduction,
  };
}
