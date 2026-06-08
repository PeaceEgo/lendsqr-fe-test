const STORAGE_PREFIX = 'lendsqr_'

export const storageKeys = {
  auth: `${STORAGE_PREFIX}auth`,
  userFilters: `${STORAGE_PREFIX}user_filters`,
  userStatuses: `${STORAGE_PREFIX}user_statuses`,
  userDetails: (id: string) => `${STORAGE_PREFIX}user_${id}`,
} as const

export function getItem<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key)
    return item ? (JSON.parse(item) as T) : null
  } catch {
    return null
  }
}

export function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export function removeItem(key: string): void {
  localStorage.removeItem(key)
}

export function clearStorage(): void {
  Object.keys(localStorage)
    .filter((key) => key.startsWith(STORAGE_PREFIX))
    .forEach((key) => localStorage.removeItem(key))
}
