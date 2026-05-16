import axios from 'axios';
import { store, persistor } from '@/store';
import { logout } from '@/store/slices/authSlice';

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

    if (status === 401 && !url.includes('/auth/') && !isHandlingUnauthorized && globalThis.window !== undefined) {
      isHandlingUnauthorized = true;
      try {
        store.dispatch(logout());
        await persistor.purge();
        sessionStorage.clear();
        await apiClient.post('/auth/logout').catch(() => {});
      } finally {
        isHandlingUnauthorized = false;
      }
      globalThis.window.location.href = '/login';
    }

    throw error;
  }
);
