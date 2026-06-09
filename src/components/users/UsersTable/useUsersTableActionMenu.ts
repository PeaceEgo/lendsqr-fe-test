import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { useActionMenuKeyboard } from '../../../hooks/useActionMenuKeyboard'
import type { User } from '../../../types/user.types'
import {
  ACTION_MENU_GAP,
  ACTION_MENU_HEIGHT,
  ACTION_MENU_ID,
  ACTION_MENU_WIDTH,
  VIEWPORT_GUTTER,
} from './usersTable.constants'

interface UseUsersTableActionMenuOptions {
  users: User[]
  isMobile: boolean
}

export function useUsersTableActionMenu({
  users,
  isMobile,
}: UseUsersTableActionMenuOptions) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [actionMenuStyle, setActionMenuStyle] = useState<CSSProperties>({})
  const [actionMenuPlacement, setActionMenuPlacement] = useState<'above' | 'below'>(
    'below',
  )
  const actionButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const actionMenuTriggerRef = useRef<HTMLButtonElement | null>(null)

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

  const toggleMenu = (userId: string) => {
    setOpenMenuId((current) => (current === userId ? null : userId))
  }

  const openMenu = (userId: string) => {
    setOpenMenuId(userId)
  }

  return {
    openMenuId,
    openMenuUser,
    actionMenuStyle,
    actionMenuPlacement,
    actionButtonRefs,
    actionMenuRef,
    handleMenuKeyDown,
    closeActionMenu,
    toggleMenu,
    openMenu,
    setOpenMenuId,
  }
}
