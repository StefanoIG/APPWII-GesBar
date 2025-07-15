// src/hooks/useAuth.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// --- INTERFACES COMPLETAS ---
interface Role {
  id: number;
  nombre: string;
}

interface User {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  cedula: string | null;
  bloqueado: boolean;
  role_id: number;
  role: Role;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

// --- HOOK CON ZUSTAND ---
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token, user) => {
        set({ token, user, isAuthenticated: true });
      },
      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage', // Clave en localStorage
    }
  )
);
