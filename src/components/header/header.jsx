import { useState, useEffect } from 'react'
import './header.css'

export default function Header({ activeScreen, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (!e.target.closest('.user-menu')) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <div className="topbar">

      {/* ── MOBILE ROW ── */}
      <div className="topbar-row">
        <div className="mobile-logo">PITCH</div>

        <div className="topbar-greeting">
          Good morning, <strong>Alex K.</strong> &#128075;
        </div>

        {/* Mobile Nav Icons */}
        <div className="mobile-nav">
          <div
            className={`mobile-nav-icon ${activeScreen === 'games' ? 'active' : ''}`}
            onClick={() => onNavigate('games')}
          >&#9917;</div>

          <div
            className={`mobile-nav-icon gold-icon ${activeScreen === 'profile' ? 'active' : ''}`}
            onClick={() => onNavigate('profile')}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
          </div>

          <div
            className={`mobile-nav-icon ${activeScreen === 'players' ? 'active' : ''}`}
            onClick={() => onNavigate('players')}
          >&#127942;</div>

          <div
            className={`mobile-nav-icon ${activeScreen === 'notifs' ? 'active' : ''}`}
            style={{ position: 'relative' }}
            onClick={() => onNavigate('notifs')}
          >
            &#128276;
            <div className="notif-dot"></div>
          </div>
        </div>

        {/* User Menu */}
        <div className={`user-menu ${menuOpen ? 'open' : ''}`}>
          <div className="user-btn" onClick={() => setMenuOpen(prev => !prev)}>
            <div className="user-avatar">AK</div>
            <span className="user-name">Alex K.</span>
            <span className="user-chevron">&#9660;</span>
          </div>
          <div className="user-dropdown">
            <div className="dropdown-header">
              <div className="dropdown-avatar">AK</div>
              <div>
                <div className="dropdown-name">Alex Kowalski</div>
                <div className="dropdown-email">alex@pitchup.ge</div>
              </div>
            </div>
            <div className="dropdown-items">
              <div className="dropdown-item">
                <span className="dropdown-icon">&#9881;&#65039;</span> Settings
              </div>
              <div className="dropdown-item danger">
                <span className="dropdown-icon">&#8617;</span> Log Out
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom border */}
      <div className="topbar-divider"></div>

    </div>
  )
}
