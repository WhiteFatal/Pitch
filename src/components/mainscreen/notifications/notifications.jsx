import { useState, useMemo } from 'react'
import { updateDoc, writeBatch, doc } from 'firebase/firestore'
import { db } from '../../../firebase'
import { formatTime } from '../../../utils'
import './notifications.css'

const PREFS_CONFIG = [
  { key: 'cancelled', label: 'Game cancelled',   desc: 'Alert when a game you joined gets cancelled' },
  { key: 'new_game',  label: 'New game created',  desc: 'Alert when admin schedules a new game slot' },
  { key: 'withdraw',  label: 'Player withdraws',  desc: 'Alert when someone leaves a game you\'re in' },
  { key: 'full',      label: 'Game is full',       desc: 'Alert when all spots in a game are taken' },
]

const INITIAL_PREFS = { cancelled: true, new_game: true, withdraw: false, full: false }

// Map notification type to icon and background
function iconForType(type) {
  if (type === 'game_cancelled')  return { icon: '🚫', bg: 'rgba(255,77,77,0.1)' }
  if (type === 'game_full')       return { icon: '👥', bg: 'rgba(74,222,128,0.1)' }
  if (type === 'new_game')        return { icon: '⚽', bg: 'rgba(200,242,90,0.1)' }
  if (type === 'player_withdrew') return { icon: '↩',  bg: 'rgba(251,146,60,0.1)' }
  return                                 { icon: '🔔', bg: 'rgba(200,242,90,0.1)' }
}

// Build human-readable title and description from notification data
function textForNotif(n) {
  if (n.type === 'game_cancelled') return {
    title: `${n.gameTime} game on ${n.gameDate} was cancelled`,
    desc:  `The game on ${n.gameDate} at ${n.gameTime} has been cancelled.`,
  }
  if (n.type === 'new_game') return {
    title: `New game on ${n.gameDate} at ${n.gameTime}`,
    desc:  `A new game has been scheduled on ${n.gameDate} at ${n.gameTime}. Reserve your spot!`,
  }
  if (n.type === 'player_withdrew') return {
    title: `A player left the ${n.gameTime} game on ${n.gameDate}`,
    desc:  `Player withdrew from the game on ${n.gameDate} at ${n.gameTime}. A spot has opened up!`,
  }
  if (n.type === 'game_full') return {
    title: `${n.gameTime} game on ${n.gameDate} is now full`,
    desc:  `Game of ${n.gameDate} at ${n.gameTime} is full, no more empty spots!`,
  }
  return { title: 'Notification', desc: '' }
}

export default function NotificationsScreen({ active, notifications, onMarkRead, onMarkAllRead }) {
  const [prefs, setPrefs] = useState(INITIAL_PREFS)
  const [threshold] = useState(() => Date.now() - 7 * 24 * 60 * 60 * 1000);

  // Mark a single notification as read in Firestore, then update parent state
  async function markRead(id) {
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true })
      onMarkRead(id)
    } catch (err) {
      console.error('Error marking read:', err)
    }
  }

  // Mark all unread as read in Firestore in one batch, then update parent state
  async function markAllRead() {
    const unread = notifications.filter(n => !n.read)
    if (!unread.length) return
    try {
      const batch = writeBatch(db)
      unread.forEach(n => batch.update(doc(db, 'notifications', n.id), { read: true }))
      await batch.commit()
      onMarkAllRead()
    } catch (err) {
      console.error('Error marking all read:', err)
    }
  }

  function togglePref(key) {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }))
    // TODO: persist prefs to Firestore (users/{uid}/prefs) when preference system is built
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const recentNotifs = useMemo(() => {
  return notifications.filter(n => (n.createdAt?.seconds * 1000 || 0) >= threshold);
}, [notifications, threshold]);

  return (
    <div className={`content screen ${active ? 'active' : ''}`} id="screen-notifs">

      <div className="page-header" style={{marginBottom: '28px'}}>
        <div>
          <div className="page-title">NOTIFICATIONS</div>
          <div className="page-subtitle">Your recent alerts &amp; preferences</div>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-ghost" onClick={markAllRead}>
            ✓ Mark all read ({unreadCount})
          </button>
        )}
      </div>

      <div className="section-label" style={{marginBottom: '14px'}}>Recent, last 7 days</div>

      <div className="notif-screen-list">
        {!notifications ? (
          <div style={{color: 'var(--muted)', fontSize: '13px', padding: '20px 0'}}>Loading...</div>
        ) : recentNotifs.length === 0 ? (
          <div style={{color: 'var(--muted)', fontSize: '13px', padding: '20px 0'}}>No notifications in the last 7 days.</div>
        ) : (
          recentNotifs.map(n => {
            const { icon, bg }    = iconForType(n.type)
            const { title, desc } = textForNotif(n)
            return (
              <div
                key={n.id}
                className={`notif-screen-item ${!n.read ? 'unread' : ''}`}
                onClick={() => !n.read && markRead(n.id)}
                style={!n.read ? {cursor: 'pointer'} : {}}
              >
                <div className="notif-icon-wrap" style={{background: bg}}>{icon}</div>
                <div className="notif-body">
                  <div className="notif-title">{title}</div>
                  <div className="notif-desc">{desc}</div>
                  <div className="notif-ts">{formatTime(n.createdAt)}</div>
                </div>
                {!n.read && <div className="notif-unread-dot"></div>}
              </div>
            )
          })
        )}
      </div>

      <div className="notif-settings-card" style={{opacity: 0.5, pointerEvents: 'none'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px'}}>
          <div className="notif-settings-title" style={{marginBottom: 0}}>Notification Preferences</div>
          <span style={{fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: '999px', padding: '3px 10px'}}>Coming Soon</span>
        </div>
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
