import { Link } from 'react-router-dom'
import type { CSSProperties, KeyboardEvent, RefObject } from 'react'
import type { User } from '../../../types/user.types'
import {
  ActivateUserIcon,
  BlacklistUserIcon,
  EyeIcon,
} from '../UserActionIcons'
import { ACTION_MENU_ID } from './usersTable.constants'

interface UsersActionMenuProps {
  isMobile: boolean
  isOpen: boolean
  user: User | undefined
  menuRef: RefObject<HTMLDivElement | null>
  menuStyle: CSSProperties
  placement: 'above' | 'below'
  onClose: () => void
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void
  onBlacklist: (userId: string) => void
  onActivate: (userId: string) => void
}

export function UsersActionMenu({
  isMobile,
  isOpen,
  user,
  menuRef,
  menuStyle,
  placement,
  onClose,
  onKeyDown,
  onBlacklist,
  onActivate,
}: UsersActionMenuProps) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="users-table__menu-overlay"
          aria-label="Close user actions menu"
          onClick={onClose}
        />
      )}

      {user && !isMobile && (
        <div
          ref={menuRef}
          id={ACTION_MENU_ID}
          className={`users-table__action-menu users-table__action-menu--${placement}`}
          style={menuStyle}
          role="menu"
          aria-orientation="vertical"
          onKeyDown={onKeyDown}
        >
          <Link
            to={`/users/${user.id}`}
            className="users-table__action-menu-item"
            role="menuitem"
            tabIndex={-1}
            onClick={onClose}
          >
            <EyeIcon />
            View Details
          </Link>
          <button
            type="button"
            className="users-table__action-menu-item"
            role="menuitem"
            tabIndex={-1}
            onClick={() => {
              onBlacklist(user.id)
              onClose()
            }}
          >
            <BlacklistUserIcon />
            Blacklist User
          </button>
          <button
            type="button"
            className="users-table__action-menu-item"
            role="menuitem"
            tabIndex={-1}
            onClick={() => {
              onActivate(user.id)
              onClose()
            }}
          >
            <ActivateUserIcon />
            Activate User
          </button>
        </div>
      )}
    </>
  )
}
