import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc, Timestamp } from 'firebase/firestore'
import { db } from '../../../firebase'
import { displayName } from '../../../utils'
import { notifyReservedPlayers, notifyGameFull } from './notifHelpers'
import AdminModal from './AdminModal'

const TEAM_KEYS   = ['a', 'b', 'c', 'd']
const TEAM_COLORS = { a: '#4ade80', b: '#fb923c', c: '#f0f0f0', d: '#60a5fa' }

export default function GameModal({ game, onClose, user, onReservationChanged }) {
  const [teams, setTeams]                     = useState({})
  const [loading, setLoading]                 = useState(true)
  const [joined, setJoined]                   = useState(false)
  const [myReservationId, setMyReservationId] = useState(null)
  const [saving, setSaving]                   = useState(false)
  const [cancelling, setCancelling]           = useState(false)
  const [error, setError]                     = useState(null)
  const [editOpen, setEditOpen]               = useState(false)
  const [refreshKey, setRefreshKey]           = useState(0)

  // Primitives for useEffect dependency array
  const gameId  = game?.id
  const teamCnt = game?.teams || 3
  const gameUID = user?.uid

  useEffect(() => {
    if (!gameId) return

    const tKeys = TEAM_KEYS.slice(0, teamCnt)

    async function fetchReservations() {
      setLoading(true)
      try {
        const resSnap = await getDocs(query(
          collection(db, 'reservations'), where('gameId', '==', gameId)
        ))

        const buckets = Object.fromEntries(tKeys.map(k => [k, []]))
        let myResId   = null

        await Promise.all(resSnap.docs.map(async resDoc => {
          const res  = resDoc.data()
          const team = res.team?.toLowerCase()
          if (!buckets[team]) return

          const userSnap = await getDocs(query(collection(db, 'users'), where('__name__', '==', res.userId)))
          const userData = userSnap.docs[0]?.data()
          const name     = userData ? displayName(userData.firstName, userData.nickname, userData.lastName) : 'Player'
          const isYou    = res.userId === gameUID

          if (isYou) myResId = resDoc.id
          buckets[team].push({ name, isYou })
        }))

        setTeams(buckets)
        setJoined(!!myResId)
        setMyReservationId(myResId)
      } catch (err) {
        console.error('Error fetching reservations:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchReservations()
  }, [gameId, teamCnt, gameUID, refreshKey])

  if (!game) return null

  // Derived values — safe after early return
  const teamCount  = game.teams    || 3
  const teamSize   = game.teamSize || 6
  const teamKeys   = TEAM_KEYS.slice(0, teamCount)
  const spotsTotal = teamCount * teamSize
  const isCreator  = game.createdBy === user?.uid

  const spotsUsed   = Object.values(teams).reduce((sum, t) => sum + t.length, 0)
  const isFull      = spotsUsed >= spotsTotal
  const isCancelled = game.status === 'cancelled'
  const isStarted   = new Date() >= new Date(`${game.date}T${game.time}:00`)

  function refresh() {
    setRefreshKey(k => k + 1)
    onReservationChanged?.()
  }

  // Round-robin: pick team with fewest players
  function assignTeam() {
    return teamKeys.reduce((least, k) =>
      (teams[k]?.length || 0) < (teams[least]?.length || 0) ? k : least
    , teamKeys[0])
  }

  async function handleReserve() {
    setError(null)
    setSaving(true)
    try {
      await addDoc(collection(db, 'reservations'), {
        userId: user.uid, gameId: game.id, team: assignTeam(), joinedAt: Timestamp.now(),
      })

      // If this reservation fills the game, notify all other reserved players + creator
      if (spotsUsed + 1 >= spotsTotal) {
        await notifyGameFull(game, user.uid)
      }

      refresh()
    } catch (err) {
      console.error('Error reserving:', err)
      setError('Failed to reserve. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleLeave() {
    setError(null)
    setSaving(true)
    try {
      await deleteDoc(doc(db, 'reservations', myReservationId))

      // Only notify if game was full before this player left (spot just opened up)
      if (spotsUsed >= spotsTotal) {
        await notifyReservedPlayers(game, user.uid, 'player_withdrew')
      }

      refresh()
    } catch (err) {
      console.error('Error leaving:', err)
      setError('Failed to leave. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleCancel() {
    if (!window.confirm('Cancel this game? All reserved players will be notified.')) return
    setError(null)
    setCancelling(true)
    try {
      await updateDoc(doc(db, 'games', game.id), { status: 'cancelled' })

      const resSnap   = await getDocs(query(collection(db, 'reservations'), where('gameId', '==', game.id)))
      const playerIds = resSnap.docs.map(d => d.data().userId).filter(id => id !== user.uid)

      await Promise.all(playerIds.map(userId =>
        addDoc(collection(db, 'notifications'), {
          userId, type: 'game_cancelled',
          gameId: game.id, gameDate: game.date, gameTime: game.time, gamePitch: game.pitch,
          read: false, createdAt: Timestamp.now(),
        })
      ))

      onReservationChanged?.()
      onClose()
    } catch (err) {
      console.error('Error cancelling:', err)
      setError('Failed to cancel. Please try again.')
      setCancelling(false)
    }
  }

  return (
    <>
      <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
        <div className="modal-box" style={{width: '520px'}}>
          <div className="modal-close" onClick={onClose}>✕</div>
          <div className="modal-title">{game.time} Game</div>
          <div className="modal-sub">
            Pitch {game.pitch} &middot; {teamSize}-a-side &middot; {teamCount} teams of {teamSize} &middot; {game.date}
          </div>

          <div className="modal-stats">
            <div className="modal-stat">
              <div className="modal-stat-label">Spots</div>
              <div className="modal-stat-val">{spotsUsed} / {spotsTotal}</div>
            </div>
            <div className="modal-stat">
              <div className="modal-stat-label">Duration</div>
              <div className="modal-stat-val">{game.duration} min</div>
            </div>
            <div className="modal-stat">
              <div className="modal-stat-label">Price</div>
              <div className="modal-stat-val">{game.price} {game.currency || 'GEL'}</div>
            </div>
          </div>

          {game.bankAccount && (
            <div className="donate-row">
              <span className="donate-label">Donate to</span>
              <span className="donate-value">{game.bankAccount}</span>
            </div>
          )}

          <div className="team-split-label">
            Team Split &middot; {teamCount} &times; {teamSize}
          </div>

          {loading ? (
            <div className="modal-loading">Loading players...</div>
          ) : (
            <div className="team-split" style={{gridTemplateColumns: `repeat(${teamCount}, 1fr)`}}>
              {teamKeys.map(t => {
                const players   = teams[t] || []
                const openSlots = teamSize - players.length
                return (
                  <div key={t} className="team-box" style={{borderTopColor: TEAM_COLORS[t]}}>
                    <div className="team-label" style={{color: TEAM_COLORS[t]}}>Team {t.toUpperCase()}</div>
                    {players.map((p, i) => (
                      <div key={i} className="team-player" style={p.isYou ? {color: 'var(--accent)', fontWeight: 600} : {}}>
                        <div className="dot" style={{background: TEAM_COLORS[t]}}></div>
                        {p.name}{p.isYou ? ' (you)' : ''}
                      </div>
                    ))}
                    {Array.from({length: openSlots}).map((_, i) => (
                      <div key={i} className="team-player" style={{opacity: '.4'}}>
                        <div className="dot" style={{background: TEAM_COLORS[t]}}></div>
                        Open slot
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          )}

          {error && <div className="modal-error">{error}</div>}

          {/* CREATOR BUTTONS — edit and cancel */}
          {isCreator && !isCancelled && !isStarted && (
            <div className="modal-btn-row">
              <button className="btn btn-admin" onClick={() => setEditOpen(true)}>
                ✎ Edit Game
              </button>
              <button className="btn btn-danger" onClick={handleCancel} disabled={cancelling}>
                {cancelling ? 'Cancelling...' : '✕ Cancel Game'}
              </button>
            </div>
          )}

          {/* RESERVE/LEAVE — available to everyone including creator */}
          {!isCancelled && (
            isStarted ? (
              <div className="modal-cancelled" style={{color: 'var(--mid)'}}>⏱ Game in progress — registration closed</div>
            ) : joined ? (
              <button className="btn btn-ghost btn-full" onClick={handleLeave} disabled={saving}>
                {saving ? 'Leaving...' : '✕ Leave Game'}
              </button>
            ) : (
              <button className="btn btn-primary btn-full" onClick={handleReserve} disabled={saving || isFull}>
                {saving ? 'Reserving...' : isFull ? 'Game Full' : '✓ Reserve Spot'}
              </button>
            )
          )}

          {isCancelled && (
            <div className="modal-cancelled">✕ This game has been cancelled</div>
          )}

        </div>
      </div>

      {editOpen && (
        <AdminModal user={user} game={game} onClose={() => { setEditOpen(false); refresh(); onClose() }} />
      )}
    </>
  )
}
