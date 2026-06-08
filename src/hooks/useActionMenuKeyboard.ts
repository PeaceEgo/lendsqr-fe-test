import {
  useEffect,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type RefObject,
} from 'react'

interface UseActionMenuKeyboardOptions {
  isOpen: boolean
  menuId: string
  onOpen: () => void
  onClose: () => void
  triggerRef?: RefObject<HTMLButtonElement | null>
}

export function useActionMenuKeyboard({
  isOpen,
  menuId,
  onOpen,
  onClose,
  triggerRef: externalTriggerRef,
}: UseActionMenuKeyboardOptions) {
  const internalTriggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const triggerRef = externalTriggerRef ?? internalTriggerRef

  useEffect(() => {
    if (!isOpen || !menuRef.current) {
      return
    }

    const items = menuRef.current.querySelectorAll<HTMLElement>('[role="menuitem"]')
    items[0]?.focus()
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const handleDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleDocumentKeyDown)

    return () => {
      document.removeEventListener('keydown', handleDocumentKeyDown)
    }
  }, [isOpen, onClose, triggerRef])

  const handleTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (
      (event.key === 'ArrowDown' || event.key === 'ArrowUp') &&
      !isOpen
    ) {
      event.preventDefault()
      onOpen()
    }
  }

  const handleMenuKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const menu = menuRef.current

    if (!menu) {
      return
    }

    const items = Array.from(
      menu.querySelectorAll<HTMLElement>('[role="menuitem"]'),
    )

    if (items.length === 0) {
      return
    }

    const currentIndex = items.indexOf(document.activeElement as HTMLElement)

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        items[(currentIndex + 1) % items.length]?.focus()
        break
      case 'ArrowUp':
        event.preventDefault()
        items[(currentIndex <= 0 ? items.length : currentIndex) - 1]?.focus()
        break
      case 'Home':
        event.preventDefault()
        items[0]?.focus()
        break
      case 'End':
        event.preventDefault()
        items[items.length - 1]?.focus()
        break
      case 'Tab':
        onClose()
        break
      default:
        break
    }
  }

  return {
    menuId,
    menuRef,
    triggerRef,
    handleTriggerKeyDown,
    handleMenuKeyDown,
  }
}
