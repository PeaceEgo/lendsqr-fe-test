import { useMemo, useRef } from 'react'
import { useUsersDataStore } from '../../../store/useUsersDataStore'
import type { User } from '../../../types/user.types'
import { mockUsers } from '../../../utils/mockData'
import { UsersActionMenu } from './UsersActionMenu'
import { UsersFilterPanel } from './UsersFilterPanel'
import { UsersTableDesktop } from './UsersTableDesktop'
import { UsersTableMobile } from './UsersTableMobile'
import { useIsMobile } from './useIsMobile'
import { useUsersTableActionMenu } from './useUsersTableActionMenu'
import { useUsersTableFilters } from './useUsersTableFilters'
import './UsersTable.scss'

interface UsersTableProps {
  users: User[]
}

export function UsersTable({ users }: UsersTableProps) {
  const tableRef = useRef<HTMLDivElement | null>(null)
  const isMobile = useIsMobile()

  const updateUserStatus = useUsersDataStore((state) => state.updateUserStatus)
  const statusOverrides = useUsersDataStore((state) => state.statusOverrides)

  const organizations = useMemo(
    () =>
      Array.from(new Set(mockUsers.map((user) => user.organization))).sort(
        (a, b) => a.localeCompare(b),
      ),
    [],
  )

  const filters = useUsersTableFilters({ tableRef, isMobile })
  const menu = useUsersTableActionMenu({ users, isMobile })

  const handleBlacklist = (userId: string) => {
    updateUserStatus(userId, 'Blacklisted')
    menu.setOpenMenuId(null)
  }

  const handleActivate = (userId: string) => {
    updateUserStatus(userId, 'Active')
    menu.setOpenMenuId(null)
  }

  return (
    <div className="users-table" ref={tableRef}>
      <UsersActionMenu
        isMobile={isMobile}
        isOpen={Boolean(menu.openMenuId)}
        user={menu.openMenuUser}
        menuRef={menu.actionMenuRef}
        menuStyle={menu.actionMenuStyle}
        placement={menu.actionMenuPlacement}
        onClose={menu.closeActionMenu}
        onKeyDown={menu.handleMenuKeyDown}
        onBlacklist={handleBlacklist}
        onActivate={handleActivate}
      />

      <UsersTableMobile
        users={users}
        statusOverrides={statusOverrides}
        openMenuId={menu.openMenuId}
        showFilter={filters.showFilter}
        hasActiveFilters={filters.hasActiveFilters}
        onOpenFilter={() => filters.openFilterPanel('Organization')}
        onToggleMenu={menu.toggleMenu}
        onCloseMenu={menu.closeActionMenu}
        onBlacklist={handleBlacklist}
        onActivate={handleActivate}
      />

      <UsersTableDesktop
        users={users}
        statusOverrides={statusOverrides}
        openMenuId={menu.openMenuId}
        showFilter={filters.showFilter}
        activeFilterColumn={filters.activeFilterColumn}
        hasActiveFilters={filters.hasActiveFilters}
        columnHeaderRefs={filters.columnHeaderRefs}
        actionButtonRefs={menu.actionButtonRefs}
        onOpenFilter={filters.openFilterPanel}
        onToggleMenu={menu.toggleMenu}
        onOpenMenu={menu.openMenu}
      />

      <UsersFilterPanel
        isOpen={filters.showFilter}
        isMobile={isMobile}
        panelStyle={filters.filterPanelStyle}
        panelRef={filters.filterPanelRef}
        organizations={organizations}
        onClose={filters.closeFilterPanel}
        onApply={filters.handleApplyFilters}
        onReset={filters.handleResetFilters}
      />
    </div>
  )
}
