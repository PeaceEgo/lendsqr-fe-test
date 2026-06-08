import type { UserStatus } from '../../../types/user.types'
import './StatusBadge.scss'

interface StatusBadgeProps {
  status: UserStatus
}

const statusClassMap: Record<UserStatus, string> = {
  Active: 'status-badge--active',
  Inactive: 'status-badge--inactive',
  Pending: 'status-badge--pending',
  Blacklisted: 'status-badge--blacklisted',
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`status-badge ${statusClassMap[status]}`} role="status">
      {status}
    </span>
  )
}
