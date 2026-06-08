import { useEffect } from 'react'
import { StatCard } from '../../components/dashboard/StatCard'
import { EmptyState } from '../../components/ui/EmptyState'
import { ErrorState } from '../../components/ui/ErrorState'
import { TableSkeleton } from '../../components/ui/TableSkeleton'
import { Pagination } from '../../components/users/Pagination'
import { UsersTable } from '../../components/users/UsersTable'
import { userStats } from '../../constants/userStats'
import { useUsers } from '../../hooks/useUsers'
import { useUsersListStore } from '../../store/useUsersListStore'
import './Users.scss'

export function Users() {
  const page = useUsersListStore((state) => state.page)
  const limit = useUsersListStore((state) => state.limit)
  const setPage = useUsersListStore((state) => state.setPage)
  const setLimit = useUsersListStore((state) => state.setLimit)
  const userFilters = useUsersListStore((state) => state.userFilters)
  const hasActiveFilters = Object.values(userFilters).some(Boolean)
  const { data, loading, error, retry } = useUsers({
    page,
    limit,
    organization: userFilters.organization || undefined,
    username: userFilters.username || undefined,
    email: userFilters.email || undefined,
    dateJoined: userFilters.dateJoined || undefined,
    phoneNumber: userFilters.phoneNumber || undefined,
    status: userFilters.status || undefined,
  })

  useEffect(() => {
    document.title = 'Users | Lendsqr'
  }, [])

  const showSkeleton = loading && !data
  const showResults = !loading && !error && data
  const showEmpty = showResults && data.data.length === 0
  const showPagination =
    showResults && data.data.length > 0 && data.totalPages > 0

  return (
    <div className="users-page">
      <h1 className="users-page__title">Users</h1>

      <div className="users-page__stats">
        {userStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {error ? (
        <div className="users-page__table-card">
          <ErrorState message={error} onRetry={retry} />
        </div>
      ) : showSkeleton ? (
        <div className="users-page__table-card">
          <TableSkeleton />
        </div>
      ) : showResults ? (
        <>
          <div className="users-page__table-card">
            <UsersTable users={data.data} />
            {showEmpty && (
              <EmptyState
                title="No users found"
                message={
                  hasActiveFilters
                    ? 'Reset your filters to restore the full list.'
                    : 'Try adjusting your filters or check back later.'
                }
              />
            )}
          </div>
          {showPagination && (
            <Pagination
              page={page}
              limit={limit}
              total={data.total}
              totalPages={data.totalPages}
              onPageChange={setPage}
              onLimitChange={setLimit}
            />
          )}
        </>
      ) : null}
    </div>
  )
}
