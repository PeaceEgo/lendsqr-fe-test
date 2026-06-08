import type { HTMLAttributes } from 'react'

type BadgeProps = HTMLAttributes<HTMLSpanElement>

export function Badge({ children, ...props }: BadgeProps) {
  return <span {...props}>{children}</span>
}
