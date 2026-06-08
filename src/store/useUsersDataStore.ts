import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, UserStatus } from '../types/user.types'
import { getItem, setItem, storageKeys } from '../utils/localStorage'

interface UsersDataState {
  statusOverrides: Record<string, UserStatus>
  updateUserStatus: (id: string, status: UserStatus) => void
}

export function applyStatusOverride(user: User, overrides: Record<string, UserStatus>): User {
  const status = overrides[user.id] ?? user.status
  return status === user.status ? user : { ...user, status }
}

export const useUsersDataStore = create<UsersDataState>()(
  persist(
    (set) => ({
      statusOverrides: {},
      updateUserStatus: (id, status) => {
        set((state) => ({
          statusOverrides: { ...state.statusOverrides, [id]: status },
        }))

        const cached = getItem<User>(storageKeys.userDetails(id))
        if (cached) {
          setItem(storageKeys.userDetails(id), { ...cached, status })
        }
      },
    }),
    {
      name: storageKeys.userStatuses,
    },
  ),
)
