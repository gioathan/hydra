// Encodes where an auth-gated screen should send the user back to after they
// log in, so RequireAuth can bounce to /login and the login/register/verify
// flow can thread it through and land the user back where they started.
export function encodeRedirect(pathname: string, params: Record<string, unknown>): string {
  const { redirect: _ignored, ...rest } = params;
  return encodeURIComponent(JSON.stringify({ pathname, params: rest }));
}

export function decodeRedirect(raw?: string | string[]): { pathname: string; params?: Record<string, unknown> } | null {
  if (!raw || Array.isArray(raw)) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    if (typeof parsed?.pathname === 'string') return parsed;
    return null;
  } catch {
    return null;
  }
}
