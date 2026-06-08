import { describe, expect, it } from 'vitest'
import { mockUsers } from '../utils/mockData'

describe('mockData', () => {
  it('generates 500 users', () => {
    expect(mockUsers).toHaveLength(500)
  })

  it('assigns unique ids', () => {
    const ids = new Set(mockUsers.map((user) => user.id))
    expect(ids.size).toBe(500)
  })
})
