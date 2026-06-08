import { describe, expect, it } from 'vitest'
import { useUserStore } from '../store/useUserStore'

describe('useUserStore', () => {
  it('starts unauthenticated', () => {
    useUserStore.setState({ isAuthenticated: false, email: null })
    expect(useUserStore.getState().isAuthenticated).toBe(false)
  })

  it('authenticates on login', () => {
    useUserStore.getState().login('test@lendsqr.com', 'password')
    expect(useUserStore.getState().isAuthenticated).toBe(true)
    expect(useUserStore.getState().email).toBe('test@lendsqr.com')
  })

  it('clears auth on logout', () => {
    useUserStore.getState().login('test@lendsqr.com', 'password')
    useUserStore.getState().logout()
    expect(useUserStore.getState().isAuthenticated).toBe(false)
    expect(useUserStore.getState().email).toBeNull()
  })
})
