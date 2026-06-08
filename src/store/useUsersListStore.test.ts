import { describe, expect, it, beforeEach } from 'vitest'
import {
  emptyUserFilters,
  useUsersListStore,
} from '../store/useUsersListStore'

describe('useUsersListStore', () => {
  beforeEach(() => {
    useUsersListStore.setState({
      userFilterDraft: emptyUserFilters,
      userFilters: emptyUserFilters,
      page: 1,
      limit: 100,
    })
  })

  it('applies draft filters to active filters', () => {
    useUsersListStore.getState().setUserFilterDraft('username', 'grace')
    useUsersListStore.getState().applyUserFilters()

    expect(useUsersListStore.getState().userFilters.username).toBe('grace')
  })

  it('resets filters and draft together', () => {
    useUsersListStore.getState().setUserFilterDraft('status', 'Active')
    useUsersListStore.getState().applyUserFilters()
    useUsersListStore.getState().resetUserFilters()

    expect(useUsersListStore.getState().userFilters).toEqual(emptyUserFilters)
    expect(useUsersListStore.getState().userFilterDraft).toEqual(emptyUserFilters)
  })

  it('syncs draft from applied filters when reopening panel', () => {
    useUsersListStore.getState().setUserFilterDraft('email', 'draft@example.com')
    useUsersListStore.getState().setUserFilterDraft('username', 'applied')
    useUsersListStore.getState().applyUserFilters()
    useUsersListStore.getState().setUserFilterDraft('email', 'changed@example.com')
    useUsersListStore.getState().syncFilterDraftFromApplied()

    expect(useUsersListStore.getState().userFilterDraft).toEqual({
      ...emptyUserFilters,
      email: 'draft@example.com',
      username: 'applied',
    })
  })

  it('persists pagination state in the store', () => {
    useUsersListStore.getState().setLimit(25)
    useUsersListStore.getState().setPage(3)

    expect(useUsersListStore.getState().page).toBe(3)
    expect(useUsersListStore.getState().limit).toBe(25)
  })

  it('resets page when filters are applied or reset', () => {
    useUsersListStore.getState().setPage(4)
    useUsersListStore.getState().setUserFilterDraft('username', 'grace')
    useUsersListStore.getState().applyUserFilters()

    expect(useUsersListStore.getState().page).toBe(1)

    useUsersListStore.getState().setPage(2)
    useUsersListStore.getState().resetUserFilters()

    expect(useUsersListStore.getState().page).toBe(1)
  })
})
