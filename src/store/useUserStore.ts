import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { storageKeys } from '../utils/localStorage'

interface AppState {
  isAuthenticated: boolean
  email: string | null
  login: (email: string, password: string) => boolean
  logout: () => void
}

export const useUserStore = create<AppState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      email: null,
      login: (email, password) => {
        void password
        set({ isAuthenticated: true, email })
        return true
      },
      logout: () => set({ isAuthenticated: false, email: null }),
    }),
    {
      name: storageKeys.auth,
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        email: state.email,
      }),
    },
  ),
)
