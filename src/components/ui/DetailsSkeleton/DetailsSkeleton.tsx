import './DetailsSkeleton.scss'

export function DetailsSkeleton() {
  return (
    <div className="details-skeleton" aria-busy="true" aria-label="Loading details">
      <div className="details-skeleton__line details-skeleton__line--back" />
      <div className="details-skeleton__line details-skeleton__line--title" />
      <div className="details-skeleton__card">
        <div className="details-skeleton__profile">
          <div className="details-skeleton__line details-skeleton__line--avatar" />
          <div style={{ flex: 1 }}>
            <div className="details-skeleton__line" />
            <div className="details-skeleton__line details-skeleton__line--short" />
          </div>
        </div>
        <div className="details-skeleton__grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="details-skeleton__line" />
          ))}
        </div>
      </div>
    </div>
  )
}
