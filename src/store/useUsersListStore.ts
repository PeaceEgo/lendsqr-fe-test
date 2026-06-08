import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserStatus } from '../types/user.types'
import { storageKeys } from '../utils/localStorage'

export interface UserFilterState {
  organization: string
  username: string
  email: string
  dateJoined: string
  phoneNumber: string
  status: UserStatus | ''
}

export const emptyUserFilters: UserFilterState = {
  organization: '',
  username: '',
  email: '',
  dateJoined: '',
  phoneNumber: '',
  status: '',
}

interface UsersListState {
  userFilterDraft: UserFilterState
  userFilters: UserFilterState
  page: number
  limit: number
  setUserFilterDraft: (field: keyof UserFilterState, value: string) => void
  syncFilterDraftFromApplied: () => void
  applyUserFilters: () => void
  resetUserFilters: () => void
  setPage: (page: number) => void
  setLimit: (limit: number) => void
}

export const useUsersListStore = create<UsersListState>()(
  persist(
    (set) => ({
      userFilterDraft: emptyUserFilters,
      userFilters: emptyUserFilters,
      page: 1,
      limit: 100,
      setUserFilterDraft: (field, value) =>
        set((state) => ({
          userFilterDraft: {
            ...state.userFilterDraft,
            [field]: value,
          },
        })),
      syncFilterDraftFromApplied: () =>
        set((state) => ({
          userFilterDraft: { ...state.userFilters },
        })),
      applyUserFilters: () =>
        set((state) => ({
          userFilters: { ...state.userFilterDraft },
          page: 1,
        })),
      resetUserFilters: () =>
        set({
          userFilterDraft: emptyUserFilters,
          userFilters: emptyUserFilters,
          page: 1,
        }),
      setPage: (page) => set({ page }),
      setLimit: (limit) => set({ limit, page: 1 }),
    }),
    {
      name: storageKeys.userFilters,
      partialize: (state) => ({
        userFilterDraft: state.userFilterDraft,
        userFilters: state.userFilters,
        page: state.page,
        limit: state.limit,
      }),
    },
  ),
)
