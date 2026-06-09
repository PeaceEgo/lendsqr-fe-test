import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DetailsSkeleton } from '../../components/ui/DetailsSkeleton'
import { EmptyState } from '../../components/ui/EmptyState'
import { ErrorState } from '../../components/ui/ErrorState'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { useUser } from '../../hooks/useUser'
import { useUsersDataStore } from '../../store/useUsersDataStore'
import type { User, UserStatus } from '../../types/user.types'
import { GeneralDetailsContent } from './UserDetailsSections'
import './UserDetails.scss'

const tabs = [
  'General Details',
  'Documents',
  'Bank Details',
  'Loans',
  'Savings',
  'App and System',
] as const

type Tab = (typeof tabs)[number]

function PersonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="44"
      height="44"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 12.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM4.5 20.5a7.5 7.5 0 0 1 15 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function UserAvatar({ src, name }: { src?: string; name: string }) {
  const [hasError, setHasError] = useState(false)

  if (!src || hasError) {
    return (
      <div
        className="user-details__avatar user-details__avatar--placeholder"
        role="img"
        aria-label={name}
      >
        <PersonIcon />
      </div>
    )
  }

  return (
    <img
      className="user-details__avatar"
      src={src}
      alt={name}
      onError={() => setHasError(true)}
    />
  )
}

function TierStars({ tier }: { tier: number }) {
  return (
    <div className="user-details__tier">
      <p className="user-details__meta-label">User&apos;s Tier</p>
      <div className="user-details__stars" aria-label={`Tier ${tier} of 3`}>
        {Array.from({ length: 3 }).map((_, index) => (
          <span
            key={index}
            className={
              index < tier
                ? 'user-details__star user-details__star--filled'
                : 'user-details__star'
            }
            aria-hidden="true"
          >
            {index < tier ? '★' : '☆'}
          </span>
        ))}
      </div>
    </div>
  )
}

function getAccountMeta(user: User) {
  const numericId = Number.parseInt(user.id.replace(/\D/g, ''), 10) || 1
  const balance = 150000 + numericId * 1000

  return {
    tier: (numericId % 3) + 1,
    balance: `₦${balance.toLocaleString()}.00`,
    account: `${9900000000 + numericId}/Providus Bank`,
  }
}

export function UserDetails() {
  const { id = '' } = useParams<{ id: string }>()
  const { user, loading, error, retry } = useUser(id)
  const statusOverrides = useUsersDataStore((state) => state.statusOverrides)
  const updateUserStatus = useUsersDataStore((state) => state.updateUserStatus)
  const [activeTab, setActiveTab] = useState<Tab>('General Details')
  const [actionMessage, setActionMessage] = useState<string | null>(null)

  useEffect(() => {
    document.title = user
      ? `${user.full_name} | Lendsqr`
      : 'User Details | Lendsqr'
  }, [user])

  useEffect(() => {
    if (!actionMessage) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      setActionMessage(null)
    }, 3000)

    return () => {
      window.clearTimeout(timer)
    }
  }, [actionMessage])

  const handleStatusChange = (status: UserStatus, message: string) => {
    if (!user) {
      return
    }

    updateUserStatus(user.id, status)
    setActionMessage(message)
  }

  if (loading && !user) {
    return (
      <div className="user-details">
        <DetailsSkeleton />
      </div>
    )
  }

  if (error && !user) {
    return (
      <div className="user-details">
        <ErrorState message={error} onRetry={retry} />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="user-details">
        <EmptyState
          title="User not found"
          message="The user you are looking for does not exist or may have been removed."
        />
      </div>
    )
  }

  const accountMeta = getAccountMeta(user)
  const currentStatus = statusOverrides[user.id] ?? user.status
  const isBlacklisted = currentStatus === 'Blacklisted'
  const isActive = currentStatus === 'Active'

  return (
    <div className="user-details">
      <Link to="/users" className="user-details__back">
        <img
          className="user-details__back-icon"
          src="/images/icon-back-users.png"
          alt=""
          aria-hidden="true"
          width={30}
          height={30}
        />
        Back to Users
      </Link>

      <div className="user-details__header">
        <h1 className="user-details__title">User Details</h1>
        <div className="user-details__actions">
          <button
            type="button"
            className="user-details__action user-details__action--blacklist"
            disabled={isBlacklisted}
            aria-disabled={isBlacklisted}
            onClick={() =>
              handleStatusChange('Blacklisted', 'User has been blacklisted.')
            }
          >
            Blacklist User
          </button>
          <button
            type="button"
            className="user-details__action user-details__action--activate"
            disabled={isActive}
            aria-disabled={isActive}
            onClick={() =>
              handleStatusChange('Active', 'User has been activated.')
            }
          >
            Activate User
          </button>
        </div>
      </div>

      {actionMessage && (
        <p className="user-details__action-feedback" role="status">
          {actionMessage}
        </p>
      )}

      <div className="user-details__summary-card">
        <div className="user-details__summary-top">
          <div className="user-details__identity">
            <UserAvatar src={user.avatar} name={user.full_name} />
            <div>
              <p className="user-details__name">{user.full_name}</p>
              <p className="user-details__id">{user.id}</p>
              <StatusBadge status={currentStatus} />
            </div>
          </div>

          <TierStars tier={accountMeta.tier} />

          <div className="user-details__account">
            <p className="user-details__meta-label">{accountMeta.balance}</p>
            <p className="user-details__account-number">
              {accountMeta.account}
            </p>
          </div>
        </div>

        <nav className="user-details__tabs" aria-label="User detail sections">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`user-details__tab ${
                activeTab === tab ? 'user-details__tab--active' : ''
              }`}
              onClick={() => setActiveTab(tab)}
              aria-current={activeTab === tab ? 'page' : undefined}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="user-details__content-card">
        {activeTab === 'General Details' ? (
          <GeneralDetailsContent user={{ ...user, status: currentStatus }} />
        ) : (
          <EmptyState
            title={`No ${activeTab.toLowerCase()} yet`}
            message="This section will be populated when data is available."
          />
        )}
      </div>
    </div>
  )
}
