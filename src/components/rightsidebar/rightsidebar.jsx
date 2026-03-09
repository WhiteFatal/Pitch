import './rightsidebar.css'
import { ALL_PLAYERS } from '../mainscreen/players/playersData'
import { displayName } from '../../utils'

const RANK_CLASSES = ['gold', 'silver', 'bronze']

export default function RightSidebar() {
  // Top 3 players
  const top3 = ALL_PLAYERS.slice(0, 3)
  // Current user's entry
  const youIndex = ALL_PLAYERS.findIndex(p => p.isYou)
  const you = ALL_PLAYERS[youIndex]

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

          {top3.map((p, i) => {
            const initials = (p.firstName[0] + p.lastName[0]).toUpperCase()
            const avg = p.games > 0 ? (p.stars / p.games).toFixed(1) : '0.0'
            return (
              <div key={initials} className="rank-item">
                <div className={`rank-num ${RANK_CLASSES[i]}`}>{i + 1}</div>
                <div className="rank-avatar" style={{background: p.grad}}>{initials}</div>
                <div className="rank-info">
                  <div className="rank-name">{displayName(p.firstName, p.nickname, p.lastName)}</div>
                  <div className="rank-stat">
                    <span style={{color: 'var(--gold)', fontSize: '14px'}}>★</span>{' '}
                    <strong style={{color: 'var(--text)'}}>{p.stars}</strong> &middot; {p.games} games &middot;{' '}
                    <span style={{color: 'var(--gold)'}}>{avg}★/g</span>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Current user row */}
          {you && (
            <div className="rank-item" style={{background: 'var(--accent-dim)', borderRadius: 'var(--rs)'}}>
              <div className="rank-num" style={{color: 'var(--accent)'}}>{youIndex + 1}</div>
              <div className="rank-avatar" style={{background: you.grad}}>
                {(you.firstName[0] + you.lastName[0]).toUpperCase()}
              </div>
              <div className="rank-info">
                <div className="rank-name" style={{color: 'var(--accent)'}}>You</div>
                <div className="rank-stat">
                  <span style={{color: 'var(--gold)', fontSize: '14px'}}>★</span>{' '}
                  <strong style={{color: 'var(--text)'}}>{you.stars}</strong> &middot; {you.games} games &middot;{' '}
                  <span style={{color: 'var(--gold)'}}>{(you.stars / you.games).toFixed(1)}★/g</span>
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
          <div className="notif-item" style={{borderLeftColor: 'var(--accent)'}}>
            <div>⚽ New game created &mdash; <strong>06:00</strong> on 03 March</div>
            <div className="notif-time">2 min ago</div>
          </div>
          <div className="notif-item" style={{borderLeftColor: 'var(--green)'}}>
            <div>👥 12:00 game is now full &mdash; all 18 spots taken</div>
            <div className="notif-time">Yesterday</div>
          </div>
          <div className="notif-item" style={{borderLeftColor: 'var(--red)', opacity: '.75'}}>
            <div>🚫 18:00 game was cancelled by admin</div>
            <div className="notif-time">Yesterday</div>
          </div>
        </div>
      </div>

    </aside>
  )
}
