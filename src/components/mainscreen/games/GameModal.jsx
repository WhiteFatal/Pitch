// TODO: replace static team data with real data from Firebase

const TEAMS = {
  a: { players: ['Marcus G.', 'Tom L.', 'You (AK)', 'JK', 'RD'], open: 1 },
  b: { players: ['Noa R.', 'SV', 'PK', 'LB'], open: 2 },
  c: { players: ['GN', 'MM'], open: 4 },
}

function BalanceDisplay({ balance }) {
  if (balance === 'Balanced')   return <span style={{color: 'var(--accent)'}}>Balanced ✓</span>
  if (balance === 'Unbalanced') return <span style={{color: 'var(--red)'}}>Unbalanced ⚠</span>
  if (balance === 'Cancelled')  return <span style={{color: 'var(--red)'}}>Cancelled ✕</span>
  return <span style={{color: 'var(--muted)'}}>TBD</span>
}

export default function GameModal({ game, onClose }) {
  if (!game) return null

  return (
    <div className={`modal-overlay ${game ? 'open' : ''}`} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-box" style={{width: '520px'}}>
        <div className="modal-close" onClick={onClose}>✕</div>
        <div className="modal-title">{game.time} Game</div>
        <div className="modal-sub">Pitch A &middot; 6-a-side &middot; 3 teams of 6 &middot; Today</div>

        <div className="modal-stats">
          <div className="modal-stat">
            <div className="modal-stat-label">Spots</div>
            <div className="modal-stat-val">{game.spots}</div>
          </div>
          <div className="modal-stat">
            <div className="modal-stat-label">Format</div>
            <div className="modal-stat-val">6-a-side</div>
          </div>
          <div className="modal-stat">
            <div className="modal-stat-label">Balance</div>
            <div className="modal-stat-val"><BalanceDisplay balance={game.balance} /></div>
          </div>
        </div>

        <div style={{fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '10px'}}>
          AI Team Split &middot; 3 &times; 6
        </div>

        <div className="team-split">
          {['a','b','c'].map(t => (
            <div key={t} className={`team-box t${t}`}>
              <div className={`team-label t${t}`}>Team {t.toUpperCase()}</div>
              {TEAMS[t].players.map((name, i) => (
                <div key={i} className="team-player">
                  <div className={`dot dot-${t}`}></div>{name}
                </div>
              ))}
              {Array.from({length: TEAMS[t].open}).map((_, i) => (
                <div key={i} className="team-player" style={{opacity: '.4'}}>
                  <div className={`dot dot-${t}`}></div>Open slot
                </div>
              ))}
            </div>
          ))}
        </div>

        <button className="btn btn-primary" style={{width: '100%', justifyContent: 'center', padding: '14px'}} onClick={onClose}>
          ✓ Confirm Spot
        </button>
        <button className="btn btn-ghost" style={{width: '100%', justifyContent: 'center', marginTop: '10px', padding: '12px'}} onClick={onClose}>
          Leave Game
        </button>
      </div>
    </div>
  )
}
