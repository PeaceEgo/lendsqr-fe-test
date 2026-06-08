import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { authenticateUser } from '../../services/auth.service'
import { useUserStore } from '../../store/useUserStore'
import { validateLoginForm } from '../../utils/validation'
import './Login.scss'

export function Login() {
  const navigate = useNavigate()
  const isAuthenticated = useUserStore((state) => state.isAuthenticated)
  const login = useUserStore((state) => state.login)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string
    password?: string
  }>({})
  const [formError, setFormError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    document.title = 'Login | Lendsqr'
  }, [])

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const errors = validateLoginForm(email, password)
    setFieldErrors(errors)
    setFormError('')

    if (Object.keys(errors).length > 0) {
      return
    }

    setIsLoading(true)

    try {
      const result = await authenticateUser(email.trim(), password)

      if (result.success) {
        login(email.trim(), password)
        navigate('/dashboard')
        return
      }

      setFormError('Invalid credentials')
    } catch {
      setFormError('Invalid credentials')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailChange = (value: string) => {
    setEmail(value)
    if (fieldErrors.email) {
      setFieldErrors((prev) => ({ ...prev, email: undefined }))
    }
    if (formError) {
      setFormError('')
    }
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    if (fieldErrors.password) {
      setFieldErrors((prev) => ({ ...prev, password: undefined }))
    }
    if (formError) {
      setFormError('')
    }
  }

  return (
    <div className="login">
      <section className="login__left left-column">
        <header className="login__logo">
          <img
            className="login__logo-img"
            src="/images/lendsqr-logo.png"
            alt="Lendsqr"
            width={174}
            height={36}
          />
        </header>

        <div className="login__illustration" aria-hidden="true">
          <img
            className="login__illustration-img"
            src="/images/pablo-sign-in.png"
            alt=""
            width={600}
            height={338}
          />
        </div>
      </section>

      <section className="login__form-panel right-column">
        <form
          className="login__form"
          onSubmit={handleSubmit}
          noValidate
          aria-label="Login form"
        >
          <h1 className="login__heading">Welcome!</h1>
          <p className="login__subheading">Enter details to login.</p>

          <div className="login__fields">
            <Input
              type="email"
              name="email"
              placeholder="Email"
              autoComplete="email"
              value={email}
              onChange={(event) => handleEmailChange(event.target.value)}
              aria-label="Email"
              error={fieldErrors.email}
            />

            <Input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => handlePasswordChange(event.target.value)}
              aria-label="Password"
              error={fieldErrors.password}
              endAdornment={
                <button
                  type="button"
                  className="login__toggle-password"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              }
            />
          </div>

          <button type="button" className="login__forgot">
            Forgot Password?
          </button>

          {formError && (
            <p className="login__form-error" role="alert">
              {formError}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            className="login__submit"
            loading={isLoading}
          >
            Log In
          </Button>
        </form>
      </section>
    </div>
  )
}
