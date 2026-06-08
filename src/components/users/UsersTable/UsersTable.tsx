import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { useActionMenuKeyboard } from '../../../hooks/useActionMenuKeyboard'
import { useUsersDataStore } from '../../../store/useUsersDataStore'
import {
  useUsersListStore,
  type UserFilterState,
} from '../../../store/useUsersListStore'
import type { User, UserStatus } from '../../../types/user.types'
import { mockUsers } from '../../../utils/mockData'
import { DatePicker } from '../../ui/DatePicker'
import { StatusBadge } from '../../ui/StatusBadge'
import {
  ActivateUserIcon,
  BlacklistUserIcon,
  EyeIcon,
  MenuIcon,
} from '../UserActionIcons'
import { UserCard } from '../UserCard'
import './UsersTable.scss'

interface UsersTableProps {
  users: User[]
}

const columns = [
  'Organization',
  'Username',
  'Email',
  'Phone Number',
  'Date Joined',
  'Status',
] as const

const PANEL_WIDTH = 270
const VIEWPORT_GUTTER = 16
const ACTION_MENU_WIDTH = 180
const ACTION_MENU_HEIGHT = 148
const ACTION_MENU_GAP = 8
const ACTION_MENU_ID = 'users-action-menu'
const statuses: UserStatus[] = ['Active', 'Inactive', 'Pending', 'Blacklisted']

type Column = (typeof columns)[number]

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function FilterIcon() {
  return (
    <svg
      className="users-table__filter-icon"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      aria-hidden="true"
    >
      <path
        d="M2 4h12M4 8h8M6 12h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function FilterDateField() {
  const value = useUsersListStore((state) => state.userFilterDraft.dateJoined)
  const setUserFilterDraft = useUsersListStore(
    (state) => state.setUserFilterDraft,
  )

  return (
    <label className="users-table__filter-field">
      <span>Date</span>
      <DatePicker
        value={value}
        placeholder="Date"
        onChange={(nextValue) => setUserFilterDraft('dateJoined', nextValue)}
      />
    </label>
  )
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6 6 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function FilterField({
  label,
  field,
  placeholder,
  type = 'text',
}: {
  label: string
  field: keyof UserFilterState
  placeholder: string
  type?: string
}) {
  const value = useUsersListStore((state) => state.userFilterDraft[field])
  const setUserFilterDraft = useUsersListStore(
    (state) => state.setUserFilterDraft,
  )

  return (
    <label className="users-table__filter-field">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => setUserFilterDraft(field, event.target.value)}
      />
    </label>
  )
}

export function UsersTable({ users }: UsersTableProps) {
  const [showFilter, setShowFilter] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [activeFilterColumn, setActiveFilterColumn] = useState<Column | null>(null)
  const [filterPanelStyle, setFilterPanelStyle] = useState<CSSProperties>({})
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [actionMenuStyle, setActionMenuStyle] = useState<CSSProperties>({})
  const [actionMenuPlacement, setActionMenuPlacement] = useState<'above' | 'below'>(
    'below',
  )
  const tableRef = useRef<HTMLDivElement | null>(null)
  const filterPanelRef = useRef<HTMLDivElement | null>(null)
  const actionButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const actionMenuTriggerRef = useRef<HTMLButtonElement | null>(null)
  const columnHeaderRefs = useRef<
    Partial<Record<(typeof columns)[number], HTMLButtonElement | null>>
  >({})
  const filterDraft = useUsersListStore((state) => state.userFilterDraft)
  const userFilters = useUsersListStore((state) => state.userFilters)
  const setUserFilterDraft = useUsersListStore(
    (state) => state.setUserFilterDraft,
  )
  const syncFilterDraftFromApplied = useUsersListStore(
    (state) => state.syncFilterDraftFromApplied,
  )
  const applyUserFilters = useUsersListStore((state) => state.applyUserFilters)
  const resetUserFilters = useUsersListStore((state) => state.resetUserFilters)
  const updateUserStatus = useUsersDataStore((state) => state.updateUserStatus)
  const statusOverrides = useUsersDataStore((state) => state.statusOverrides)
  const organizations = useMemo(
    () =>
      Array.from(new Set(mockUsers.map((user) => user.organization))).sort(
        (a, b) => a.localeCompare(b),
      ),
    [],
  )
  const hasActiveFilters = Object.values(userFilters).some(Boolean)
  const openMenuUser = useMemo(
    () => users.find((user) => user.id === openMenuId),
    [openMenuId, users],
  )
  const closeActionMenu = () => setOpenMenuId(null)
  const { menuRef: actionMenuRef, handleMenuKeyDown } = useActionMenuKeyboard({
    isOpen: Boolean(openMenuUser && !isMobile),
    menuId: ACTION_MENU_ID,
    onOpen: () => {},
    onClose: closeActionMenu,
    triggerRef: actionMenuTriggerRef,
  })

  useEffect(() => {
    actionMenuTriggerRef.current = openMenuId
      ? actionButtonRefs.current[openMenuId] ?? null
      : null
  }, [openMenuId])

  const positionActionMenu = (userId: string) => {
    const button = actionButtonRefs.current[userId]

    if (!button) {
      return
    }

    const rect = button.getBoundingClientRect()
    const paginationEl = document.querySelector('.pagination')
    const bottomBoundary = paginationEl
      ? paginationEl.getBoundingClientRect().top
      : window.innerHeight - VIEWPORT_GUTTER
    const spaceBelow = bottomBoundary - rect.bottom - ACTION_MENU_GAP
    const spaceAbove = rect.top - VIEWPORT_GUTTER
    const openAbove =
      spaceBelow < ACTION_MENU_HEIGHT && spaceAbove > spaceBelow
    const top = openAbove
      ? rect.top - ACTION_MENU_HEIGHT - ACTION_MENU_GAP
      : rect.bottom + ACTION_MENU_GAP
    const left = Math.min(
      Math.max(VIEWPORT_GUTTER, rect.right - ACTION_MENU_WIDTH),
      window.innerWidth - ACTION_MENU_WIDTH - VIEWPORT_GUTTER,
    )

    setActionMenuPlacement(openAbove ? 'above' : 'below')
    setActionMenuStyle({ top, left })
  }

  const positionFilterPanel = (column: Column) => {
    const header = columnHeaderRefs.current[column]
    const table = tableRef.current

    if (!header || !table) {
      return
    }

    const headerRect = header.getBoundingClientRect()
    const tableRect = table.getBoundingClientRect()
    const panelViewportLeft = Math.min(
      headerRect.left,
      window.innerWidth - PANEL_WIDTH - VIEWPORT_GUTTER,
    )

    setFilterPanelStyle({
      left: Math.max(VIEWPORT_GUTTER, panelViewportLeft) - tableRect.left,
      top: headerRect.bottom - tableRect.top + 8,
    })
  }

  const openFilterPanel = (column: Column) => {
    syncFilterDraftFromApplied()
    setActiveFilterColumn(column)
    if (!isMobile) {
      positionFilterPanel(column)
    }
    setShowFilter(true)
  }

  const closeFilterPanel = () => {
    setShowFilter(false)
    setActiveFilterColumn(null)
  }

  const handleApplyFilters = () => {
    applyUserFilters()
    if (isMobile) {
      closeFilterPanel()
    }
  }

  const handleResetFilters = () => {
    resetUserFilters()
    if (isMobile) {
      closeFilterPanel()
    }
  }

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${768 - 1}px)`)

    const updateIsMobile = () => {
      setIsMobile(mediaQuery.matches)
    }

    updateIsMobile()
    mediaQuery.addEventListener('change', updateIsMobile)

    return () => {
      mediaQuery.removeEventListener('change', updateIsMobile)
    }
  }, [])

  useEffect(() => {
    if (isMobile && showFilter) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }

    return undefined
  }, [isMobile, showFilter])

  useEffect(() => {
    if (!showFilter || isMobile) {
      return undefined
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      const panel = filterPanelRef.current
      const headerButtons = Object.values(columnHeaderRefs.current)

      if (panel?.contains(target)) {
        return
      }

      if (headerButtons.some((button) => button?.contains(target))) {
        return
      }

      closeFilterPanel()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeFilterPanel()
      }
    }

    const handleResize = () => {
      if (activeFilterColumn) {
        positionFilterPanel(activeFilterColumn)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', handleResize)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleResize)
    }
  }, [activeFilterColumn, isMobile, showFilter])

  useEffect(() => {
    if (!openMenuId || isMobile) {
      return undefined
    }

    positionActionMenu(openMenuId)

    const handleReposition = () => {
      positionActionMenu(openMenuId)
    }

    window.addEventListener('resize', handleReposition)
    window.addEventListener('scroll', handleReposition, true)

    return () => {
      window.removeEventListener('resize', handleReposition)
      window.removeEventListener('scroll', handleReposition, true)
    }
  }, [isMobile, openMenuId])

  useEffect(() => {
    if (!showFilter || !isMobile) {
      return undefined
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeFilterPanel()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMobile, showFilter])

  return (
    <div className="users-table" ref={tableRef}>
      {openMenuId && (
        <button
          type="button"
          className="users-table__menu-overlay"
          aria-label="Close user actions menu"
          onClick={closeActionMenu}
        />
      )}

      {openMenuUser && !isMobile && (
        <div
          ref={actionMenuRef}
          id={ACTION_MENU_ID}
          className={`users-table__action-menu users-table__action-menu--${actionMenuPlacement}`}
          style={actionMenuStyle}
          role="menu"
          aria-orientation="vertical"
          onKeyDown={handleMenuKeyDown}
        >
          <Link
            to={`/users/${openMenuUser.id}`}
            className="users-table__action-menu-item"
            role="menuitem"
            tabIndex={-1}
            onClick={closeActionMenu}
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
              updateUserStatus(openMenuUser.id, 'Blacklisted')
              closeActionMenu()
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
              updateUserStatus(openMenuUser.id, 'Active')
              closeActionMenu()
            }}
          >
            <ActivateUserIcon />
            Activate User
          </button>
        </div>
      )}

      <div className="users-table__mobile-toolbar">
        <button
          type="button"
          className={`users-table__mobile-filter-btn ${
            hasActiveFilters ? 'users-table__mobile-filter-btn--active' : ''
          }`}
          onClick={() => openFilterPanel('Organization')}
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

      <div className="users-table__desktop">
        <div className="users-table__scroll">
          <table className="users-table__table">
          <thead className="users-table__head">
            <tr>
              {columns.map((column) => (
                  <th key={column} className="users-table__th">
                    <span className="users-table__th-content">
                      <button
                        type="button"
                        className="users-table__header-filter-btn"
                        onClick={() => openFilterPanel(column)}
                        aria-expanded={
                          showFilter && activeFilterColumn === column
                        }
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
                          hasActiveFilters
                            ? 'users-table__filter-btn--filtered'
                            : ''
                        }`}
                        onClick={() => openFilterPanel(column)}
                        aria-label={`Filter by ${column}`}
                        aria-expanded={
                          showFilter && activeFilterColumn === column
                        }
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
                    <Link
                      to={`/users/${user.id}`}
                      className="users-table__link"
                    >
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
                    {formatDate(user.date_joined)}
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
                      onClick={() =>
                        setOpenMenuId((current) =>
                          current === user.id ? null : user.id,
                        )
                      }
                      onKeyDown={(event) => {
                        if (
                          (event.key === 'ArrowDown' ||
                            event.key === 'ArrowUp') &&
                          openMenuId !== user.id
                        ) {
                          event.preventDefault()
                          setOpenMenuId(user.id)
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

      <div className="users-table__mobile-card-list">
        {users.map((user) => {
          const status = statusOverrides[user.id] ?? user.status

          return (
            <UserCard
              key={user.id}
              user={user}
              status={status}
              isMenuOpen={openMenuId === user.id}
              onMenuToggle={() =>
                setOpenMenuId((current) =>
                  current === user.id ? null : user.id,
                )
              }
              onMenuClose={() => setOpenMenuId(null)}
              onBlacklist={() => {
                updateUserStatus(user.id, 'Blacklisted')
                setOpenMenuId(null)
              }}
              onActivate={() => {
                updateUserStatus(user.id, 'Active')
                setOpenMenuId(null)
              }}
            />
          )
        })}
      </div>

      {showFilter && isMobile && (
        <button
          type="button"
          className="users-table__filter-backdrop"
          aria-label="Close filter panel"
          onClick={closeFilterPanel}
        />
      )}

      {showFilter && (
        <div
          id="users-filter-panel"
          ref={filterPanelRef}
          className="users-table__filter-panel"
          style={isMobile ? undefined : filterPanelStyle}
        >
          <div className="users-table__filter-panel-header">
            <h2 className="users-table__filter-panel-title">Filter Users</h2>
            <button
              type="button"
              className="users-table__filter-panel-close"
              aria-label="Close filter panel"
              onClick={closeFilterPanel}
            >
              <CloseIcon />
            </button>
          </div>
          <label className="users-table__filter-field">
            <span>Organization</span>
            <select
              value={filterDraft.organization}
              onChange={(event) =>
                setUserFilterDraft('organization', event.target.value)
              }
            >
              <option value="">Select</option>
              {organizations.map((organization) => (
                <option key={organization} value={organization}>
                  {organization}
                </option>
              ))}
            </select>
          </label>
          <FilterField label="Username" field="username" placeholder="User" />
          <FilterField
            label="Email"
            field="email"
            placeholder="Email"
            type="email"
          />
          <FilterDateField />
          <FilterField
            label="Phone Number"
            field="phoneNumber"
            placeholder="Phone Number"
          />
          <label className="users-table__filter-field">
            <span>Status</span>
            <select
              value={filterDraft.status}
              onChange={(event) =>
                setUserFilterDraft('status', event.target.value)
              }
            >
              <option value="">Select</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <div className="users-table__filter-actions">
            <button
              type="button"
              className="users-table__filter-reset"
              onClick={handleResetFilters}
            >
              Reset
            </button>
            <button
              type="button"
              className="users-table__filter-submit"
              onClick={handleApplyFilters}
            >
              Filter
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
