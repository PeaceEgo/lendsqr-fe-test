import { Link } from 'react-router-dom'
import { DropdownIcon } from '../icons/DropdownIcon'
import { LendsqrLogo } from './LendsqrLogo'
import './Header.scss'

interface HeaderProps {
  onMenuToggle: () => void
}

export function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header className="header">
      <div className="header__left">
        <button
          type="button"
          className="header__menu-btn"
          onClick={onMenuToggle}
          aria-label="Toggle navigation menu"
        >
          <svg className="header__menu-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <Link to="/dashboard" className="header__logo" aria-label="Lendsqr home">
          <LendsqrLogo />
        </Link>
      </div>

      <div className="header__center">
        <form className="header__search" role="search" onSubmit={(e) => e.preventDefault()}>
          <input
            className="header__search-input"
            type="search"
            placeholder="Search for anything"
            aria-label="Search for anything"
          />
          <button type="submit" className="header__search-btn" aria-label="Search">
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <circle
                cx="11"
                cy="11"
                r="7"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M20 20l-3.5-3.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </form>
      </div>

      <div className="header__right">
        <a
          href="https://docs.google.com/document/d/e/2PACX-1vQ5YKfvm86OxmpiboMOpLO1V7RmKNYJX87W9zWME6Y647gywVHVEayaMRznCc6vLO95mPKD5WunVSi2/pub"
          className="header__docs"
          target="_blank"
          rel="noopener noreferrer"
        >
          Docs
        </a>

        <button type="button" className="header__bell-btn" aria-label="Notifications">
          <img
            className="header__bell-icon"
            src="/images/icon-notification.png"
            alt=""
            aria-hidden="true"
          />
        </button>

        <button type="button" className="header__profile" aria-label="User menu">
          <img className="header__avatar" src="/images/avatar.png" alt="Adedeji" />
          <span className="header__profile-name">Adedeji</span>
          <DropdownIcon className="header__caret" size={16} />
        </button>
      </div>
    </header>
  )
}
