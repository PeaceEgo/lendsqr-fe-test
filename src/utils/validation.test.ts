import { describe, expect, it } from 'vitest'
import { isValidEmail, validateLoginForm } from './validation'

describe('validateLoginForm', () => {
  it('returns errors for empty fields', () => {
    expect(validateLoginForm('', '')).toEqual({
      email: 'Email is required',
      password: 'Password is required',
    })
  })

  it('returns error for invalid email format', () => {
    expect(validateLoginForm('not-an-email', 'password')).toEqual({
      email: 'Enter a valid email address',
    })
  })

  it('returns no errors for valid input', () => {
    expect(validateLoginForm('test@lendsqr.com', 'password')).toEqual({})
  })
})

describe('isValidEmail', () => {
  it('accepts valid emails', () => {
    expect(isValidEmail('user@lendsqr.com')).toBe(true)
  })

  it('rejects invalid emails', () => {
    expect(isValidEmail('invalid')).toBe(false)
  })
})
