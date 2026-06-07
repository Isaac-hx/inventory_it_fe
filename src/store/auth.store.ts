import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {Auth} from "@/types/auth"
// 2. Tentukan interface untuk struktur Store kamu
interface AuthStore {
  token: string | null;
  user: Auth | null;
  setAuth: (token: string, user: Auth) => void;
  logout: () => void;
}

// 3. Bungkus konfigurasi store di dalam fungsi persist()
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // State Awal (Cukup tulis nilai default-nya saja, tidak perlu getItem lagi!)
      token: null,
      user: null,

      // Actions (Fungsi pengubah state)
      setAuth: (token, user) => {
        // Zustand otomatis akan menyimpan parameter ini ke localStorage
        set({ token, user });
      },

      logout: () => {
        // Zustand otomatis akan menghapus/mereset data ini di localStorage
        set({ token: null, user: null });
      },
    }),
    {
      name: 'auth-storage', // Ini adalah KEY yang akan muncul di localStorage browser kamu
      storage: createJSONStorage(() => localStorage), // Default-nya localStorage, bisa diganti sessionStorage kalau mau
    }
  )
);