import { useState, useEffect, useRef } from 'react'
import { collection, query, where, getDocs, getCountFromServer, doc, getDoc } from 'firebase/firestore'
import { db } from '../../../firebase'
import './games.css'
import GameModal from './GameModal'
import AdminModal from './AdminModal'

const MONTHS = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER']
const MONTH_DAYS = [31,28,31,30,31,30,31,31,30,31,30,31]
const MONTH_START_DAYS = [3,6,0,3,5,1,3,6,2,4,0,2] // day of week for 1st of each month in 2026 (0=Sun)
const DAY_NAMES   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const FULL_DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const FULL_MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function formatDateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function spotsFillClass(status) {
  if (status === 'full')      return 's-full'
  if (status === 'cancelled') return 's-red'
  return ''
}

function badgesForGame(game) {
  if (game.status === 'full')      return <span className="badge badge-full">Full</span>
  if (game.status === 'cancelled') return <span className="badge badge-cancelled">✕ Cancelled</span>
  return <>
    {game.joined && <span className="badge badge-joined">✓ Joined</span>}
    <span className="badge badge-open">Open</span>
  </>
}

const today = new Date()

export default function GamesScreen({ active, user }) {
  const [activeMonth, setActiveMonth]   = useState(today.getMonth())
  const [activeDay, setActiveDay]       = useState(today.getDate())
  const [games, setGames]               = useState([])
  const [loading, setLoading]           = useState(false)
  const [selectedGame, setSelectedGame] = useState(null)
  const [adminOpen, setAdminOpen]       = useState(false)
  const [isAdmin, setIsAdmin]           = useState(false)
  const [refreshKey, setRefreshKey]     = useState(0)

  const activeChipRef = useRef(null)

  // Subtitle e.g. "Monday, 09 March"
  const subtitle = `${FULL_DAYS[today.getDay()]}, ${String(today.getDate()).padStart(2,'0')} ${FULL_MONTHS[today.getMonth()]}`

  // Fetch user role to determine admin access
  useEffect(() => {
    async function fetchRole() {
      try {
        const userSnap = await getDoc(doc(db, 'users', user.uid))
        if (userSnap.exists()) {
          setIsAdmin(userSnap.data().role === 'admin')
        }
      } catch (err) {
        console.error('Error fetching role:', err)
      }
    }
    fetchRole()
  }, [user.uid])

  // Fetch games for selected date
  useEffect(() => {
    async function fetchGames() {
      setLoading(true)
      setGames([])
      try {
        const dateKey    = formatDateKey(today.getFullYear(), activeMonth, activeDay)
        const gamesQuery = query(collection(db, 'games'), where('date', '==', dateKey))
        const gamesSnap  = await getDocs(gamesQuery)

        if (gamesSnap.empty) { setLoading(false); return }

        const gamesWithStats = await Promise.all(
          gamesSnap.docs.map(async (gameDoc) => {
            const game       = { id: gameDoc.id, ...gameDoc.data() }
            const spotsTotal = (game.teams || 3) * (game.teamSize || 6)

            const resCountQuery = query(collection(db, 'reservations'), where('gameId', '==', game.id))
            const resCountSnap  = await getCountFromServer(resCountQuery)
            const spotsNum      = resCountSnap.data().count

            const userResQuery = query(
              collection(db, 'reservations'),
              where('gameId', '==', game.id),
              where('userId', '==', user.uid)
            )
            const userResSnap = await getDocs(userResQuery)
            const joined      = !userResSnap.empty

            let status = game.status || 'open'
            if (status !== 'cancelled' && status !== 'finished') {
              if (spotsNum >= spotsTotal) status = 'full'
            }

            return { ...game, spotsNum, spotsTotal, status, joined }
          })
        )

        gamesWithStats.sort((a, b) => a.time.localeCompare(b.time))
        setGames(gamesWithStats)
      } catch (err) {
        console.error('Error fetching games:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchGames()
  }, [activeDay, activeMonth, user.uid, refreshKey])

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

  // Scroll active date chip into view when selection changes
  useEffect(() => {
    if (activeChipRef.current) {
      activeChipRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }, [activeDay, activeMonth])

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
            <div className="page-subtitle">{subtitle} &middot; Tbilisi Public Pitch</div>
          </div>
          <div className="header-actions">
            {isAdmin && <button className="btn btn-admin" onClick={() => setAdminOpen(true)}>⚙ Create Reservation</button>}
            <button className="btn btn-primary" onClick={() => games.length > 0 && setSelectedGame(games[0])}>+ Reserve Spot</button>
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
              ref={activeDay === dayNum ? activeChipRef : null}
              className={`date-chip ${activeDay === dayNum ? 'active' : ''}`}
              onClick={() => setActiveDay(dayNum)}
            >
              <div className="dow">{dow}</div>
              <div className="dom">{String(dayNum).padStart(2, '0')}</div>
            </div>
          ))}
        </div>

        <div className="section-label">
          {loading
            ? 'Loading games...'
            : games.length > 0
              ? `${games.length} Game${games.length > 1 ? 's' : ''} · ${games[0]?.teams * games[0]?.teamSize} spots each (${games[0]?.teams} teams × ${games[0]?.teamSize} players)`
              : 'No games scheduled for this day'
          }
        </div>

        {/* GAME CARDS */}
        <div className="games">
          {games.map(game => (
            <div
              key={game.id}
              className={`game-card ${game.status} ${game.joined ? 'joined' : ''}`}
              onClick={() => setSelectedGame(game)}
            >
              <div className="game-top">
                <div className="game-time">{game.time}</div>
                <div className="game-badges">{badgesForGame(game)}</div>
              </div>
              <div className="game-meta">
                <span>⚽ {game.teamSize}-a-side · {game.teams} teams</span>
                <span>📍 Pitch {game.pitch}</span>
                <span>⏱ {game.duration} min</span>
              </div>
              <div className="player-row">
                <div className="avatars">
                  <div className="avatar more">👥 {game.spotsNum}</div>
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
      {selectedGame && <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} user={user} onReservationChanged={() => setRefreshKey(k => k + 1)} />}
      {adminOpen    && <AdminModal onClose={() => { setAdminOpen(false); setRefreshKey(k => k + 1) }} user={user} />}
    </>
  )
}
