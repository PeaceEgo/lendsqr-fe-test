import './ErrorState.scss'

interface ErrorStateProps {
  message: string
  onRetry: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="error-state" role="alert">
      <span className="error-state__icon" aria-hidden="true">
        ⚠️
      </span>
      <p className="error-state__title">Something went wrong</p>
      <p className="error-state__message">{message}</p>
      <button type="button" className="error-state__retry" onClick={onRetry}>
        Try again
      </button>
    </div>
  )
}
