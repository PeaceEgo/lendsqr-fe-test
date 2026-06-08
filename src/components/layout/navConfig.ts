export interface NavItem {
  label: string
  path?: string
  icon: string
}

export interface NavSection {
  label: string
  items: NavItem[]
}

export const standaloneNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: 'home' },
]

export const navSections: NavSection[] = [
  {
    label: 'Customers',
    items: [
      { label: 'Users', path: '/users', icon: 'users' },
      { label: 'Guarantors', icon: 'guarantors' },
      { label: 'Loans', icon: 'loans' },
      { label: 'Decision Models', icon: 'decision' },
      { label: 'Savings', icon: 'savings' },
      { label: 'Loan Requests', icon: 'loan-requests' },
      { label: 'Whitelist', icon: 'whitelist' },
      { label: 'Karma', icon: 'karma' },
    ],
  },
  {
    label: 'Businesses',
    items: [
      { label: 'Organization', icon: 'organization' },
      { label: 'Loan Products', icon: 'loan-products' },
      { label: 'Savings Products', icon: 'savings-products' },
      { label: 'Fees and Charges', icon: 'fees' },
      { label: 'Transactions', icon: 'transactions' },
      { label: 'Services', icon: 'services' },
      { label: 'Service Account', icon: 'service-account' },
      { label: 'Settlements', icon: 'settlements' },
      { label: 'Reports', icon: 'reports' },
    ],
  },
  {
    label: 'Settings',
    items: [
      { label: 'Preferences', icon: 'preferences' },
      { label: 'Fees and Pricing', icon: 'fees-pricing' },
      { label: 'Audit Logs', icon: 'audit' },
      { label: 'Systems Messages', icon: 'messages' },
    ],
  },
]
