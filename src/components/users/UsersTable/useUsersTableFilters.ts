import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from 'react'
import { useUsersListStore } from '../../../store/useUsersListStore'
import {
  PANEL_WIDTH,
  VIEWPORT_GUTTER,
  type UsersTableColumn,
} from './usersTable.constants'

interface UseUsersTableFiltersOptions {
  tableRef: RefObject<HTMLDivElement | null>
  isMobile: boolean
}

export function useUsersTableFilters({
  tableRef,
  isMobile,
}: UseUsersTableFiltersOptions) {
  const [showFilter, setShowFilter] = useState(false)
  const [activeFilterColumn, setActiveFilterColumn] =
    useState<UsersTableColumn | null>(null)
  const [filterPanelStyle, setFilterPanelStyle] = useState<CSSProperties>({})
  const filterPanelRef = useRef<HTMLDivElement | null>(null)
  const columnHeaderRefs = useRef<
    Partial<Record<UsersTableColumn, HTMLButtonElement | null>>
  >({})

  const userFilters = useUsersListStore((state) => state.userFilters)
  const syncFilterDraftFromApplied = useUsersListStore(
    (state) => state.syncFilterDraftFromApplied,
  )
  const applyUserFilters = useUsersListStore((state) => state.applyUserFilters)
  const resetUserFilters = useUsersListStore((state) => state.resetUserFilters)

  const hasActiveFilters = Object.values(userFilters).some(Boolean)

  const positionFilterPanel = (column: UsersTableColumn) => {
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

  const closeFilterPanel = () => {
    setShowFilter(false)
    setActiveFilterColumn(null)
  }

  const openFilterPanel = (column: UsersTableColumn) => {
    syncFilterDraftFromApplied()
    setActiveFilterColumn(column)
    if (!isMobile) {
      positionFilterPanel(column)
    }
    setShowFilter(true)
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

  return {
    showFilter,
    activeFilterColumn,
    filterPanelStyle,
    filterPanelRef,
    columnHeaderRefs,
    hasActiveFilters,
    openFilterPanel,
    closeFilterPanel,
    handleApplyFilters,
    handleResetFilters,
  }
}
