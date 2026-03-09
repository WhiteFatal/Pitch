import { useState } from 'react'
import './notifications.css'

// TODO: load and save notification preferences from Firebase when connected
const INITIAL_PREFS = {
  new_game:  true,
  cancelled: true,
  withdraw:  false,
  full:      true,
}

// TODO: replace with real notifications fetched from Firebase
const NOTIFICATIONS = [
  {
    id: 1,
    icon: '⚽',
    iconBg: 'rgba(200,242,90,0.1)',
    title: 'New game created — 06:00 on 03 March',
    desc: 'A new 6-a-side game was scheduled on Pitch A. 18 spots available.',
    time: '2 minutes ago',
    unread: true,
  },
  {
    id: 2,
    icon: '👥',
    iconBg: 'rgba(74,222,128,0.1)',
    title: '12:00 game is now full',
    desc: 'All 18 spots on Pitch A have been reserved.',
    time: 'Yesterday, 11:45',
    unread: false,
  },
  {
    id: 3,
    icon: '🚫',
    iconBg: 'rgba(251,146,60,0.1)',
    title: '18:00 game was cancelled',
    desc: 'The Pitch C game on 02 March has been cancelled by the admin.',
    time: 'Yesterday, 16:20',
    unread: false,
  },
  {
    id: 4,
    icon: '🚫',
    iconBg: 'rgba(255,77,77,0.1)',
    title: 'Tom L. withdrew from your game',
    desc: '1 spot opened up in the 06:00 game — Team A now has a free slot.',
    time: '2 days ago',
    unread: false,
  },
]

const PREFS_CONFIG = [
  { key: 'new_game',  label: 'New game created', desc: 'Alert when admin schedules a new game slot' },
  { key: 'cancelled', label: 'Game cancelled',   desc: 'Alert when a game you joined gets cancelled' },
  { key: 'withdraw',  label: 'Player withdraws', desc: 'Alert when someone leaves a game you\'re in' },
  { key: 'full',      label: 'Game is full',      desc: 'Alert when all spots in a game are taken' },
]

export default function NotificationsScreen({ active }) {
  const [prefs, setPrefs] = useState(INITIAL_PREFS)

  function togglePref(key) {
    setPrefs(prev => {
      const updated = { ...prev, [key]: !prev[key] }
      // TODO: save updated prefs to Firebase when connected
      return updated
    })
  }

  return (
    <div className={`content screen ${active ? 'active' : ''}`} id="screen-notifs">

      <div className="page-header" style={{marginBottom: '28px'}}>
        <div>
          <div className="page-title">NOTIFICATIONS</div>
          <div className="page-subtitle">Your recent alerts &amp; preferences</div>
        </div>
      </div>

      <div className="section-label" style={{marginBottom: '14px'}}>Recent</div>
      <div className="notif-screen-list">
        {NOTIFICATIONS.map(n => (
          <div key={n.id} className={`notif-screen-item ${n.unread ? 'unread' : ''}`}>
            <div className="notif-icon-wrap" style={{background: n.iconBg}}>{n.icon}</div>
            <div className="notif-body">
              <div className="notif-title">{n.title}</div>
              <div className="notif-desc">{n.desc}</div>
              <div className="notif-ts">{n.time}</div>
            </div>
            {n.unread && <div className="notif-unread-dot"></div>}
          </div>
        ))}
      </div>

      <div className="notif-settings-card">
        <div className="notif-settings-title">Notification Preferences</div>
        {PREFS_CONFIG.map(pref => (
          <div key={pref.key} className="toggle-row">
            <div className="toggle-info">
              <div className="toggle-label">{pref.label}</div>
              <div className="toggle-desc">{pref.desc}</div>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={prefs[pref.key]}
                onChange={() => togglePref(pref.key)}
              />
              <div className="toggle-track"></div>
              <div className="toggle-thumb"></div>
            </label>
          </div>
        ))}
      </div>

    </div>
  )
}
