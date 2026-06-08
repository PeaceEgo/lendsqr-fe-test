import { useEffect, useState } from 'react'
import { fetchUsers } from '../services/users.service'
import { applyStatusOverride, useUsersDataStore } from '../store/useUsersDataStore'
import type { PaginatedUsersResponse, UsersQueryParams } from '../types/user.types'

interface UseUsersState {
  data: PaginatedUsersResponse | null
  loading: boolean
  error: string | null
}

const EMPTY_PARAMS: UsersQueryParams = {}

export function useUsers(params: UsersQueryParams = EMPTY_PARAMS) {
  const [state, setState] = useState<UseUsersState>({
    data: null,
    loading: true,
    error: null,
  })

  const page = params.page ?? 1
  const limit = params.limit ?? 100
  const search = params.search
  const status = params.status
  const organization = params.organization
  const username = params.username
  const email = params.email
  const dateJoined = params.dateJoined
  const phoneNumber = params.phoneNumber
  const statusOverrides = useUsersDataStore((store) => store.statusOverrides)

  const queryParams = {
    page,
    limit,
    search,
    status,
    organization,
    username,
    email,
    dateJoined,
    phoneNumber,
  }

  useEffect(() => {
    let cancelled = false

    setState((prev) => ({ ...prev, loading: true, error: null }))

    fetchUsers(queryParams)
      .then((data) => {
        if (!cancelled) {
          setState({
            data: {
              ...data,
              data: data.data.map((user) =>
                applyStatusOverride(user, statusOverrides),
              ),
            },
            loading: false,
            error: null,
          })
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error:
              error instanceof Error ? error.message : 'Failed to fetch users',
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [
    page,
    limit,
    search,
    status,
    organization,
    username,
    email,
    dateJoined,
    phoneNumber,
    statusOverrides,
  ])

  const retry = () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    fetchUsers(queryParams)
      .then((data) =>
        setState({
          data: {
            ...data,
            data: data.data.map((user) =>
              applyStatusOverride(user, statusOverrides),
            ),
          },
          loading: false,
          error: null,
        }),
      )
      .catch((error) =>
        setState({
          data: null,
          loading: false,
          error:
            error instanceof Error ? error.message : 'Failed to fetch users',
        }),
      )
  }

  return { ...state, retry }
}
