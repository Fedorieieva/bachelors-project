import axios from 'axios';
import { store, persistor } from '@/store';
import { logout } from '@/store/slices/authSlice';

declare module 'axios' {
  interface AxiosRequestConfig {
    _skipAuthRedirect?: boolean;
  }
  interface InternalAxiosRequestConfig {
    _skipAuthRedirect?: boolean;
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

console.debug('[api-client] baseURL:', API_BASE_URL);

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isHandlingUnauthorized = false;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const url: string = error.config?.url ?? '';
    const skipRedirect: boolean = error.config?._skipAuthRedirect ?? false;

    if (status === 401 && !url.includes('/auth/') && !isHandlingUnauthorized && globalThis.window !== undefined) {
      isHandlingUnauthorized = true;
      try {
        store.dispatch(logout());
        // Synchronous disk wipe — must happen before any async step so a
        // concurrent page reload cannot rehydrate the stale persist:root entry.
        localStorage.removeItem('persist:root');
        localStorage.setItem('is_guest', 'true');
        await persistor.purge();
        sessionStorage.clear();
        if (!skipRedirect) {
          await apiClient.post('/auth/logout').catch(() => {});
        }
      } finally {
        isHandlingUnauthorized = false;
      }
      if (!skipRedirect) {
        globalThis.window.location.href = '/login';
      }
    }

    throw error;
  }
);
