import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc, increment, Timestamp } from 'firebase/firestore'
import { db } from '../../../firebase'
import { displayName } from '../../../utils'
import AdminModal from './AdminModal'

const TEAM_KEYS = ['a', 'b', 'c', 'd']
const TEAM_COLORS = {
  a: '#4ade80',
  b: '#fb923c',
  c: '#f0f0f0',
  d: '#60a5fa',
}

export default function GameModal({ game, onClose, user, onReservationChanged }) {
  const [teams, setTeams]                     = useState({})
  const [loading, setLoading]                 = useState(true)
  const [joined, setJoined]                   = useState(false)
  const [myReservationId, setMyReservationId] = useState(null)
  const [saving, setSaving]                   = useState(false)
  const [cancelling, setCancelling]           = useState(false)
  const [error, setError]                     = useState(null)
  const [editOpen, setEditOpen]               = useState(false)

  const teamCount  = game?.teams    || 3
  const teamSize   = game?.teamSize || 6
  const spotsTotal = teamCount * teamSize
  const teamKeys   = TEAM_KEYS.slice(0, teamCount)
  const isCreator  = game?.createdBy === user?.uid

  async function fetchReservations() {
    setLoading(true)
    try {
      const resQuery = query(collection(db, 'reservations'), where('gameId', '==', game.id))
      const resSnap  = await getDocs(resQuery)

      const buckets = {}
      teamKeys.forEach(k => { buckets[k] = [] })
      let foundMyReservation = null

      await Promise.all(resSnap.docs.map(async (resDoc) => {
        const res      = resDoc.data()
        const team     = res.team?.toLowerCase()
        if (!buckets[team]) return

        const userSnap = await getDocs(query(collection(db, 'users'), where('__name__', '==', res.userId)))
        const userData = userSnap.docs[0]?.data()
        const name     = userData
          ? displayName(userData.firstName, userData.nickname, userData.lastName)
          : 'Player'
        const isYou    = res.userId === user.uid

        if (isYou) foundMyReservation = resDoc.id
        buckets[team].push({ name, isYou, reservationId: resDoc.id, userId: res.userId })
      }))

      setTeams(buckets)
      setJoined(!!foundMyReservation)
      setMyReservationId(foundMyReservation)
    } catch (err) {
      console.error('Error fetching reservations:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!game) return
    fetchReservations()
  }, [game?.id])

  if (!game) return null

  function assignTeam(buckets) {
    return teamKeys.reduce((least, k) =>
      (buckets[k]?.length || 0) < (buckets[least]?.length || 0) ? k : least
    , teamKeys[0])
  }

  async function handleReserve() {
    setError(null)
    setSaving(true)
    try {
      const assignedTeam = assignTeam(teams)
      await addDoc(collection(db, 'reservations'), {
        userId:   user.uid,
        gameId:   game.id,
        team:     assignedTeam,
        joinedAt: Timestamp.now(),
      })
      await updateDoc(doc(db, 'users', user.uid), { gamesPlayed: increment(1) })
      await fetchReservations()
      onReservationChanged?.()
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
      await updateDoc(doc(db, 'users', user.uid), { gamesPlayed: increment(-1) })
      await fetchReservations()
      onReservationChanged?.()
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
      // 1. Update game status to cancelled
      await updateDoc(doc(db, 'games', game.id), { status: 'cancelled' })

      // 2. Collect all reserved players
      const resQuery = query(collection(db, 'reservations'), where('gameId', '==', game.id))
      const resSnap  = await getDocs(resQuery)
      const playerIds = resSnap.docs.map(d => d.data().userId).filter(id => id !== user.uid)

      // 3. Write a notification for each reserved player
      await Promise.all(playerIds.map(userId =>
        addDoc(collection(db, 'notifications'), {
          userId,
          type:      'game_cancelled',
          gameId:    game.id,
          gameDate:  game.date,
          gameTime:  game.time,
          gamePitch: game.pitch,
          read:      false,
          createdAt: Timestamp.now(),
        })
      ))

      onReservationChanged?.()
      onClose()
    } catch (err) {
      console.error('Error cancelling game:', err)
      setError('Failed to cancel. Please try again.')
      setCancelling(false)
    }
  }

  const spotsUsed   = Object.values(teams).reduce((sum, t) => sum + t.length, 0)
  const isFull      = spotsUsed >= spotsTotal
  const isCancelled = game.status === 'cancelled'

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
            <div style={{background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <span style={{color: 'var(--muted)', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase'}}>Donate to</span>
              <span style={{fontWeight: 600, letterSpacing: '0.5px'}}>{game.bankAccount}</span>
            </div>
          )}

          <div style={{fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '10px'}}>
            Team Split &middot; {teamCount} &times; {teamSize}
          </div>

          {loading ? (
            <div style={{color: 'var(--muted)', fontSize: '13px', textAlign: 'center', padding: '20px 0'}}>Loading players...</div>
          ) : (
            <div className="team-split" style={{gridTemplateColumns: `repeat(${teamCount}, 1fr)`}}>
              {teamKeys.map(t => {
                const players   = teams[t] || []
                const openSlots = teamSize - players.length
                return (
                  <div key={t} className={`team-box t${t}`} style={{borderTopColor: TEAM_COLORS[t]}}>
                    <div className={`team-label t${t}`} style={{color: TEAM_COLORS[t]}}>Team {t.toUpperCase()}</div>
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

          {error && (
            <div style={{color: 'var(--red)', fontSize: '13px', marginBottom: '12px'}}>{error}</div>
          )}

          {/* CREATOR BUTTONS */}
          {isCreator && !isCancelled && (
            <div style={{display: 'flex', gap: '10px'}}>
              <button
                className="btn btn-admin"
                style={{flex: 1, justifyContent: 'center', padding: '13px'}}
                onClick={() => setEditOpen(true)}
              >
                ✎ Edit Game
              </button>
              <button
                className="btn btn-ghost"
                style={{flex: 1, justifyContent: 'center', padding: '13px', borderColor: 'var(--red)', color: 'var(--red)'}}
                onClick={handleCancel}
                disabled={cancelling}
              >
                {cancelling ? 'Cancelling...' : '✕ Cancel Game'}
              </button>
            </div>
          )}

          {/* RESERVE/LEAVE — available to everyone including creator */}
          {!isCancelled && (
            joined ? (
              <button
                className="btn btn-ghost"
                style={{width: '100%', justifyContent: 'center', padding: '14px', marginTop: isCreator ? '10px' : '0'}}
                onClick={handleLeave}
                disabled={saving}
              >
                {saving ? 'Leaving...' : '✕ Leave Game'}
              </button>
            ) : (
              <button
                className="btn btn-primary"
                style={{width: '100%', justifyContent: 'center', padding: '14px', marginTop: isCreator ? '10px' : '0'}}
                onClick={handleReserve}
                disabled={saving || isFull}
              >
                {saving ? 'Reserving...' : isFull ? 'Game Full' : '✓ Reserve Spot'}
              </button>
            )
          )}

          {isCancelled && (
            <div style={{textAlign: 'center', color: 'var(--red)', fontWeight: 600, padding: '14px'}}>
              ✕ This game has been cancelled
            </div>
          )}

        </div>
      </div>

      {/* Edit modal — pre-filled with current game data */}
      {editOpen && (
        <AdminModal
          user={user}
          game={game}
          onClose={() => {
            setEditOpen(false)
            onReservationChanged?.()
            onClose()
          }}
        />
      )}
    </>
  )
}
