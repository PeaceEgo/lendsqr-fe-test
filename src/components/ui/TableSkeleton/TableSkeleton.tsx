import './TableSkeleton.scss'

interface TableSkeletonProps {
  rows?: number
}

export function TableSkeleton({ rows = 8 }: TableSkeletonProps) {
  return (
    <div className="table-skeleton" aria-busy="true" aria-label="Loading table data">
      <div className="table-skeleton__row table-skeleton__row--head">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="table-skeleton__cell table-skeleton__cell--short" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="table-skeleton__row">
          <div className="table-skeleton__cell" />
          <div className="table-skeleton__cell table-skeleton__cell--short" />
          <div className="table-skeleton__cell" />
          <div className="table-skeleton__cell" />
          <div className="table-skeleton__cell table-skeleton__cell--short" />
          <div className="table-skeleton__cell table-skeleton__cell--badge" />
          <div className="table-skeleton__cell table-skeleton__cell--dot" />
        </div>
      ))}
    </div>
  )
}
