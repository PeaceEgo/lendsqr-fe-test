import type { CSSProperties, RefObject } from 'react'
import { useUsersListStore } from '../../../store/useUsersListStore'
import { DatePicker } from '../../ui/DatePicker'
import { FILTER_STATUSES } from './usersTable.constants'
import { CloseIcon } from './UsersTableIcons'

interface UsersFilterPanelProps {
  isOpen: boolean
  isMobile: boolean
  panelStyle: CSSProperties
  panelRef: RefObject<HTMLDivElement | null>
  organizations: string[]
  onClose: () => void
  onApply: () => void
  onReset: () => void
}

function FilterDateField() {
  const value = useUsersListStore((state) => state.userFilterDraft.dateJoined)
  const setUserFilterDraft = useUsersListStore(
    (state) => state.setUserFilterDraft,
  )

  return (
    <label className="users-table__filter-field">
      <span>Date</span>
      <DatePicker
        value={value}
        placeholder="Date"
        onChange={(nextValue) => setUserFilterDraft('dateJoined', nextValue)}
      />
    </label>
  )
}

function FilterField({
  label,
  field,
  placeholder,
  type = 'text',
}: {
  label: string
  field: 'username' | 'email' | 'phoneNumber'
  placeholder: string
  type?: string
}) {
  const value = useUsersListStore((state) => state.userFilterDraft[field])
  const setUserFilterDraft = useUsersListStore(
    (state) => state.setUserFilterDraft,
  )

  return (
    <label className="users-table__filter-field">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => setUserFilterDraft(field, event.target.value)}
      />
    </label>
  )
}

export function UsersFilterPanel({
  isOpen,
  isMobile,
  panelStyle,
  panelRef,
  organizations,
  onClose,
  onApply,
  onReset,
}: UsersFilterPanelProps) {
  const filterDraft = useUsersListStore((state) => state.userFilterDraft)
  const setUserFilterDraft = useUsersListStore(
    (state) => state.setUserFilterDraft,
  )

  if (!isOpen) {
    return null
  }

  return (
    <>
      {isMobile && (
        <button
          type="button"
          className="users-table__filter-backdrop"
          aria-label="Close filter panel"
          onClick={onClose}
        />
      )}

      <div
        id="users-filter-panel"
        ref={panelRef}
        className="users-table__filter-panel"
        style={isMobile ? undefined : panelStyle}
      >
        <div className="users-table__filter-panel-header">
          <h2 className="users-table__filter-panel-title">Filter Users</h2>
          <button
            type="button"
            className="users-table__filter-panel-close"
            aria-label="Close filter panel"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>

        <label className="users-table__filter-field">
          <span>Organization</span>
          <select
            value={filterDraft.organization}
            onChange={(event) =>
              setUserFilterDraft('organization', event.target.value)
            }
          >
            <option value="">Select</option>
            {organizations.map((organization) => (
              <option key={organization} value={organization}>
                {organization}
              </option>
            ))}
          </select>
        </label>

        <FilterField label="Username" field="username" placeholder="User" />
        <FilterField
          label="Email"
          field="email"
          placeholder="Email"
          type="email"
        />
        <FilterDateField />
        <FilterField
          label="Phone Number"
          field="phoneNumber"
          placeholder="Phone Number"
        />

        <label className="users-table__filter-field">
          <span>Status</span>
          <select
            value={filterDraft.status}
            onChange={(event) =>
              setUserFilterDraft('status', event.target.value)
            }
          >
            <option value="">Select</option>
            {FILTER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <div className="users-table__filter-actions">
          <button
            type="button"
            className="users-table__filter-reset"
            onClick={onReset}
          >
            Reset
          </button>
          <button
            type="button"
            className="users-table__filter-submit"
            onClick={onApply}
          >
            Filter
          </button>
        </div>
      </div>
    </>
  )
}
