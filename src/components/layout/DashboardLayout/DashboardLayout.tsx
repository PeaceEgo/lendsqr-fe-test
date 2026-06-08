import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '../Header'
import { Sidebar } from '../Sidebar'
import './DashboardLayout.scss'

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => setSidebarOpen((prev) => !prev)
  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="dashboard-layout">
      <Header onMenuToggle={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <main className="dashboard-layout__main">
        <Outlet />
      </main>
    </div>
  )
}
