import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import * as authService from '../../services/auth.service'
import { useUserStore } from '../../store/useUserStore'
import { Login } from './Login'

vi.mock('../../services/auth.service')

function renderLogin(initialPath = '/login') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<div>Dashboard Page</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('Login', () => {
  beforeEach(() => {
    useUserStore.setState({ isAuthenticated: false, email: null })
    vi.mocked(authService.authenticateUser).mockResolvedValue({ success: true })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly', () => {
    renderLogin()

    expect(screen.getByRole('heading', { name: 'Welcome!' })).toBeInTheDocument()
    expect(screen.getByText('Enter details to login.')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Show password' })).toBeInTheDocument()
  })

  it('shows validation errors on empty submit', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.click(screen.getByRole('button', { name: 'Log In' }))

    expect(screen.getByText('Email is required')).toBeInTheDocument()
    expect(screen.getByText('Password is required')).toBeInTheDocument()
    expect(authService.authenticateUser).not.toHaveBeenCalled()
  })

  it('shows password when SHOW is clicked', async () => {
    const user = userEvent.setup()
    renderLogin()

    const passwordInput = screen.getByLabelText('Password')
    expect(passwordInput).toHaveAttribute('type', 'password')

    await user.click(screen.getByRole('button', { name: 'Show password' }))

    expect(passwordInput).toHaveAttribute('type', 'text')
    expect(screen.getByRole('button', { name: 'Hide password' })).toBeInTheDocument()
  })

  it('redirects on successful login', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByLabelText('Email'), 'test@lendsqr.com')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Log In' }))

    await waitFor(() => {
      expect(screen.getByText('Dashboard Page')).toBeInTheDocument()
    })

    expect(authService.authenticateUser).toHaveBeenCalledWith(
      'test@lendsqr.com',
      'password123',
    )
    expect(useUserStore.getState().isAuthenticated).toBe(true)
    expect(useUserStore.getState().email).toBe('test@lendsqr.com')
  })

  it('shows an error when authentication fails', async () => {
    vi.mocked(authService.authenticateUser).mockResolvedValue({ success: false })
    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByLabelText('Email'), 'test@lendsqr.com')
    await user.type(screen.getByLabelText('Password'), 'wrong-password')
    await user.click(screen.getByRole('button', { name: 'Log In' }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid credentials')
    })

    expect(useUserStore.getState().isAuthenticated).toBe(false)
  })
})
