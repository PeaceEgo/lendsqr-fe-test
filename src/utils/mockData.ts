import type { User, UsersQueryParams, UserStatus } from '../types/user.types'

const ORGANIZATIONS = ['Lendsqr', 'Irorun', 'Paystack', 'Flutterwave']
const STATUSES: UserStatus[] = ['Active', 'Inactive', 'Pending', 'Blacklisted']
const FIRST_NAMES = [
  'Adedeji',
  'Grace',
  'Tosin',
  'Chinedu',
  'Fatima',
  'Emeka',
  'Aisha',
  'Kunle',
]
const LAST_NAMES = [
  'Ogunleye',
  'Effiom',
  'Danjuma',
  'Okonkwo',
  'Bello',
  'Nwosu',
  'Yusuf',
  'Adeyemi',
]

function padId(num: number): string {
  return `LSQ${String(num).padStart(3, '0')}`
}

function createUser(index: number): User {
  const firstName = FIRST_NAMES[index % FIRST_NAMES.length]
  const lastName = LAST_NAMES[index % LAST_NAMES.length]
  const username = `${firstName.toLowerCase()}_${index}`

  return {
    id: padId(index + 1),
    organization: ORGANIZATIONS[index % ORGANIZATIONS.length],
    username,
    email: `${username}@example.com`,
    phone_number: `080${String(10000000 + index).slice(0, 8)}`,
    date_joined: new Date(2020 + (index % 5), index % 12, (index % 28) + 1)
      .toISOString()
      .split('T')[0],
    status: STATUSES[index % STATUSES.length],
    avatar: `https://i.pravatar.cc/150?u=${index}`,
    full_name: `${firstName} ${lastName}`,
    bvn: String(22000000000 + index),
    gender: index % 2 === 0 ? 'Male' : 'Female',
    marital_status: index % 3 === 0 ? 'Single' : 'Married',
    children: String(index % 4),
    type_of_residence: "Parent's Apartment",
    level_of_education: 'B.Sc',
    employment_status: 'Employed',
    sector_of_employment: 'FinTech',
    duration_of_employment: '2 years',
    office_email: `${username}@company.com`,
    monthly_income: `₦${(150000 + index * 1000).toLocaleString()}.00`,
    loan_repayment: `₦${(40000 + index * 500).toLocaleString()}.00`,
    socials: {
      twitter: `@${username}`,
      facebook: username,
      instagram: `@${username}`,
    },
    guarantors: [
      {
        full_name: `${LAST_NAMES[(index + 1) % LAST_NAMES.length]} ${FIRST_NAMES[(index + 2) % FIRST_NAMES.length]}`,
        phone_number: `070${String(60780922 + index).slice(0, 8)}`,
        email_address: `guarantor_${username}@example.com`,
        relationship: index % 2 === 0 ? 'Sister' : 'Friend',
      },
      {
        full_name: `${LAST_NAMES[(index + 2) % LAST_NAMES.length]} ${FIRST_NAMES[(index + 3) % FIRST_NAMES.length]}`,
        phone_number: `070${String(60780922 + index + 1).slice(0, 8)}`,
        email_address: `guarantor2_${username}@example.com`,
        relationship: index % 2 === 0 ? 'Brother' : 'Colleague',
      },
    ],
  }
}

export const mockUsers: User[] = Array.from({ length: 500 }, (_, index) =>
  createUser(index),
)

export function getMockUserById(id: string): User | undefined {
  return mockUsers.find((user) => user.id === id)
}

export function getMockUsersPage(
  page: number,
  limit: number,
  filters: Omit<UsersQueryParams, 'page' | 'limit'> = {},
): { data: User[]; total: number } {
  let filtered = mockUsers
  const {
    search,
    status,
    organization,
    username,
    email,
    dateJoined,
    phoneNumber,
  } = filters

  if (search) {
    const query = search.toLowerCase()
    filtered = filtered.filter(
      (user) =>
        user.full_name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.organization.toLowerCase().includes(query),
    )
  }

  if (status) {
    filtered = filtered.filter((user) => user.status === status)
  }

  if (organization) {
    const query = organization.toLowerCase()
    filtered = filtered.filter((user) =>
      user.organization.toLowerCase().includes(query),
    )
  }

  if (username) {
    const query = username.toLowerCase()
    filtered = filtered.filter((user) =>
      user.username.toLowerCase().includes(query),
    )
  }

  if (email) {
    const query = email.toLowerCase()
    filtered = filtered.filter((user) =>
      user.email.toLowerCase().includes(query),
    )
  }

  if (dateJoined) {
    filtered = filtered.filter((user) => user.date_joined === dateJoined)
  }

  if (phoneNumber) {
    const query = phoneNumber.toLowerCase()
    filtered = filtered.filter((user) =>
      user.phone_number.toLowerCase().includes(query),
    )
  }

  const start = (page - 1) * limit
  const data = filtered.slice(start, start + limit)

  return { data, total: filtered.length }
}
