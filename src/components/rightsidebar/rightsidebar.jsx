import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase'
import './rightsidebar.css'
import { displayName, formatTime } from '../../utils'

const GRADIENTS = [
  'linear-gradient(135deg,#f5c518,#ef4444)',
  'linear-gradient(135deg,#10b981,#3b82f6)',
  'linear-gradient(135deg,#ec4899,#8b5cf6)',
  'linear-gradient(135deg,#f59e0b,#ef4444)',
  'linear-gradient(135deg,#4d9fff,#a855f7)',
  'linear-gradient(135deg,#6366f1,#ec4899)',
  'linear-gradient(135deg,#10b981,#f59e0b)',
  'linear-gradient(135deg,#f59e0b,#10b981)',
]

const RANK_CLASSES = ['gold', 'silver', 'bronze']

export default function RightSidebar({ user, notifications = [] }) {
  const [topPlayers, setTopPlayers] = useState([])
  const [you, setYou]               = useState(null)
  const [youRank, setYouRank]       = useState(null)

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const snap = await getDocs(collection(db, 'users'))
        const data = snap.docs.map((docSnap, i) => ({
          id:            docSnap.id,
          firstName:     docSnap.data().firstName     || '',
          nickname:      docSnap.data().nickname      || '',
          lastName:      docSnap.data().lastName      || '',
          starsReceived: docSnap.data().starsReceived || 0,
          gamesPlayed:   docSnap.data().gamesPlayed   || 0,
          grad:          GRADIENTS[i % GRADIENTS.length],
        }))

        data.sort((a, b) =>
          b.starsReceived !== a.starsReceived
            ? b.starsReceived - a.starsReceived
            : b.gamesPlayed - a.gamesPlayed
        )

        setTopPlayers(data.slice(0, 3))

        const youIndex = data.findIndex(p => p.id === user?.uid)
        if (youIndex !== -1) {
          setYou(data[youIndex])
          setYouRank(youIndex + 1)
        }
      } catch (err) {
        console.error('Error fetching top players:', err)
      }
    }

    fetchPlayers()
  }, [user?.uid])

  return (
    <aside className="panel right-panel" id="right-panel">

      {/*--- PITCH MAP CARD ---*/}
      <div className="panel-card">
        <div className="panel-card-title">🏟 Pitch Map</div>
        <div className="pitch">
          <div className="pitch-line"></div>
          <div className="pitch-goal left"></div>
          <div className="pitch-goal right"></div>
          <div className="pitch-center"></div>
          <div className="pitch-label">Pitch A &middot; 6-a-side</div>
        </div>
        <div className="map-container">
          <span className="dot-format"><span className="dot-color blue"></span>Open</span>
          <span className="dot-format"><span className="dot-color green"></span>Full</span>
          <span className="dot-format"><span className="dot-color red"></span>Cancelled</span>
        </div>
      </div>

      {/*--- TOP PLAYERS CARD ---*/}
      <div className="panel-card">
        <div className="panel-card-title">🏆 Top Players</div>
        <div className="rank-list">

          {topPlayers.map((p, i) => {
            const initials = ((p.firstName[0] || '') + (p.lastName[0] || '')).toUpperCase()
            const avg      = p.gamesPlayed > 0 ? (p.starsReceived / p.gamesPlayed).toFixed(1) : '0.0'
            return (
              <div key={p.id} className="rank-item">
                <div className={`rank-num ${RANK_CLASSES[i]}`}>{i + 1}</div>
                <div className="rank-avatar" style={{background: p.grad}}>{initials}</div>
                <div className="rank-info">
                  <div className="rank-name">{displayName(p.firstName, p.nickname, p.lastName)}</div>
                  <div className="rank-stat">
                    <span style={{color: 'var(--gold)', fontSize: '14px'}}>★</span>{' '}
                    <strong style={{color: 'var(--text)'}}>{p.starsReceived}</strong> &middot; {p.gamesPlayed} games &middot;{' '}
                    <span style={{color: 'var(--gold)'}}>{avg}★/g</span>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Current user row — only shown if not already in top 3 */}
          {you && youRank > 3 && (
            <div className="rank-item" style={{background: 'var(--accent-dim)', borderRadius: 'var(--rs)'}}>
              <div className="rank-num" style={{color: 'var(--accent)'}}>{youRank}</div>
              <div className="rank-avatar" style={{background: you.grad}}>
                {((you.firstName[0] || '') + (you.lastName[0] || '')).toUpperCase()}
              </div>
              <div className="rank-info">
                <div className="rank-name" style={{color: 'var(--accent)'}}>
                  {displayName(you.firstName, you.nickname, you.lastName)}
                </div>
                <div className="rank-stat">
                  <span style={{color: 'var(--gold)', fontSize: '14px'}}>★</span>{' '}
                  <strong style={{color: 'var(--text)'}}>{you.starsReceived}</strong> &middot; {you.gamesPlayed} games &middot;{' '}
                  <span style={{color: 'var(--gold)'}}>
                    {you.gamesPlayed > 0 ? (you.starsReceived / you.gamesPlayed).toFixed(1) : '0.0'}★/g
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/*--- NOTIFICATIONS CARD ---*/}
      <div className="panel-card">
        <div className="panel-card-title">🔔 Notifications</div>
        <div className="notif-list-panel">
          {notifications.length === 0 ? (
            <div style={{color: 'var(--muted)', fontSize: '13px'}}>No notifications yet.</div>
          ) : (
            notifications.slice(0, 3).map(n => {
              const icon  = n.type === 'game_cancelled'  ? '🚫'
                          : n.type === 'game_full'        ? '👥'
                          : n.type === 'player_withdrew'  ? '↩'
                          : '⚽'
              const color = n.type === 'game_cancelled'  ? 'var(--red)'
                          : n.type === 'game_full'        ? 'var(--green)'
                          : n.type === 'player_withdrew'  ? 'var(--orange)'
                          : 'var(--accent)'
              return (
                <div key={n.id} className="notif-item" style={{borderLeftColor: color, opacity: n.read ? .6 : 1}}>
                  <div>{icon} {n.gameTime} game &mdash; {n.gameDate} &middot; Pitch {n.gamePitch}</div>
                  <div className="notif-time">{formatTime(n.createdAt)}</div>
                </div>
              )
            })
          )}
        </div>
      </div>

    </aside>
  )
}
