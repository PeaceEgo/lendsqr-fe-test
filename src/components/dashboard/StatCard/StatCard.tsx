import './StatCard.scss'

interface StatCardProps {
  label: string
  value: string
  iconSrc: string
  iconBg: string
}

export function StatCard({ label, value, iconSrc, iconBg }: StatCardProps) {
  return (
    <article className="stat-card">
      <span className="stat-card__icon-wrap" style={{ backgroundColor: iconBg }}>
        <img className="stat-card__icon" src={iconSrc} alt="" aria-hidden="true" />
      </span>
      <p className="stat-card__label">{label}</p>
      <p className="stat-card__value">{value}</p>
    </article>
  )
}
