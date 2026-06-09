import type { UserStatus } from '../../../types/user.types'

export const USERS_TABLE_COLUMNS = [
  'Organization',
  'Username',
  'Email',
  'Phone Number',
  'Date Joined',
  'Status',
] as const

export type UsersTableColumn = (typeof USERS_TABLE_COLUMNS)[number]

export const FILTER_STATUSES: UserStatus[] = [
  'Active',
  'Inactive',
  'Pending',
  'Blacklisted',
]

export const PANEL_WIDTH = 270
export const VIEWPORT_GUTTER = 16
export const ACTION_MENU_WIDTH = 180
export const ACTION_MENU_HEIGHT = 148
export const ACTION_MENU_GAP = 8
export const ACTION_MENU_ID = 'users-action-menu'
export const MOBILE_BREAKPOINT = 768
