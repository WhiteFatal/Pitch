import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, updateDoc, writeBatch, doc } from 'firebase/firestore'
import { db } from '../../../firebase'
import './notifications.css'

const PREFS_CONFIG = [
  { key: 'cancelled', label: 'Game cancelled',   desc: 'Alert when a game you joined gets cancelled' },
  { key: 'new_game',  label: 'New game created',  desc: 'Alert when admin schedules a new game slot' },
  { key: 'withdraw',  label: 'Player withdraws',  desc: 'Alert when someone leaves a game you\'re in' },
  { key: 'full',      label: 'Game is full',       desc: 'Alert when all spots in a game are taken' },
]

const INITIAL_PREFS = { cancelled: true, new_game: true, withdraw: false, full: true }

// Format Firestore timestamp to relative or absolute string
function formatTime(ts) {
  if (!ts) return ''
  const date  = ts.toDate()
  const now   = new Date()
  const diffM = Math.floor((now - date) / 60000)
  if (diffM < 1)   return 'Just now'
  if (diffM < 60)  return `${diffM} minute${diffM > 1 ? 's' : ''} ago`
  const diffH = Math.floor(diffM / 60)
  if (diffH < 24)  return `${diffH} hour${diffH > 1 ? 's' : ''} ago`
  const diffD = Math.floor(diffH / 24)
  if (diffD === 1) return 'Yesterday'
  return `${diffD} days ago`
}

// Map notification type to icon and background
function iconForType(type) {
  if (type === 'game_cancelled') return { icon: '🚫', bg: 'rgba(255,77,77,0.1)' }
  if (type === 'game_full')      return { icon: '👥', bg: 'rgba(74,222,128,0.1)' }
  if (type === 'new_game')       return { icon: '⚽', bg: 'rgba(200,242,90,0.1)' }
  return                                { icon: '🔔', bg: 'rgba(200,242,90,0.1)' }
}

// Build human-readable title and description from notification data
function textForNotif(n) {
  if (n.type === 'game_cancelled') return {
    title: `${n.gameTime} game on ${n.gameDate} was cancelled`,
    desc:  `The game on Pitch ${n.gamePitch} has been cancelled.`,
  }
  return { title: 'Notification', desc: '' }
}

export default function NotificationsScreen({ active, user }) {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading]             = useState(true)
  const [prefs, setPrefs]                 = useState(INITIAL_PREFS)

  // Fetch notifications for current user, newest first
  useEffect(() => {
    if (!user?.uid) return

    async function fetchNotifications() {
      setLoading(true)
      console.log('[Notifs] fetching for uid:', user.uid)
      try {
        const q    = query(
          collection(db, 'notifications'),
          where('userId', '==', user.uid)
        )
        const snap = await getDocs(q)
        console.log('[Notifs] docs found:', snap.docs.length)
        snap.docs.forEach(d => console.log('[Notifs] doc:', d.id, d.data()))
        const docs = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
        setNotifications(docs)
      } catch (err) {
        console.error('[Notifs] Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [user?.uid])

  // Mark a single notification as read
  async function markRead(id) {
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true })
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      )
    } catch (err) {
      console.error('Error marking read:', err)
    }
  }

  // Mark all unread notifications as read in one batch
  async function markAllRead() {
    const unread = notifications.filter(n => !n.read)
    if (!unread.length) return
    try {
      const batch = writeBatch(db)
      unread.forEach(n => batch.update(doc(db, 'notifications', n.id), { read: true }))
      await batch.commit()
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    } catch (err) {
      console.error('Error marking all read:', err)
    }
  }

  function togglePref(key) {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }))
    // TODO: persist prefs to Firestore (users/{uid}/prefs) when preference system is built
  }

  const unreadCount = notifications.filter(n => !n.read).length

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

      <div className="section-label" style={{marginBottom: '14px'}}>Recent</div>

      <div className="notif-screen-list">
        {loading ? (
          <div style={{color: 'var(--muted)', fontSize: '13px', padding: '20px 0'}}>Loading...</div>
        ) : notifications.length === 0 ? (
          <div style={{color: 'var(--muted)', fontSize: '13px', padding: '20px 0'}}>No notifications yet.</div>
        ) : (
          notifications.map(n => {
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
