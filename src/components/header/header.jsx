import { useState, useEffect } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase'
import './header.css'

function getInitials(displayName) {
  if (!displayName) return '?'
  const parts = displayName.trim().split(' ')
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function getFirstName(displayName) {
  if (!displayName) return 'Player'
  return displayName.trim().split(' ')[0]
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function Header({ activeScreen, onNavigate, user, hasUnread }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const initials    = getInitials(user?.displayName)
  const firstName   = getFirstName(user?.displayName)
  const fullName    = user?.displayName || 'Player'
  const email       = user?.email || ''
  const photoURL    = user?.photoURL || null

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (!e.target.closest('.user-menu')) setMenuOpen(false)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  async function handleSignOut() {
    setMenuOpen(false)
    await signOut(auth)
    // onAuthStateChanged in App.jsx will detect sign out and show Login screen
  }

  return (
    <div className="topbar">

      {/* ── MOBILE ROW ── */}
      <div className="topbar-row">
        <div className="mobile-logo">PITCH</div>

        <div className="topbar-greeting">
          {getGreeting()}, <strong>{firstName}</strong> 👋
        </div>

        {/* Mobile Nav Icons */}
        <div className="mobile-nav">
          <div
            className={`mobile-nav-icon ${activeScreen === 'games' ? 'active' : ''}`}
            onClick={() => onNavigate('games')}
          >⚽</div>

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
          >🏆</div>

          <div
            className={`mobile-nav-icon ${activeScreen === 'notifs' ? 'active' : ''}`}
            style={{ position: 'relative' }}
            onClick={() => onNavigate('notifs')}
          >
            🔔
            {hasUnread && <div className="notif-dot"></div>}
          </div>
        </div>

        {/* User Menu */}
        <div className={`user-menu ${menuOpen ? 'open' : ''}`}>
          <div className="user-btn" onClick={() => setMenuOpen(prev => !prev)}>
            {photoURL
              ? <img src={photoURL} className="user-avatar user-avatar-photo" alt={fullName} />
              : <div className="user-avatar">{initials}</div>
            }
            <span className="user-name">{firstName}</span>
            <span className="user-chevron">▾</span>
          </div>

          <div className="user-dropdown">
            <div className="dropdown-header">
              {photoURL
                ? <img src={photoURL} className="dropdown-avatar dropdown-avatar-photo" alt={fullName} />
                : <div className="dropdown-avatar">{initials}</div>
              }
              <div>
                <div className="dropdown-name">{fullName}</div>
                <div className="dropdown-email">{email}</div>
              </div>
            </div>
            <div className="dropdown-items">
              <div className="dropdown-item">
                <span className="dropdown-icon">⚙️</span> Settings
              </div>
              <div className="dropdown-item danger" onClick={handleSignOut}>
                <span className="dropdown-icon">↩</span> Log Out
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
