import type {
  PaginatedUsersResponse,
  User,
  UsersQueryParams,
} from '../types/user.types'
import { getMockUserById, getMockUsersPage } from '../utils/mockData'

const DEFAULT_LIMIT = 10

export async function fetchUsers(
  params: UsersQueryParams = {},
): Promise<PaginatedUsersResponse> {
  const page = params.page ?? 1
  const limit = params.limit ?? DEFAULT_LIMIT

  await new Promise((resolve) => setTimeout(resolve, 300))

  const { data, total } = getMockUsersPage(page, limit, {
    search: params.search,
    status: params.status,
    organization: params.organization,
    username: params.username,
    email: params.email,
    dateJoined: params.dateJoined,
    phoneNumber: params.phoneNumber,
  })

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

export async function fetchUserById(id: string): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 200))

  const user = getMockUserById(id)

  if (!user) {
    throw new Error(`User with id "${id}" not found`)
  }

  return user
}
