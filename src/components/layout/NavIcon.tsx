import type { ReactNode } from 'react'

interface NavIconProps {
  name: string
  className?: string
}

const figmaIcons: Record<string, string> = {
  home: '/images/icon-home.png',
  users: '/images/icon-user-friends.png',
  organization: '/images/icon-briefcase.png',
  briefcase: '/images/icon-briefcase.png',
}

export function NavIcon({ name, className = '' }: NavIconProps) {
  const figmaSrc = figmaIcons[name]

  if (figmaSrc) {
    return (
      <img
        className={className}
        src={figmaSrc}
        alt=""
        width={20}
        height={20}
        aria-hidden="true"
      />
    )
  }

  const icons: Record<string, ReactNode> = {
    guarantors: (
      <path
        d="M12 3l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4l2-4z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
      />
    ),
    loans: (
      <path
        d="M4 7h16M6 7V5a2 2 0 012-2h8a2 2 0 012 2v2M6 11h12v8a2 2 0 01-2 2H8a2 2 0 01-2-2v-8z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
      />
    ),
    decision: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </>
    ),
    savings: (
      <path
        d="M12 3v18M8 7c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    ),
    'loan-requests': (
      <path
        d="M5 5h14v14H5zM9 9h6M9 13h4"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    ),
    whitelist: (
      <path
        d="M9 12l2 2 4-4M12 3l2.4 4.8L20 9l-4 3.9.9 5.5L12 16.8 7.1 18.4 8 12.9 4 9l5.6-1.2L12 3z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
      />
    ),
    karma: (
      <path
        d="M12 2l3 6 6 .9-4.5 4.3 1 6L12 16.5 6.5 19.2l1-6L3 8.9 9 8l3-6z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
      />
    ),
    'loan-products': (
      <path
        d="M6 4h12v16H6zM9 8h6M9 12h6M9 16h4"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    ),
    'savings-products': (
      <path
        d="M12 4v16M8 8h8M8 12h8M8 16h5"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    ),
    fees: (
      <path
        d="M12 3v18M7 8h10M7 12h7"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    ),
    transactions: (
      <path
        d="M4 7h16M4 12h10M4 17h14"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    ),
    services: (
      <path
        d="M8 12a4 4 0 108 0 4 4 0 00-8 0zM3 12h2M19 12h2M12 3v2M12 19v2"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    ),
    'service-account': (
      <path
        d="M6 6h12v12H6zM9 10h6M9 14h4"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    ),
    settlements: (
      <path
        d="M5 18h14M7 14l3-3 3 3 4-5"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    reports: (
      <path
        d="M6 18V8M10 18V5M14 18v-7M18 18v-10"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    ),
    preferences: (
      <path
        d="M12 8a4 4 0 100 8 4 4 0 000-8zM4 12h1M19 12h1M12 4v1M12 19v1"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    ),
    'fees-pricing': (
      <path
        d="M7 7h10v10H7zM10 10h4M10 14h2"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    ),
    audit: (
      <path
        d="M6 4h12v16H6zM9 8h6M9 12h6M9 16h4"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    ),
    messages: (
      <path
        d="M4 6h16v10H8l-4 4V6z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
      />
    ),
    logout: (
      <path
        d="M9 6H5a2 2 0 00-2 2v10a2 2 0 002 2h4M13 16l4-4-4-4M17 12H9"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  }

  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  )
}
