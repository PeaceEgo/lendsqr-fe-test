export type UserStatus = 'Active' | 'Inactive' | 'Pending' | 'Blacklisted'

export interface User {
  id: string
  organization: string
  username: string
  email: string
  phone_number: string
  date_joined: string
  status: UserStatus
  avatar: string
  full_name: string
  bvn: string
  gender: string
  marital_status: string
  children: string
  type_of_residence: string
  level_of_education: string
  employment_status: string
  sector_of_employment: string
  duration_of_employment: string
  office_email: string
  monthly_income: string
  loan_repayment: string
  socials: {
    twitter: string
    facebook: string
    instagram: string
  }
  guarantors: [Guarantor, Guarantor]
}

export interface Guarantor {
  full_name: string
  phone_number: string
  email_address: string
  relationship: string
}

export interface PaginatedUsersResponse {
  data: User[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface UsersQueryParams {
  page?: number
  limit?: number
  search?: string
  status?: UserStatus
  organization?: string
  username?: string
  email?: string
  dateJoined?: string
  phoneNumber?: string
}
