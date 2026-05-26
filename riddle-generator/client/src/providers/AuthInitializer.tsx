"use client";

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { apiClient } from '@/lib/api-client';
import { store, persistor } from '@/store';

export default function AuthInitializer({ children }: Readonly<{ children: React.ReactNode }>) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const { isAuthenticated, user } = store.getState().auth;

    if (!isAuthenticated || !user || user.is_guest) return;

    apiClient
      .get('/users/profile/stats', { _skipAuthRedirect: true })
      .catch((error) => {
        if (error?.response?.status === 401) {
          dispatch(logout());
          localStorage.removeItem('persist:root');
          localStorage.setItem('is_guest', 'true');
          persistor.purge();
          sessionStorage.clear();
        }
      });
  }, [dispatch]);

  return <>{children}</>;
}
