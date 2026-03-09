import { useState, useEffect } from 'react'
import './games.css'
import GameModal from './GameModal'
import AdminModal from './AdminModal'

const MONTHS = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER']
const MONTH_DAYS = [31,28,31,30,31,30,31,31,30,31,30,31]
const MONTH_START_DAYS = [3,6,0,3,5,1,3,6,2,4,0,2] // day of week for 1st of each month in 2026 (0=Sun)
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

// TODO: replace with real games fetched from Firebase
const GAMES = [
  {
    id: 1,
    time: '06:00',
    spots: '11/18',
    spotsNum: 11,
    spotsTotal: 18,
    balance: 'Balanced',
    pitch: 'Pitch A',
    duration: '60 min',
    status: 'joined',
    avatars: [
      { initials: 'AK', grad: null },
      { initials: 'MG', grad: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
      { initials: 'TL', grad: 'linear-gradient(135deg,#10b981,#3b82f6)' },
      { initials: 'NR', grad: 'linear-gradient(135deg,#ec4899,#8b5cf6)' },
    ],
    extra: 7,
  },
  {
    id: 2,
    time: '09:30',
    spots: '6/18',
    spotsNum: 6,
    spotsTotal: 18,
    balance: 'Unbalanced',
    pitch: 'Pitch B',
    duration: '90 min',
    status: 'open',
    avatars: [
      { initials: 'JK', grad: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
      { initials: 'RD', grad: 'linear-gradient(135deg,#10b981,#3b82f6)' },
      { initials: 'SV', grad: 'linear-gradient(135deg,#ec4899,#8b5cf6)' },
    ],
    extra: 3,
  },
  {
    id: 3,
    time: '12:00',
    spots: '18/18',
    spotsNum: 18,
    spotsTotal: 18,
    balance: 'Balanced',
    pitch: 'Pitch A',
    duration: '60 min',
    status: 'full',
    avatars: [
      { initials: 'MM', grad: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
      { initials: 'PK', grad: 'linear-gradient(135deg,#10b981,#3b82f6)' },
      { initials: 'LB', grad: 'linear-gradient(135deg,#6366f1,#ec4899)' },
    ],
    extra: 15,
  },
  {
    id: 4,
    time: '18:00',
    spots: '3/18',
    spotsNum: 3,
    spotsTotal: 18,
    balance: 'Cancelled',
    pitch: 'Pitch C',
    duration: '90 min',
    status: 'cancelled',
    avatars: [
      { initials: 'AB', grad: 'linear-gradient(135deg,#6366f1,#ec4899)' },
      { initials: 'CE', grad: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
      { initials: 'DV', grad: 'linear-gradient(135deg,#10b981,#f59e0b)' },
    ],
    extra: 0,
  },
]

function spotsFillClass(status) {
  if (status === 'full')      return 's-full'
  if (status === 'cancelled') return 's-red'
  return ''
}

function badgesForGame(game) {
  if (game.status === 'full')      return <span className="badge badge-full">Full</span>
  if (game.status === 'cancelled') return <span className="badge badge-cancelled">✕ Cancelled</span>
  return <>
    {game.status === 'joined' && <span className="badge badge-joined">✓ Joined</span>}
    <span className="badge badge-open">Open</span>
  </>
}

export default function GamesScreen({ active }) {
  const today = new Date()
  const [activeMonth, setActiveMonth] = useState(today.getMonth())    // 0-indexed, synced to current month
  const [activeDay, setActiveDay]     = useState(today.getDate())     // synced to current day of month
  const [selectedGame, setSelectedGame] = useState(null)  // null = closed, game object = open
  const [adminOpen, setAdminOpen]       = useState(false)

  // Close modals on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setSelectedGame(null)
        setAdminOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Reset active day to 1 when month changes
  function changeMonth(dir) {
    setActiveMonth(prev => (prev + dir + 12) % 12)
    setActiveDay(1)
  }

  // Build day chips for current month
  const numDays  = MONTH_DAYS[activeMonth]
  const startDay = MONTH_START_DAYS[activeMonth]
  const days = Array.from({length: numDays}, (_, i) => {
    const dayNum = i + 1
    const dow = DAY_NAMES[(startDay + i) % 7]
    return { dayNum, dow }
  })

  return (
    <>
      <div className={`content screen ${active ? 'active' : ''}`} id="screen-games">

        <div className="page-header">
          <div>
            <div className="page-title">TODAY'S GAMES</div>
            <div className="page-subtitle">Wednesday, 02 March &middot; Tbilisi Public Pitch</div>
          </div>
          <div className="header-actions">
            <button className="btn btn-admin" onClick={() => setAdminOpen(true)}>⚙ Create Reservation</button>
            <button className="btn btn-primary" onClick={() => setSelectedGame(GAMES[0])}>+ Reserve Spot</button>
          </div>
        </div>

        {/* MONTH SWITCHER */}
        <div className="month-divider">
          <div className="month-divider-line" />
          <div className="month-divider-center">
            <button className="month-divider-btn" onClick={() => changeMonth(-1)} title="Previous month">«</button>
            <div className="month-divider-label">{MONTHS[activeMonth]}</div>
            <button className="month-divider-btn" onClick={() => changeMonth(1)} title="Next month">»</button>
          </div>
          <div className="month-divider-line" />
        </div>

        {/* DATE CHIPS */}
        <div className="date-row">
          {days.map(({ dayNum, dow }) => (
            <div
              key={dayNum}
              className={`date-chip ${activeDay === dayNum ? 'active' : ''}`}
              onClick={() => setActiveDay(dayNum)}
            >
              <div className="dow">{dow}</div>
              <div className="dom">{String(dayNum).padStart(2, '0')}</div>
            </div>
          ))}
        </div>

        <div className="section-label">Upcoming &middot; 4 Games &middot; 18 spots each (3 teams &times; 6 players)</div>

        {/* GAME CARDS */}
        <div className="games">
          {GAMES.map(game => (
            <div
              key={game.id}
              className={`game-card ${game.status}`}
              onClick={() => setSelectedGame(game)}
            >
              <div className="game-top">
                <div className="game-time">{game.time}</div>
                <div className="game-badges">{badgesForGame(game)}</div>
              </div>
              <div className="game-meta">
                <span>⚽ 6-a-side &middot; 3 teams</span>
                <span>📍 {game.pitch}</span>
                <span>⏱ {game.duration}</span>
              </div>
              <div className="player-row">
                <div className="avatars">
                  {game.avatars.map((a, i) => (
                    <div key={i} className="avatar" style={a.grad ? {background: a.grad} : {}}>{a.initials}</div>
                  ))}
                  {game.extra > 0 && <div className="avatar more">+{game.extra}</div>}
                </div>
                <div className="spots-bar">
                  <div className="spots-track">
                    <div
                      className={`spots-fill ${spotsFillClass(game.status)}`}
                      style={{width: `${Math.round((game.spotsNum / game.spotsTotal) * 100)}%`}}
                    ></div>
                  </div>
                  <div className="spots-text">{game.spotsNum} / {game.spotsTotal} spots filled</div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* MODALS */}
      {selectedGame && <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />}
      {adminOpen    && <AdminModal onClose={() => setAdminOpen(false)} />}
    </>
  )
}
