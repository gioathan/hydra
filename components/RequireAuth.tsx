import React, { useEffect } from 'react';
import { router, usePathname, useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '../lib/store/authStore';
import { encodeRedirect } from '../lib/authRedirect';

// Wraps a screen/layout that requires a logged-in customer. Unlike the rest of
// (app), which is browsable without an account, these routes bounce to
// /(auth)/login with a `redirect` param encoding where to return to.
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useLocalSearchParams();
  const { token, isRehydrated } = useAuthStore();

  useEffect(() => {
    if (isRehydrated && !token) {
      router.replace({
        pathname: '/(auth)/login',
        params: { redirect: encodeRedirect(pathname, params as Record<string, unknown>) },
      });
    }
  }, [isRehydrated, token, pathname, params]);

  if (!isRehydrated || !token) return null;

  return <>{children}</>;
}
