import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, updateDoc, doc, increment, writeBatch, serverTimestamp } from 'firebase/firestore'
import { db } from '../../../firebase'
import { displayName } from '../../../utils'

const TEAM_COLORS = { a: '#4ade80', b: '#fb923c', c: '#f0f0f0', d: '#60a5fa' }
const VOTING_WINDOW_MS = 24 * 60 * 60 * 1000 // 24 hours

export default function StarModal({ game, onClose, user }) {
  const [players, setPlayers]               = useState([]) // all players in game excl. current user
  const [myReservationId, setMyReservationId] = useState(null)
  const [myVote, setMyVote]                 = useState(null) // userId I voted for
  const [starCounts, setStarCounts]         = useState({})  // userId → star count in this game
  const [loading, setLoading]               = useState(true)
  const [saving, setSaving]                 = useState(false)

  const gameEnd      = game.endTime?.toDate()
  const votingOpen   = gameEnd && (new Date() - gameEnd) < VOTING_WINDOW_MS
  const timeLeftMs   = votingOpen ? VOTING_WINDOW_MS - (new Date() - gameEnd) : 0
  const hoursLeft    = Math.floor(timeLeftMs / 3600000)
  const minutesLeft  = Math.floor((timeLeftMs % 3600000) / 60000)

  useEffect(() => {
    if (!game?.id) return

    async function fetchData() {
      setLoading(true)
      try {
        // Fetch all reservations for this game
        const resSnap = await getDocs(query(
          collection(db, 'reservations'), where('gameId', '==', game.id)
        ))

        // Count stars received per player in this game
        const counts = {}
        let myResId  = null
        let myVotedFor = null

        resSnap.docs.forEach(d => {
          const data = d.data()
          if (data.userId === user.uid) {
            myResId    = d.id
            myVotedFor = data.starGivenTo || null
          }
          if (data.starGivenTo) {
            counts[data.starGivenTo] = (counts[data.starGivenTo] || 0) + 1
          }
        })

        // Increment gamesPlayed for all reserved players on first open
        if (!game.gamesCountedAt) {
          const batch = writeBatch(db)
          resSnap.docs.forEach(d => {
            batch.update(doc(db, 'users', d.data().userId), { gamesPlayed: increment(1) })
          })
          batch.update(doc(db, 'games', game.id), { gamesCountedAt: serverTimestamp() })
          await batch.commit()
        }

        setMyReservationId(myResId)
        setMyVote(myVotedFor)
        setStarCounts(counts)

        // Fetch player names for all reservations except current user
        const otherDocs = resSnap.docs.filter(d => d.data().userId !== user.uid)
        const playerList = await Promise.all(otherDocs.map(async d => {
          const res      = d.data()
          const userSnap = await getDocs(query(collection(db, 'users'), where('__name__', '==', res.userId)))
          const userData = userSnap.docs[0]?.data()
          return {
            userId: res.userId,
            team:   res.team?.toLowerCase(),
            name:   userData ? displayName(userData.firstName, userData.nickname, userData.lastName) : 'Player',
          }
        }))

        setPlayers(playerList)
      } catch (err) {
        console.error('Error fetching star data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [game?.id, game?.gamesCountedAt, user.uid])

  async function handleVote(targetUserId) {
    if (!votingOpen || myVote || saving || !myReservationId) return
    setSaving(true)
    try {
      // Record vote on current user's reservation
      await updateDoc(doc(db, 'reservations', myReservationId), {
        starGivenTo: targetUserId,
        starGivenAt: new Date(),
      })
      // Increment star count on target user's profile
      await updateDoc(doc(db, 'users', targetUserId), {
        starsReceived: increment(1),
      })
      // Update local state
      setMyVote(targetUserId)
      setStarCounts(prev => ({ ...prev, [targetUserId]: (prev[targetUserId] || 0) + 1 }))
    } catch (err) {
      console.error('Error giving star:', err)
    } finally {
      setSaving(false)
    }
  }

  const teamCount = game.teams    || 3
  const teamSize  = game.teamSize || 6

  return (
    <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-box" style={{width: '520px'}}>
        <div className="modal-close" onClick={onClose}>✕</div>

        <div className="modal-title">{game.time} Game ★</div>
        <div className="modal-sub">
          Pitch {game.pitch} &middot; {teamSize}-a-side &middot; {teamCount} teams &middot; {game.date}
        </div>

        {/* Voting status banner */}
        {votingOpen ? (
          <div className="star-banner star-banner-open">
            ⏱ Voting open &mdash; {hoursLeft}h {minutesLeft}m remaining
            {myVote
              ? ' · You already voted'
              : ' · Tap ★ to award a star'
            }
          </div>
        ) : (
          <div className="star-banner star-banner-closed">
            ✕ Voting closed &mdash; stars are final
          </div>
        )}

        {loading ? (
          <div className="modal-loading">Loading players...</div>
        ) : players.length === 0 ? (
          <div className="modal-loading">No other players found.</div>
        ) : (
          <div className="star-player-list">
            {players.map(p => {
              const count   = starCounts[p.userId] || 0
              const isMyVote = myVote === p.userId
              const canVote  = votingOpen && !myVote && !saving
              return (
                <div key={p.userId} className={`star-player-row ${isMyVote ? 'my-vote' : ''}`}>
                  <div className="star-player-dot" style={{background: TEAM_COLORS[p.team] || '#888'}}></div>
                  <div className="star-player-name">{p.name}</div>
                  <button
                    className={`star-btn ${isMyVote ? 'voted' : ''} ${canVote ? 'clickable' : ''}`}
                    onClick={() => canVote && handleVote(p.userId)}
                    disabled={!canVote}
                    title={canVote ? 'Give a star' : myVote ? 'Already voted' : 'Voting closed'}
                  >
                    ★ {count}
                  </button>
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}
