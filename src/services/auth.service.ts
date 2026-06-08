import { isValidEmail } from '../utils/validation'

export interface AuthResponse {
  success: boolean
}

export async function authenticateUser(
  email: string,
  password: string,
): Promise<AuthResponse> {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  if (!isValidEmail(email) || !password.trim()) {
    return { success: false }
  }

  if (password === 'invalid') {
    return { success: false }
  }

  return { success: true }
}
