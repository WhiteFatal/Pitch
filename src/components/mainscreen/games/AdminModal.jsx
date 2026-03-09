import { useState } from 'react'

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

const TIME_OPTIONS = Array.from({length: 48}, (_, i) => {
  const h = String(Math.floor(i / 2)).padStart(2, '0')
  const m = i % 2 === 0 ? '00' : '30'
  return `${h}:${m}`
})

export default function AdminModal({ onClose }) {
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`

  const [form, setForm] = useState({
    date:     todayStr,
    time:     '21:30',
    pitch:    'A',
    duration: '60',
    teams:    '3',
    teamSize: '6',
    price:    '10',
  })

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit() {
    // TODO: save new game to Firebase when connected
    onClose()
  }

  // Derived values — no DOM reading needed
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
        <div className="modal-title">Create Reservation</div>
        <div className="modal-sub">Set up a new game slot for players to reserve</div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Game Date</label>
            <input
              type="date"
              className="form-input"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
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
              <option value="120">120 minutes</option>
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
              <option value="4">4 players</option>
              <option value="5">5 players</option>
              <option value="6">6 players (default)</option>
              <option value="7">7 players</option>
            </select>
          </div>

          <div className="form-divider"></div>

          <div className="form-group">
            <label className="form-label">Price per Spot</label>
            <div className="price-wrap">
              <input
                type="number"
                className="form-input"
                name="price"
                value={form.price}
                min="0"
                onChange={handleChange}
              />
              <span className="price-currency">GEL</span>
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
        </div>

        <div className="admin-summary">
          📋 <div>
            <strong>Game Summary:</strong> {teams} teams of {teamSize} &middot; {capacity} spots &middot; {price} GEL per spot &middot; Total pool: <strong>{pool} GEL</strong>
          </div>
        </div>

        <button className="btn btn-primary" style={{width: '100%', justifyContent: 'center', padding: '14px'}} onClick={handleSubmit}>
          ✓ Create Game Slot
        </button>
        <button className="btn btn-ghost" style={{width: '100%', justifyContent: 'center', marginTop: '10px', padding: '12px'}} onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  )
}
