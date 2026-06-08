import './EmptyState.scss'

interface EmptyStateProps {
  title?: string
  message?: string
}

export function EmptyState({
  title = 'No data found',
  message = 'There is nothing to show here yet.',
}: EmptyStateProps) {
  return (
    <div className="empty-state" role="status">
      <span className="empty-state__icon" aria-hidden="true">
        📋
      </span>
      <p className="empty-state__title">{title}</p>
      <p className="empty-state__message">{message}</p>
    </div>
  )
}
