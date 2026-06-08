import { useEffect } from 'react'
import { StatCard } from '../../components/dashboard/StatCard'
import { userStats } from '../../constants/userStats'
import './Dashboard.scss'

export function Dashboard() {
  useEffect(() => {
    document.title = 'Dashboard | Lendsqr'
  }, [])

  return (
    <div className="dashboard">
      <div className="dashboard__welcome">
        <p className="dashboard__welcome-text">Welcome back, Adedeji 👋</p>
      </div>

      <div className="dashboard__stats">
        {userStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </div>
  )
}
