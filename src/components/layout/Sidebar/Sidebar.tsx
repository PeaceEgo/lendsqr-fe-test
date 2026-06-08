import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ChevronDownIcon } from '../icons/ChevronDownIcon'
import { NavIcon } from '../NavIcon'
import { navSections, standaloneNavItems } from '../navConfig'
import { useUserStore } from '../../../store/useUserStore'
import './Sidebar.scss'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

function isUsersActive(pathname: string) {
  return pathname === '/users' || pathname.startsWith('/users/')
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const logout = useUserStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    navigate('/login')
    onClose()
  }

  const getLinkClass = (path?: string) => {
    return ({ isActive }: { isActive: boolean }) => {
      const active = path === '/users' ? isUsersActive(pathname) : isActive
      return `sidebar__link${active ? ' sidebar__link--active' : ''}`
    }
  }

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          onClick={onClose}
          aria-label="Close navigation menu"
        />
      )}

      <aside className={`sidebar${isOpen ? ' sidebar--open' : ''}`}>
        <button type="button" className="sidebar__org" aria-label="Switch organization">
          <NavIcon name="briefcase" className="sidebar__org-icon" />
          <span className="sidebar__org-label">Switch Organization</span>
          <ChevronDownIcon className="sidebar__org-caret" size={16} />
        </button>

        <nav className="sidebar__nav" aria-label="Main navigation">
          {standaloneNavItems.map((item) =>
            item.path ? (
              <NavLink
                key={item.label}
                to={item.path}
                className={getLinkClass(item.path)}
                onClick={onClose}
              >
                <NavIcon name={item.icon} className="sidebar__link-icon" />
                {item.label}
              </NavLink>
            ) : (
              <span key={item.label} className="sidebar__link">
                <NavIcon name={item.icon} className="sidebar__link-icon" />
                {item.label}
              </span>
            ),
          )}

          {navSections.map((section) => (
            <div key={section.label} className="sidebar__section">
              <p className="sidebar__section-label">{section.label}</p>
              {section.items.map((item) =>
                item.path ? (
                  <NavLink
                    key={item.label}
                    to={item.path}
                    className={getLinkClass(item.path)}
                    onClick={onClose}
                  >
                    <NavIcon name={item.icon} className="sidebar__link-icon" />
                    {item.label}
                  </NavLink>
                ) : (
                  <span key={item.label} className="sidebar__link">
                    <NavIcon name={item.icon} className="sidebar__link-icon" />
                    {item.label}
                  </span>
                ),
              )}
            </div>
          ))}
        </nav>

        <div className="sidebar__footer">
          <button type="button" className="sidebar__logout" onClick={handleLogout}>
            <NavIcon name="logout" className="sidebar__link-icon" />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
