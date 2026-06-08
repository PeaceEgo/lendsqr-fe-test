import { Link } from 'react-router-dom'
import { useActionMenuKeyboard } from '../../../hooks/useActionMenuKeyboard'
import type { User, UserStatus } from '../../../types/user.types'
import { StatusBadge } from '../../ui/StatusBadge'
import {
  ActivateUserIcon,
  BlacklistUserIcon,
  EyeIcon,
  MenuIcon,
} from '../UserActionIcons'
import './UserCard.scss'

interface UserCardProps {
  user: User
  status: UserStatus
  isMenuOpen: boolean
  onMenuToggle: () => void
  onMenuClose: () => void
  onBlacklist: () => void
  onActivate: () => void
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function UserCard({
  user,
  status,
  isMenuOpen,
  onMenuToggle,
  onMenuClose,
  onBlacklist,
  onActivate,
}: UserCardProps) {
  const menuId = `user-actions-menu-${user.id}`
  const openMenu = () => {
    if (!isMenuOpen) {
      onMenuToggle()
    }
  }
  const { menuRef, triggerRef, handleTriggerKeyDown, handleMenuKeyDown } =
    useActionMenuKeyboard({
      isOpen: isMenuOpen,
      menuId,
      onOpen: openMenu,
      onClose: onMenuClose,
    })

  return (
    <article className="user-card">
      <div className="user-card__header">
        <div>
          <p className="user-card__label">Organization</p>
          <p className="user-card__value">{user.organization}</p>
        </div>
        <div className="user-card__actions">
          <button
            ref={triggerRef}
            type="button"
            className="user-card__menu-btn"
            aria-label={`Actions for ${user.username}`}
            aria-expanded={isMenuOpen}
            aria-haspopup="menu"
            aria-controls={menuId}
            onClick={onMenuToggle}
            onKeyDown={handleTriggerKeyDown}
          >
            <MenuIcon />
          </button>
          {isMenuOpen && (
            <div
              ref={menuRef}
              id={menuId}
              className="user-card__menu"
              role="menu"
              aria-orientation="vertical"
              onKeyDown={handleMenuKeyDown}
            >
              <Link
                to={`/users/${user.id}`}
                className="user-card__menu-item"
                role="menuitem"
                tabIndex={-1}
                onClick={onMenuClose}
              >
                <EyeIcon />
                View Details
              </Link>
              <button
                type="button"
                className="user-card__menu-item"
                role="menuitem"
                tabIndex={-1}
                onClick={onBlacklist}
              >
                <BlacklistUserIcon />
                Blacklist User
              </button>
              <button
                type="button"
                className="user-card__menu-item"
                role="menuitem"
                tabIndex={-1}
                onClick={onActivate}
              >
                <ActivateUserIcon />
                Activate User
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="user-card__body">
        <div className="user-card__field">
          <p className="user-card__label">Username</p>
          <Link to={`/users/${user.id}`} className="user-card__link">
            {user.username}
          </Link>
        </div>
        <div className="user-card__field">
          <p className="user-card__label">Email</p>
          <p className="user-card__value">{user.email}</p>
        </div>
        <div className="user-card__field">
          <p className="user-card__label">Phone Number</p>
          <p className="user-card__value">{user.phone_number}</p>
        </div>
        <div className="user-card__field">
          <p className="user-card__label">Date Joined</p>
          <p className="user-card__value">{formatDate(user.date_joined)}</p>
        </div>
        <div className="user-card__field user-card__field--status">
          <p className="user-card__label">Status</p>
          <StatusBadge status={status} />
        </div>
      </div>
    </article>
  )
}
