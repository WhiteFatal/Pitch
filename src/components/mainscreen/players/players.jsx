import { useState, useEffect, useMemo } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../../firebase'
import './players.css'
import { displayName } from '../../../utils'

const PER_PAGE = 50

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

export default function PlayersScreen({ active, user }) {
  const [players, setPlayers]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const snap = await getDocs(collection(db, 'users'))
        const data = snap.docs.map((doc, i) => ({
          id:            doc.id,
          firstName:     doc.data().firstName     || '',
          nickname:      doc.data().nickname      || '',
          lastName:      doc.data().lastName      || '',
          starsReceived: doc.data().starsReceived || 0,
          gamesPlayed:   doc.data().gamesPlayed   || 0,
          photoURL:      doc.data().photoURL      || '',
          grad:          GRADIENTS[i % GRADIENTS.length],
        }))

        // Sort by starsReceived desc, then gamesPlayed desc
        data.sort((a, b) =>
          b.starsReceived !== a.starsReceived
            ? b.starsReceived - a.starsReceived
            : b.gamesPlayed - a.gamesPlayed
        )

        setPlayers(data)
      } catch (err) {
        console.error('Error fetching players:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPlayers()
  }, [user.uid])

  const totalPages  = Math.ceil(players.length / PER_PAGE)
  const start       = (currentPage - 1) * PER_PAGE
  const end         = Math.min(start + PER_PAGE, players.length)
  const pagePlayers = useMemo(() => players.slice(start, end), [players, start, end])

  function goPage(page) {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  return (
    <div className={`content screen ${active ? 'active' : ''}`} id="screen-players">

      <div className="page-header" style={{marginBottom: '28px'}}>
        <div>
          <div className="page-title">TOP PLAYERS</div>
          <div className="page-subtitle">Ranked by stars &rarr; then games played</div>
        </div>
      </div>

      <div className="players-table">
        <div className="players-header">
          <div>#</div>
          <div>Player</div>
          <div>Stars</div>
          <div>Games</div>
          <div>Avg/Game</div>
        </div>

        <div id="players-body">
          {loading && (
            <div style={{color: 'var(--muted)', padding: '40px', textAlign: 'center'}}>Loading players...</div>
          )}

          {!loading && players.length === 0 && (
            <div style={{color: 'var(--muted)', padding: '40px', textAlign: 'center'}}>No players found.</div>
          )}

          {pagePlayers.map((p, i) => {
            const rank      = start + i + 1
            const rankClass = rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : ''
            const initials  = ((p.firstName[0] || '') + (p.lastName[0] || '')).toUpperCase()
            const avg       = p.gamesPlayed > 0 ? (p.starsReceived / p.gamesPlayed).toFixed(1) : '0.0'

            return (
              <div key={p.id} className={`players-row ${p.id === user.uid ? 'you' : ''}`}>
                <div className={`p-rank ${rankClass}`}>{rank}</div>
                <div className="p-player">
                  {p.photoURL
                    ? <img className="p-avatar p-avatar-img" src={p.photoURL} alt={p.firstName} referrerPolicy="no-referrer" />
                    : <div className="p-avatar" style={{background: p.grad}}>{initials}</div>
                  }
                  <div className="p-name">
                    {displayName(p.firstName, p.nickname, p.lastName)}
                  </div>
                </div>
                <div className="p-stars">★ <span>{p.starsReceived}</span></div>
                <div className="p-games">{p.gamesPlayed}</div>
                <div className="p-games" style={{color: 'var(--gold)'}}>{avg} ★</div>
              </div>
            )
          })}
        </div>

        {!loading && players.length > 0 && (
          <div className="players-pagination">
            <span>Showing {start + 1}–{end} of {players.length} players</span>
            <div className="pagination-btns">
              {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`page-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => goPage(page)}
                >{page}</button>
              ))}
              {currentPage < totalPages && (
                <button className="page-btn" onClick={() => goPage(currentPage + 1)}>Next →</button>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
