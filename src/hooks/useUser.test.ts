import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import * as usersService from '../services/users.service'
import { useUsersDataStore } from '../store/useUsersDataStore'
import type { User } from '../types/user.types'
import { getItem, removeItem, storageKeys } from '../utils/localStorage'
import { useUser } from './useUser'

vi.mock('../services/users.service')

const mockUser: User = {
  id: 'LSQ001',
  organization: 'Lendsqr',
  username: 'test_user',
  email: 'test@example.com',
  phone_number: '08010000001',
  date_joined: '2023-01-01',
  status: 'Active',
  full_name: 'Test User',
  bvn: '12345678901',
  gender: 'Male',
  marital_status: 'Single',
  children: 'None',
  type_of_residence: 'Own Apartment',
  level_of_education: 'B.Sc',
  employment_status: 'Employed',
  sector_of_employment: 'FinTech',
  duration_of_employment: '2 years',
  office_email: 'office@example.com',
  monthly_income: '₦200,000.00',
  loan_repayment: '₦40,000.00',
  avatar: '/images/avatar.png',
  socials: {
    twitter: '@test',
    facebook: 'test',
    instagram: '@test',
  },
  guarantors: [
    {
      full_name: 'Guarantor One',
      phone_number: '07060780922',
      email_address: 'g1@example.com',
      relationship: 'Sister',
    },
    {
      full_name: 'Guarantor Two',
      phone_number: '07060780923',
      email_address: 'g2@example.com',
      relationship: 'Brother',
    },
  ],
}

describe('useUser', () => {
  beforeEach(() => {
    removeItem(storageKeys.userDetails('LSQ001'))
    removeItem(storageKeys.userDetails('LSQ404'))
    useUsersDataStore.setState({ statusOverrides: {} })
    vi.mocked(usersService.fetchUserById).mockReset()
  })

  it('loads cached user before fetching from the API', async () => {
    vi.mocked(usersService.fetchUserById).mockResolvedValue(mockUser)
    localStorage.setItem(
      storageKeys.userDetails('LSQ001'),
      JSON.stringify({ ...mockUser, full_name: 'Cached User' }),
    )

    const { result } = renderHook(() => useUser('LSQ001'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.user?.full_name).toBe('Test User')
    expect(getItem<User>(storageKeys.userDetails('LSQ001'))?.full_name).toBe(
      'Test User',
    )
  })

  it('returns an error when the user is not found and no cache exists', async () => {
    vi.mocked(usersService.fetchUserById).mockRejectedValue(
      new Error('User with id "LSQ404" not found'),
    )

    const { result } = renderHook(() => useUser('LSQ404'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.user).toBeNull()
    expect(result.current.error).toContain('not found')
  })
})
