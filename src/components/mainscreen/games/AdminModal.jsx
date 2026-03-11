import { useState } from 'react'
import { collection, addDoc, updateDoc, doc, Timestamp } from 'firebase/firestore'
import { db } from '../../../firebase'
import { notifyAllUsers } from './notifHelpers'

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

const TIME_OPTIONS = Array.from({length: 48}, (_, i) => {
  const h = String(Math.floor(i / 2)).padStart(2, '0')
  const m = i % 2 === 0 ? '00' : '30'
  return `${h}:${m}`
})

export default function AdminModal({ onClose, user, game }) {
  const isEditMode = !!game
  const today      = new Date()
  const todayStr   = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`

  const [form, setForm] = useState({
    date:        isEditMode ? game.date                   : todayStr,
    time:        isEditMode ? game.time                   : '21:30',
    pitch:       isEditMode ? game.pitch                  : 'A',
    duration:    isEditMode ? String(game.duration)       : '120',
    teams:       isEditMode ? String(game.teams)          : '3',
    teamSize:    isEditMode ? String(game.teamSize)       : '6',
    price:       isEditMode ? String(game.price)          : '10',
    currency:    isEditMode ? (game.currency    || 'GEL') : 'GEL',
    bankAccount: isEditMode ? (game.bankAccount || '')    : '',
  })

  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState(null)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit() {
    setError(null)
    setSaving(true)
    try {
      const teams    = parseInt(form.teams)    || 3
      const teamSize = parseInt(form.teamSize) || 6
      const duration = parseInt(form.duration) || 120
      const price    = parseInt(form.price)    || 0

      const [year, month, day] = form.date.split('-').map(Number)
      const [hour, minute]     = form.time.split(':').map(Number)
      const startDate = new Date(year, month - 1, day, hour, minute)
      const endDate   = new Date(startDate.getTime() + duration * 60 * 1000)

      const gameData = {
        date:        form.date,
        time:        form.time,
        duration,
        pitch:       form.pitch,
        teams,
        teamSize,
        price,
        currency:    form.currency,
        bankAccount: form.bankAccount.trim(),
        endTime:     Timestamp.fromDate(endDate),
      }

      if (isEditMode) {
        await updateDoc(doc(db, 'games', game.id), gameData)
      } else {
        const newGameRef = await addDoc(collection(db, 'games'), {
          ...gameData,
          status:    'open',
          createdBy: user.uid,
          createdAt: Timestamp.now(),
        })
        // Notify all users about the new game
        await notifyAllUsers({ id: newGameRef.id, ...gameData })
      }

      onClose()
    } catch (err) {
      console.error('Error saving game:', err)
      setError('Failed to save game. Please try again.')
      setSaving(false)
    }
  }

  const teams    = parseInt(form.teams)    || 3
  const teamSize = parseInt(form.teamSize) || 6
  const price    = parseInt(form.price)    || 0
  const capacity = teams * teamSize
  const pool     = capacity * price

  const dayOfWeek = form.date
    ? DAYS[new Date(form.date + 'T00:00:00').getDay()]
    : ''

  return (
    <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-box admin-modal-box">
        <div className="modal-close" onClick={onClose}>✕</div>
        <div className="admin-badge">⚙ Admin Only</div>
        <div className="modal-title">{isEditMode ? 'Edit Game' : 'Create Reservation'}</div>
        <div className="modal-sub">
          {isEditMode ? 'Update the details for this game slot' : 'Set up a new game slot for players to reserve'}
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Game Date</label>
            <input type="date" className="form-input" name="date" value={form.date} onChange={handleChange} />
            <span className="form-hint" style={{color: 'var(--accent)', fontWeight: '600'}}>{dayOfWeek}</span>
          </div>

          <div className="form-group">
            <label className="form-label">Game Time</label>
            <select className="form-select" name="time" value={form.time} onChange={handleChange}>
              {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="form-divider"></div>

          <div className="form-group">
            <label className="form-label">Pitch</label>
            <select className="form-select" name="pitch" value={form.pitch} onChange={handleChange}>
              <option value="A">Pitch A</option>
              <option value="B">Pitch B</option>
              <option value="C">Pitch C</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Duration</label>
            <select className="form-select" name="duration" value={form.duration} onChange={handleChange}>
              <option value="60">60 minutes</option>
              <option value="90">90 minutes</option>
              <option value="120">120 minutes (default)</option>
            </select>
          </div>

          <div className="form-divider"></div>

          <div className="form-group">
            <label className="form-label">Number of Teams</label>
            <select className="form-select" name="teams" value={form.teams} onChange={handleChange}>
              <option value="2">2 teams</option>
              <option value="3">3 teams (default)</option>
              <option value="4">4 teams</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Players per Team</label>
            <select className="form-select" name="teamSize" value={form.teamSize} onChange={handleChange}>
              <option value="5">5 players</option>
              <option value="6">6 players (default)</option>
              <option value="7">7 players</option>
              <option value="8">8 players</option>
              <option value="9">9 players</option>
              <option value="10">10 players</option>
              <option value="11">11 players</option>
            </select>
          </div>

          <div className="form-divider"></div>

          <div className="form-group">
            <label className="form-label">Price per Spot</label>
            <div className="price-wrap">
              <input type="number" className="form-input" name="price" value={form.price} min="0" onChange={handleChange} />
              <select className="form-select" name="currency" value={form.currency} onChange={handleChange} style={{width: '80px', flexShrink: 0}}>
                <option value="GEL">GEL</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
            <span className="form-hint">Per player reservation fee</span>
          </div>

          <div className="form-group">
            <label className="form-label">Total Capacity</label>
            <div className="form-input" style={{pointerEvents: 'none', opacity: '.7'}}>
              {capacity} players ({teams} x {teamSize})
            </div>
            <span className="form-hint">Auto-calculated</span>
          </div>

          <div className="form-divider"></div>

          <div className="form-group" style={{gridColumn: '1 / -1'}}>
            <label className="form-label">Donate to <span style={{color: 'var(--muted)', fontWeight: 400}}>— optional</span></label>
            <input
              type="text"
              className="form-input"
              name="bankAccount"
              value={form.bankAccount}
              onChange={handleChange}
              placeholder="e.g. GE12BG0000000123456789"
            />
            <span className="form-hint">Bank account number shown to players when they join</span>
          </div>

        </div>

        <div className="admin-summary">
          📋 <div>
            <strong>Game Summary:</strong> {teams} teams of {teamSize} &middot; {capacity} spots &middot; {price} {form.currency} per spot &middot; Total pool: <strong>{pool} {form.currency}</strong>
          </div>
        </div>

        {error && (
          <div style={{color: 'var(--red)', fontSize: '13px', marginBottom: '12px'}}>{error}</div>
        )}

        <button
          className="btn btn-primary"
          style={{width: '100%', justifyContent: 'center', padding: '14px'}}
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? 'Saving...' : isEditMode ? '✓ Save Changes' : '✓ Create Game Slot'}
        </button>
        <button
          className="btn btn-ghost"
          style={{width: '100%', justifyContent: 'center', marginTop: '10px', padding: '12px'}}
          onClick={onClose}
          disabled={saving}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
