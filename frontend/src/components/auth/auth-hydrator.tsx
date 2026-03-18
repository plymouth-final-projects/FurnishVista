'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/useAuthStore';
import { getCurrentUser } from '@/services/auth.service';

export function AuthHydrator() {
  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    if (user) return;

    let active = true;

    getCurrentUser()
      .then((user) => {
        if (active) {
          login(user);
        }
      })
      .catch(() => {
        if (active) {
          logout();
        }
      });

    return () => {
      active = false;
    };
  }, [user, login, logout]);

  return null;
}
