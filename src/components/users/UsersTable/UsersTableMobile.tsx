import type { User, UserStatus } from '../../../types/user.types'
import { UserCard } from '../UserCard'
import { FilterIcon } from './UsersTableIcons'

interface UsersTableMobileProps {
  users: User[]
  statusOverrides: Record<string, UserStatus>
  openMenuId: string | null
  showFilter: boolean
  hasActiveFilters: boolean
  onOpenFilter: () => void
  onToggleMenu: (userId: string) => void
  onCloseMenu: () => void
  onBlacklist: (userId: string) => void
  onActivate: (userId: string) => void
}

export function UsersTableMobile({
  users,
  statusOverrides,
  openMenuId,
  showFilter,
  hasActiveFilters,
  onOpenFilter,
  onToggleMenu,
  onCloseMenu,
  onBlacklist,
  onActivate,
}: UsersTableMobileProps) {
  return (
    <>
      <div className="users-table__mobile-toolbar">
        <button
          type="button"
          className={`users-table__mobile-filter-btn ${
            hasActiveFilters ? 'users-table__mobile-filter-btn--active' : ''
          }`}
          onClick={onOpenFilter}
          aria-expanded={showFilter}
          aria-controls="users-filter-panel"
        >
          <FilterIcon />
          Filter
          {hasActiveFilters && (
            <span className="users-table__mobile-filter-badge" aria-hidden="true" />
          )}
        </button>
      </div>

      <div className="users-table__mobile-card-list">
        {users.map((user) => {
          const status = statusOverrides[user.id] ?? user.status

          return (
            <UserCard
              key={user.id}
              user={user}
              status={status}
              isMenuOpen={openMenuId === user.id}
              onMenuToggle={() => onToggleMenu(user.id)}
              onMenuClose={onCloseMenu}
              onBlacklist={() => onBlacklist(user.id)}
              onActivate={() => onActivate(user.id)}
            />
          )
        })}
      </div>
    </>
  )
}
