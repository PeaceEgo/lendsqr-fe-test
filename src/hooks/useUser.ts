import { useCallback, useEffect, useState } from 'react'
import { fetchUserById } from '../services/users.service'
import { applyStatusOverride, useUsersDataStore } from '../store/useUsersDataStore'
import type { User } from '../types/user.types'
import { getItem, setItem, storageKeys } from '../utils/localStorage'

interface UseUserState {
  user: User | null
  loading: boolean
  error: string | null
}

export function useUser(id: string) {
  const statusOverrides = useUsersDataStore((store) => store.statusOverrides)
  const [state, setState] = useState<UseUserState>({
    user: null,
    loading: true,
    error: null,
  })

  const load = useCallback(async () => {
    if (!id) {
      setState({ user: null, loading: false, error: 'User id is required' })
      return
    }

    const cached = getItem<User>(storageKeys.userDetails(id))
    const cachedUser = cached
      ? applyStatusOverride(cached, statusOverrides)
      : null

    setState({
      user: cachedUser,
      loading: !cachedUser,
      error: null,
    })

    try {
      const user = await fetchUserById(id)
      const mergedUser = applyStatusOverride(user, statusOverrides)
      setItem(storageKeys.userDetails(id), mergedUser)
      setState({ user: mergedUser, loading: false, error: null })
    } catch (error) {
      setState({
        user: cachedUser,
        loading: false,
        error:
          cachedUser
            ? null
            : error instanceof Error
              ? error.message
              : 'Failed to fetch user',
      })
    }
  }, [id, statusOverrides])

  useEffect(() => {
    void load()
  }, [load])

  return { ...state, retry: load }
}
