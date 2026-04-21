import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name: string;
}

type Status = 'checking' | 'unauthenticated' | 'authenticated';

interface AuthState {
  user: User | null;
  status: Status;
  isHydrated: boolean;
  initAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      status: 'checking',
      isHydrated: false,
      initAuth: async () => {
        set({ status: 'checking' });
        try {
          const res = await fetch('/api/auth/me');
          if (res.ok) {
            const data = await res.json();
            set({ user: data.user, status: 'authenticated' });
          } else {
            set({ user: null, status: 'unauthenticated' });
          }
        } catch (error) {
          set({ user: null, status: 'unauthenticated' });
        } finally {
          set({ isHydrated: true });
        }
      },
      login: async (email: string, password: string) => {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || 'Login failed');
        }
        await get().initAuth();
      },
      register: async (name: string, email: string, password: string) => {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || 'Register failed');
        }
        await get().initAuth();
      },
      logout: async () => {
        try {
          await fetch('/api/auth/logout', { method: 'POST' });
        } catch {
          // Ignore API error
        }
        set({ user: null, status: 'unauthenticated', isHydrated: true });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, status: state.status }),
    }
  )
);

