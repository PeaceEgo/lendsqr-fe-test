import { FaCaretDown } from 'react-icons/fa'

interface DropdownIconProps {
  className?: string
  size?: number
}

export function DropdownIcon({ className = '', size = 12 }: DropdownIconProps) {
  return <FaCaretDown className={className} size={size} aria-hidden="true" />
}
