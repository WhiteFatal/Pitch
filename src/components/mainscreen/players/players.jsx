// useMemo: uncomment usage after connecting Firebase (for sorting/filtering live data)
//import { useState, useMemo } from 'react' 
import { useState } from 'react' // useMemo: uncomment usage after connecting Firebase (for sorting/filtering live data)
import './players.css'
import { ALL_PLAYERS } from './playersData'
import { displayName } from '../../../utils'

const PER_PAGE = 50

export default function PlayersScreen({ active }) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(ALL_PLAYERS.length / PER_PAGE)
  const start = (currentPage - 1) * PER_PAGE
  const end = Math.min(start + PER_PAGE, ALL_PLAYERS.length)
  const pagePlayers = ALL_PLAYERS.slice(start, end)

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
          {pagePlayers.map((p, i) => {
            const rank = start + i + 1
            const rankClass = rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : ''
            const initials = (p.firstName[0] + p.lastName[0]).toUpperCase()
            const avg = p.games > 0 ? (p.stars / p.games).toFixed(1) : '0.0'

            return (
              <div key={`${p.firstName}-${p.lastName}`} className={`players-row ${p.isYou ? 'you' : ''}`}>
                <div className={`p-rank ${rankClass}`}>{rank}</div>
                <div className="p-player">
                  <div className="p-avatar" style={{background: p.grad}}>{initials}</div>
                  <div className="p-name">
                    {displayName(p.firstName, p.nickname, p.lastName)}
                    {p.isYou && <span className="p-you">YOU</span>}
                  </div>
                </div>
                <div className="p-stars">&#9733; <span>{p.stars}</span></div>
                <div className="p-games">{p.games}</div>
                <div className="p-games" style={{color: 'var(--gold)'}}>{avg} &#9733;</div>
              </div>
            )
          })}
        </div>

        <div className="players-pagination">
          <span>Showing {start + 1}–{end} of {ALL_PLAYERS.length} players</span>
          <div className="pagination-btns">
            {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`page-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => goPage(page)}
              >{page}</button>
            ))}
            {currentPage < totalPages && (
              <button className="page-btn" onClick={() => goPage(currentPage + 1)}>Next &rarr;</button>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}
