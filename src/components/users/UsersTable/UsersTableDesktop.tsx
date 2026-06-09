import { Link } from 'react-router-dom'
import type { MutableRefObject } from 'react'
import type { User, UserStatus } from '../../../types/user.types'
import { StatusBadge } from '../../ui/StatusBadge'
import { MenuIcon } from '../UserActionIcons'
import {
  ACTION_MENU_ID,
  USERS_TABLE_COLUMNS,
  type UsersTableColumn,
} from './usersTable.constants'
import { formatUserDate } from './usersTable.utils'
import { FilterIcon } from './UsersTableIcons'

interface UsersTableDesktopProps {
  users: User[]
  statusOverrides: Record<string, UserStatus>
  openMenuId: string | null
  showFilter: boolean
  activeFilterColumn: UsersTableColumn | null
  hasActiveFilters: boolean
  columnHeaderRefs: MutableRefObject<
    Partial<Record<UsersTableColumn, HTMLButtonElement | null>>
  >
  actionButtonRefs: MutableRefObject<Record<string, HTMLButtonElement | null>>
  onOpenFilter: (column: UsersTableColumn) => void
  onToggleMenu: (userId: string) => void
  onOpenMenu: (userId: string) => void
}

export function UsersTableDesktop({
  users,
  statusOverrides,
  openMenuId,
  showFilter,
  activeFilterColumn,
  hasActiveFilters,
  columnHeaderRefs,
  actionButtonRefs,
  onOpenFilter,
  onToggleMenu,
  onOpenMenu,
}: UsersTableDesktopProps) {
  return (
    <div className="users-table__desktop">
      <div className="users-table__scroll">
        <table className="users-table__table">
          <thead className="users-table__head">
            <tr>
              {USERS_TABLE_COLUMNS.map((column) => (
                <th key={column} className="users-table__th">
                  <span className="users-table__th-content">
                    <button
                      type="button"
                      className="users-table__header-filter-btn"
                      onClick={() => onOpenFilter(column)}
                      aria-expanded={showFilter && activeFilterColumn === column}
                      aria-controls="users-filter-panel"
                    >
                      {column}
                    </button>
                    <button
                      ref={(node) => {
                        columnHeaderRefs.current[column] = node
                      }}
                      type="button"
                      className={`users-table__filter-btn ${
                        hasActiveFilters ? 'users-table__filter-btn--filtered' : ''
                      }`}
                      onClick={() => onOpenFilter(column)}
                      aria-label={`Filter by ${column}`}
                      aria-expanded={showFilter && activeFilterColumn === column}
                      aria-controls="users-filter-panel"
                    >
                      <FilterIcon />
                    </button>
                  </span>
                </th>
              ))}
              <th className="users-table__th" aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const status = statusOverrides[user.id] ?? user.status

              return (
                <tr key={user.id} className="users-table__row">
                  <td className="users-table__cell" data-col="organization">
                    {user.organization}
                  </td>
                  <td className="users-table__cell" data-col="username">
                    <Link to={`/users/${user.id}`} className="users-table__link">
                      {user.username}
                    </Link>
                  </td>
                  <td className="users-table__cell" data-col="email">
                    {user.email}
                  </td>
                  <td className="users-table__cell" data-col="phone">
                    {user.phone_number}
                  </td>
                  <td className="users-table__cell" data-col="date-joined">
                    {formatUserDate(user.date_joined)}
                  </td>
                  <td className="users-table__cell" data-col="status">
                    <StatusBadge status={status} />
                  </td>
                  <td className="users-table__cell users-table__cell--actions">
                    <button
                      ref={(node) => {
                        actionButtonRefs.current[user.id] = node
                      }}
                      type="button"
                      className="users-table__action-btn"
                      aria-label={`Actions for ${user.username}`}
                      aria-expanded={openMenuId === user.id}
                      aria-haspopup="menu"
                      aria-controls={ACTION_MENU_ID}
                      onClick={() => onToggleMenu(user.id)}
                      onKeyDown={(event) => {
                        if (
                          (event.key === 'ArrowDown' ||
                            event.key === 'ArrowUp') &&
                          openMenuId !== user.id
                        ) {
                          event.preventDefault()
                          onOpenMenu(user.id)
                        }
                      }}
                    >
                      <MenuIcon />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
